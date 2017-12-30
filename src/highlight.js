const cheerio = require('cheerio')
const request = require('request')
const moment = require('moment')
require('./utils')

function parseDate (str, isYearly) {
  try {
    let index = 7
    if (!isYearly) index--
    const date = moment(str.substring(index, str.length), 'DD/MM/YYYY').format('YYYY-MM-DD')
    return (date !== 'Invalid date') ? date : undefined
  } catch (err) {
    return undefined
  }
}

function getHighlights (symbol) {
  return new Promise((resolve, reject) => {
    try {
      const schema = {
        date: '',
        asset: 0,
        liability: 0,
        equity: 0,
        revenue: 0,
        profit: 0,
        eps: 0,
        roa: 0,
        roe: 0,
        npm: 0,
        price: 0,
        mktCap: 0,
        pe: 0,
        pbv: 0,
        bvps: 0,
        yield: 0
      }

      const url = `https://www.set.or.th/set/companyhighlight.do?symbol=${symbol.toUpperCase()}&language=en&country=US`
      request(url, (err, response, body) => {
        if (err) reject(err)

        const $ = cheerio.load(body)
        const headers = $('#maincontent table thead th')
        const highlights = []
        const colsNum = 5

        let date = 0
        let yearStr = ''
        for (let i = 1; i <= colsNum; i++) {
          yearStr = headers.eq(i).text()
          if (/^Y/.test(yearStr)) {
            // yearStr is "Y/E '16 31/12/2016"
            date = parseDate(yearStr, true)
          } else {
            // yearStr is "Q3 '17 30/09/2017"
            date = parseDate(yearStr, false)
          }
          if (date) {
            highlights.push(Object.assign({}, schema, { date: date }))
          } else {
            resolve([])
            return
          }
        }

        const rows = $('#maincontent table tbody tr')
        let value = 0

        // Assets
        let cols = rows.eq(1).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat({ multiply: 1e6 })
          highlights[i - 1] = Object.assign(highlights[i - 1], { asset: value })
        }

        // Liabilities
        cols = rows.eq(2).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat({ multiply: 1e6 })
          highlights[i - 1] = Object.assign(highlights[i - 1], { liability: value })
        }

        // Equity
        cols = rows.eq(3).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat({ multiply: 1e6 })
          highlights[i - 1] = Object.assign(highlights[i - 1], { equity: value })
        }

        // Revenue
        cols = rows.eq(5).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat({ multiply: 1e6 })
          highlights[i - 1] = Object.assign(highlights[i - 1], { revenue: value })
        }

        // Net Profit
        cols = rows.eq(6).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat({ multiply: 1e6 })
          highlights[i - 1] = Object.assign(highlights[i - 1], { profit: value })
        }

        // Earnings per Share (EPS)
        cols = rows.eq(7).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat()
          highlights[i - 1] = Object.assign(highlights[i - 1], { eps: value })
        }

        // Return on Assets (ROA)
        cols = rows.eq(9).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat()
          highlights[i - 1] = Object.assign(highlights[i - 1], { roa: value })
        }

        // Return on Equity (ROE)
        cols = rows.eq(10).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat()
          highlights[i - 1] = Object.assign(highlights[i - 1], { roe: value })
        }

        // Net Profit Margin (NPM)
        cols = rows.eq(11).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat()
          highlights[i - 1] = Object.assign(highlights[i - 1], { npm: value })
        }

        // Last Price of Record
        cols = rows.eq(12).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat()
          highlights[i - 1] = Object.assign(highlights[i - 1], { price: value })
        }

        // Market Capitalization
        cols = rows.eq(13).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat({ multiply: 1e6 })
          highlights[i - 1] = Object.assign(highlights[i - 1], { mktCap: value })
        }

        // Price to Earnings Ratio
        cols = rows.eq(15).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat()
          highlights[i - 1] = Object.assign(highlights[i - 1], { pe: value })
        }

        // Price to Book Value Ratio
        cols = rows.eq(16).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat()
          highlights[i - 1] = Object.assign(highlights[i - 1], { pbv: value })
        }

        // Book Value per Share
        cols = rows.eq(17).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat()
          highlights[i - 1] = Object.assign(highlights[i - 1], { bvps: value })
        }

        // Dividend Yield %
        cols = rows.eq(18).children('td')
        for (let i = 1; i <= colsNum; i++) {
          value = cols.eq(i).text().trim().toFloat()
          highlights[i - 1] = Object.assign(highlights[i - 1], { yield: value })
        }

        resolve({ symbol: symbol.toUpperCase(), highlights: highlights })
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { getHighlights }
