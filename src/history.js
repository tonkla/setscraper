const cheerio = require('cheerio')
const request = require('request')
const moment = require('moment')
require('./utils')

function getHistoricalPrices (_symbol) {
  return new Promise((resolve, reject) => {
    try {
      const symbol = _symbol.toUpperCase()
      const promises = []
      for (let p = 0; p < 3; p++) {
        const page = `https://www.set.or.th/set/historicaltrading.do?symbol=${symbol}&page=${p}&language=en&country=US&type=trading`
        const promise = new Promise((resolve, reject) => {
          getByPage(page).then(_prices => {
            resolve(_prices)
          })
        })
        promises.push(promise)
      }
      Promise.all(promises).then(_prices => {
        const prices = _prices.reduce((a, b) => {
          return a.concat(b)
        })
        resolve({ symbol: symbol, prices: prices })
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getByPage (page) {
  return new Promise((resolve, reject) => {
    try {
      request(page, (err, response, body) => {
        if (err) throw err
        const prices = []
        const $ = cheerio.load(body)
        const rows = $('#maincontent table tbody tr')
        rows.each((_, row) => {
          const cols = $(row).find('td')
          const date = cols.eq(0).text().trim()
          const open = cols.eq(1).text().trim()
          const high = cols.eq(2).text().trim()
          const low = cols.eq(3).text().trim()
          const close = cols.eq(4).text().trim()
          const change = cols.eq(5).text().trim()
          const percentChange = cols.eq(6).text().trim()
          const volume = cols.eq(7).text().trim()
          const value = cols.eq(8).text().trim()
          prices.push({
            date: moment(`${date} 17:00:00 +0700`, 'DD/MM/YYYY HH:mm:ss ZZ').toDate(),
            open: open.toFloat(),
            high: high.toFloat(),
            low: low.toFloat(),
            close: close.toFloat(),
            change: change.toFloat(),
            percentChange: percentChange.toFloat(),
            volume: volume.toFloat(),
            value: value.toFloat({ multiply: 1e3 })
          })
        })
        resolve(prices)
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { getHistoricalPrices }
