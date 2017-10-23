/* global describe it */

const { expect } = require('chai')
const scraper = require('../src')

describe('GET historical prices of the stock', function () {
  this.timeout(2000)
  it('should work', () => {
    return scraper.getHistoricalPrices('advanc').then(data => {
      expect(data).to.have.property('symbol')
      expect(data).to.have.property('prices')
      expect(data.symbol).to.equal('ADVANC')
      expect(data.prices).length.to.be.above(100)
      expect(data.prices[0]).to.have.property('date')
      expect(data.prices[0].date).to.be.an.instanceof(Date)
      expect(data.prices[0]).to.have.property('open')
      expect(data.prices[0].open).to.be.above(0)
    })
  })
})
