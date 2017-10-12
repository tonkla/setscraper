const cheerio = require('cheerio')
const request = require('request')

function getStockList () {
  return new Promise((resolve, reject) => {
    try {
      const prefixes = ['NUMBER']
      for (let i = 65; i <= 90; i++) {
        prefixes.push(String.fromCharCode(i))
      }
      const promises = []
      prefixes.forEach(prefix => {
        const _promise = new Promise((resolve, reject) => {
          getByPrefix(prefix).then(_stocks => {
            resolve(_stocks)
          })
        })
        promises.push(_promise)
      })
      Promise.all(promises).then(_stocks => {
        const stocks = _stocks.reduce((a, b) => {
          return a.concat(b)
        })
        resolve(stocks)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getByPrefix (prefix) {
  return new Promise((resolve, reject) => {
    try {
      const url = `https://www.set.or.th/set/commonslookup.do?language=en&country=US&prefix=${prefix}`
      request(url, (err, response, body) => {
        if (err) throw err
        const stocks = []
        const $ = cheerio.load(body)
        const rows = $('#maincontent table tbody tr')
        rows.each((_, row) => {
          const cols = $(row).find('td')
          const symbol = cols.eq(0).text().trim()
          const market = cols.eq(2).text().trim()
          stocks.push({ symbol: symbol, market: market })
        })
        resolve(stocks)
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { getStockList }
