const fs = require('fs')
const cheerio = require('cheerio')
const request = require('request')
const moment = require('moment')

Object.assign(String.prototype, {
  toFloat (opt = {}) {
    try {
      const num = parseFloat(this.replace(/,/g, ''))
      if (opt.multiply) return num * opt.multiply
      else return num
    } catch (err) {
      return this.toString()
    }
  }
})

function readFromFile () {
  return new Promise((resolve, reject) => {
    fs.readFile('./tmp/sample.html', (err, data) => {
      if (err) reject(err)
      resolve(data.toString())
    })
  })
}

function get (symbol = '') {
  return new Promise((resolve, reject) => {
    try {
      let output = {}
      if (symbol) {
        switch (symbol.toUpperCase()) {
          case 'SET50':
            output = getSET50()
            break
          case 'SET100':
            output = getSET100()
            break
          case 'SSET':
            output = getSSET()
            break
          case 'SETHD':
            output = getSETHD()
            break
          default:
            output = get(symbol)
        }
      } else {
        output = getIndexes()
      }
      output.then(res => {
        resolve(res)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getUpdatedAt ($) {
  try {
    const text = $('.table-info').children().first().text().split('Last Update ')[1].trim()
    return moment(`${text} +0700`, 'DD/MM/YYYY HH:mm:ss ZZ').toDate()
  } catch (err) {
    console.error(err)
    return ''
  }
}

function getIndexes () {
  return new Promise((resolve, reject) => {
    try {
      const url = 'https://marketdata.set.or.th/mkt/sectorquotation.do?sector=SET50&language=en&country=US'
      request(url, (err, response, body) => {
        if (err) throw err
        const $ = cheerio.load(body)
        const rows = $('#maincontent table.table-info tbody').eq(0).children('tr')
        const indexes = []
        rows.each((_, row) => {
          const cols = $(row).find('td')
          const symbol = cols.eq(0).text().trim()
          const last = cols.eq(1).text().trim()
          const change = cols.eq(2).text().trim()
          const changePercent = cols.eq(3).text().trim()
          const high = cols.eq(4).text().trim()
          const low = cols.eq(5).text().trim()
          const volume = cols.eq(6).text().trim()
          const value = cols.eq(7).text().trim()
          indexes.push({
            symbol: symbol,
            last: last.toFloat(),
            change: change.toFloat(),
            changePercent: changePercent.toFloat(),
            high: high.toFloat(),
            low: low.toFloat(),
            volume: volume.toFloat({ multiply: 1e3 }),
            value: value.toFloat({ multiply: 1e6 })
          })
        })
        resolve({ updatedAt: getUpdatedAt($), indexes: indexes })
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getSET50 ($) {
  try {
    const body = ''
    const $ = cheerio.load(body)
    return ''
  } catch (err) {
    console.error(err)
    return 0
  }
}

function getSET100 ($) {
  try {
    const body = ''
    const $ = cheerio.load(body)
    return ''
  } catch (err) {
    console.error(err)
    return 0
  }
}

function getSSET ($) {
  try {
    const body = ''
    const $ = cheerio.load(body)
    return ''
  } catch (err) {
    console.error(err)
    return 0
  }
}

function getSETHD ($) {
  try {
    const body = ''
    const $ = cheerio.load(body)
    return ''
  } catch (err) {
    console.error(err)
    return 0
  }
}

module.exports = { get }
