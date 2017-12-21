/* global describe it */

const { expect } = require('chai')
const scraper = require('../src')

describe('GET highlight statements of the stock', function () {
  this.timeout(2000)
  it('should work', () => {
    const symbol = 'advanc'
    return scraper.getStatements(symbol).then(data => {
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

      expect(data).to.have.property('symbol')
      expect(data).to.have.property('statements')
      expect(data.symbol).to.equal(symbol.toUpperCase())

      const stmt = data.statements[0]
      Object.keys(schema).forEach(key => {
        expect(stmt).to.have.property(key)
      })
    })
  })
})
