/* global describe it */

const { expect } = require('chai')
const scraper = require('../src')

describe('GET highlights of the stock', function () {
  this.timeout(1000)
  it('should work', () => {
    const symbol = 'advanc'
    return scraper.getHighlights(symbol).then(data => {
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
      expect(data).to.have.property('highlights')
      expect(data.symbol).to.equal(symbol.toUpperCase())

      const hl = data.highlights[0]
      for (let key of Object.keys(schema)) {
        expect(hl).to.have.property(key)
      }
    })
  })
})

describe('GET highlights of an invalid stock', function () {
  this.timeout(1000)
  it('should work', () => {
    const symbol = 'advan'
    return scraper.getHighlights(symbol).then(data => {
      expect(data).to.have.property('symbol')
      expect(data).to.have.property('highlights')
      expect(data.highlights).to.be.empty
    })
  })
})
