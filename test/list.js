/* global describe it */

const { expect } = require('chai')
const scraper = require('../src')

describe('GET all stocks in the market', function () {
  this.timeout(10000)
  it('should work', () => {
    const prefixes = ['NUMBER']
    // Note: 27 prefixes (NUMBER + [A..Z]) take time so long, and will end with time-out.
    //       So we test only a NUMBER and A prefixes.
    for (let i = 65; i <= 65; i++) {
      prefixes.push(String.fromCharCode(i))
    }
    prefixes.forEach(prefix => {
      scraper.getStocksByPrefix(prefix).then(data => {
        expect(data[0]).to.have.property('symbol')
        expect(data[0]).to.have.property('name')
        expect(data[0]).to.have.property('market')
      })
    })
  })
})

describe('GET stocks by specific prefix and language', function () {
  this.timeout(1000)
  it('should work', () => {
    return scraper.getStocksByPrefix('Q', { lang: 'th' }).then(data => {
      expect(data).length.to.be.above(1)
      expect(data[0]).to.have.property('symbol')
      expect(data[0]).to.have.property('name')
      expect(data[0]).to.have.property('nameTH')
      expect(data[0]).to.have.property('market')
    })
  })
})
