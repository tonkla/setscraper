const cheerio = require('cheerio')
const request = require('request')

function getByPrefix (prefix, lang = 'en') {
  return new Promise((resolve, reject) => {
    try {
      let url = `https://www.set.or.th/set/commonslookup.do?language=en&country=US&prefix=${prefix}`
      if (lang === 'th') {
        url = `https://www.set.or.th/set/commonslookup.do?language=th&country=TH&prefix=${prefix}`
      }
      request(url, (err, response, body) => {
        if (err) reject(err)

        const stocks = []
        const $ = cheerio.load(body)
        const rows = $('#maincontent table tbody tr')
        rows.each((_, row) => {
          const cols = $(row).find('td')
          const symbol = cols.eq(0).text().trim()
          const name = cols.eq(1).text().trim()
          const market = cols.eq(2).text().trim()
          if (lang === 'th') {
            stocks.push({ symbol: symbol, nameTH: name, market: market })
          } else {
            stocks.push({ symbol: symbol, name: name, market: market })
          }
        })
        resolve(stocks)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getStocks (opt = {}) {
  return new Promise((resolve, reject) => {
    try {
      const prefixes = ['NUMBER']
      for (let i = 65; i <= 90; i++) {
        prefixes.push(String.fromCharCode(i))
      }
      const promises = []
      for (let prefix of prefixes) {
        const _promise = new Promise((resolve, reject) => {
          getByPrefix(prefix).then(_stocks => {
            if (opt.lang && opt.lang === 'th') {
              getByPrefix(prefix, 'th').then(__stocks => {
                _stocks.map(_stock => {
                  const __stock = __stocks.find(__stock => {
                    return _stock.symbol === __stock.symbol
                  })
                  return Object.assign(_stock, __stock)
                })
                resolve(_stocks)
              })
            } else {
              resolve(_stocks)
            }
          })
        })
        promises.push(_promise)
      }

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

function getStocksByPrefix (prefix, opt = {}) {
  return new Promise((resolve, reject) => {
    try {
      getByPrefix(prefix).then(_stocks => {
        if (opt.lang && opt.lang === 'th') {
          getByPrefix(prefix, 'th').then(__stocks => {
            _stocks.map(_stock => {
              const __stock = __stocks.find(__stock => {
                return _stock.symbol === __stock.symbol
              })
              return Object.assign(_stock, __stock)
            })
            resolve(_stocks)
          })
        } else {
          resolve(_stocks)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { getStocks, getStocksByPrefix }
