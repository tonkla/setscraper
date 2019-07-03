const cheerio = require('cheerio')
const request = require('request')
const moment = require('moment')
require('./utils')

function get(symbol = '') {
  return new Promise((resolve, reject) => {
    try {
      let output = {}
      if (symbol) {
        switch (symbol.toUpperCase()) {
          case 'SET50':
            output = getByIndex('SET50')
            break
          case 'SET100':
            output = getByIndex('SET100')
            break
          case 'SSET':
            output = getByIndex('sSET')
            break
          case 'SETHD':
            output = getByIndex('SETHD')
            break
          default:
            output = getBySymbol(symbol)
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

function getUpdatedAt($) {
  try {
    const text = $('.table-info')
      .children()
      .first()
      .text()
      .split('Last Update ')[1]
      .trim()
    return moment(`${text} +0700`, 'DD/MM/YYYY HH:mm:ss ZZ').toDate()
  } catch (err) {
    console.error(err)
    return ''
  }
}

function getUpdatedAtStr(str) {
  try {
    const text = str.split(' Last Update ')[1]
    return moment(`${text} +0700`, 'DD MMM YYYY HH:mm:ss ZZ').toDate()
  } catch (err) {
    console.error(err)
    return ''
  }
}

function extractIndexes($) {
  const rows = $('#maincontent table.table-info tbody')
    .eq(0)
    .find('tr')
  const indexes = []
  rows.each((_, row) => {
    const cols = $(row).find('td')
    const symbol = cols
      .eq(0)
      .text()
      .trim()
    const last = cols
      .eq(1)
      .text()
      .trim()
    const change = cols
      .eq(2)
      .text()
      .trim()
    const percentChange = cols
      .eq(3)
      .text()
      .trim()
    const high = cols
      .eq(4)
      .text()
      .trim()
    const low = cols
      .eq(5)
      .text()
      .trim()
    const volume = cols
      .eq(6)
      .text()
      .trim()
    const value = cols
      .eq(7)
      .text()
      .trim()
    indexes.push({
      symbol: symbol,
      last: last.toFloat(),
      change: change.toFloat(),
      percentChange: percentChange.toFloat(),
      high: high.toFloat(),
      low: low.toFloat(),
      volume: volume.toFloat({ multiply: 1e3 }),
      value: value.toFloat({ multiply: 1e6 }),
    })
  })
  return indexes
}

function extractList($) {
  const rows = $('#maincontent table.table-info tbody')
    .eq(2)
    .find('tr')
  const list = []
  rows.each((_, row) => {
    const cols = $(row).find('td')
    const symbol = cols
      .eq(0)
      .text()
      .trim()
    const sign = cols
      .eq(1)
      .text()
      .trim()
    const open = cols
      .eq(2)
      .text()
      .trim()
    const high = cols
      .eq(3)
      .text()
      .trim()
    const low = cols
      .eq(4)
      .text()
      .trim()
    const last = cols
      .eq(5)
      .text()
      .trim()
    const change = cols
      .eq(6)
      .text()
      .trim()
    const percentChange = cols
      .eq(7)
      .text()
      .trim()
    const bid = cols
      .eq(8)
      .text()
      .trim()
    const offer = cols
      .eq(9)
      .text()
      .trim()
    const volume = cols
      .eq(10)
      .text()
      .trim()
    const value = cols
      .eq(11)
      .text()
      .trim()
    list.push({
      symbol: symbol,
      sign: sign,
      open: open.toFloat(),
      high: high.toFloat(),
      low: low.toFloat(),
      last: last.toFloat(),
      change: change.toFloat(),
      percentChange: percentChange.toFloat(),
      bid: bid.toFloat(),
      offer: offer.toFloat(),
      volume: volume.toFloat(),
      value: value.toFloat({ multiply: 1e3 }),
    })
  })
  return list
}

function getIndexes() {
  return new Promise((resolve, reject) => {
    try {
      const url =
        'https://marketdata.set.or.th/mkt/marketsummary.do?language=en&country=US'
      request(url, (err, response, body) => {
        if (err) throw err
        const $ = cheerio.load(body)
        resolve({ updatedAt: getUpdatedAt($), indexes: extractIndexes($) })
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getByIndex(index) {
  return new Promise((resolve, reject) => {
    try {
      const url = `https://marketdata.set.or.th/mkt/sectorquotation.do?sector=${index}&language=en&country=US`
      request(url, (err, response, body) => {
        if (err) throw err
        const $ = cheerio.load(body)
        resolve({
          updatedAt: getUpdatedAt($),
          indexes: extractIndexes($),
          index: index,
          stocks: extractList($),
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getBySymbol(symbol) {
  return new Promise((resolve, reject) => {
    try {
      const url = `https://marketdata.set.or.th/mkt/stockquotation.do?symbol=${symbol.toUpperCase()}&ssoPageId=1&language=en&country=US`
      request(url, (err, response, body) => {
        if (err) throw err
        const $ = cheerio.load(body)
        const tables = $('#maincontent .row .row')
          .eq(2)
          .find('table')

        let r = $(tables)
          .eq(0)
          .find('tr')
        const updatedAt = r
          .eq(0)
          .children()
          .eq(0)
          .text()
          .trim()
        const marketStatus = r
          .eq(1)
          .children()
          .eq(0)
          .text()
          .trim()
        const sign = r
          .eq(2)
          .children()
          .eq(1)
          .text()
          .trim()
        const last = r
          .eq(3)
          .children()
          .eq(1)
          .text()
          .trim()
        const change = r
          .eq(4)
          .children()
          .eq(1)
          .text()
          .trim()
        const percentChange = r
          .eq(5)
          .children()
          .eq(1)
          .text()
          .trim()
        const prior = r
          .eq(6)
          .children()
          .eq(1)
          .text()
          .trim()
        const open = r
          .eq(7)
          .children()
          .eq(1)
          .text()
          .trim()
        const high = r
          .eq(8)
          .children()
          .eq(1)
          .text()
          .trim()
        const low = r
          .eq(9)
          .children()
          .eq(1)
          .text()
          .trim()
        const volume = r
          .eq(10)
          .children()
          .eq(1)
          .text()
          .trim()
        const value = r
          .eq(11)
          .children()
          .eq(1)
          .text()
          .trim()
        const average = r
          .eq(12)
          .children()
          .eq(1)
          .text()
          .trim()
        let s = {
          updatedAt: getUpdatedAtStr(updatedAt),
          marketStatus: marketStatus.split(' : ')[1],
          sign: sign,
          last: last.toFloat(),
          change: change.toFloat(),
          percentChange: percentChange.toFloat(),
          prior: prior.toFloat(),
          open: open.toFloat(),
          high: high.toFloat(),
          low: low.toFloat(),
          volume: volume.toFloat(),
          value: value.toFloat({ multiply: 1e3 }),
          average: average.toFloat(),
        }
        const stock = { symbol: symbol.toUpperCase() }
        Object.assign(stock, s)

        r = $(tables)
          .eq(1)
          .find('tr')
        const par = r
          .eq(0)
          .children()
          .eq(1)
          .text()
          .trim()
        const ceiling = r
          .eq(1)
          .children()
          .eq(1)
          .text()
          .trim()
        const floor = r
          .eq(2)
          .children()
          .eq(1)
          .text()
          .trim()
        s = {
          par: par.toFloat(),
          ceiling: ceiling.toFloat(),
          floor: floor.toFloat(),
        }
        Object.assign(stock, s)

        r = $(tables)
          .eq(2)
          .find('tr')
        const b = r
          .eq(0)
          .children()
          .eq(1)
          .text()
          .trim()
        const o = r
          .eq(1)
          .children()
          .eq(1)
          .text()
          .trim()
        const bid = b.replace(/\s+/g, '').split('/')
        const offer = o.replace(/\s+/g, '').split('/')
        if (bid.length === 2 && offer.length === 2) {
          s = {
            bid: bid[0].toFloat(),
            bidVolume: bid[1].toFloat(),
            offer: offer[0].toFloat(),
            offerVolume: offer[1].toFloat(),
          }
          Object.assign(stock, s)
        }

        if (stock.marketStatus) {
          resolve(stock)
        } else {
          resolve({})
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { get }
