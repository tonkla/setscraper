/* global describe it */

const { expect } = require('chai')
const scraper = require('../src')

describe('GET stock list', function () {
  this.timeout(10000)
  it('should work', () => {
    return scraper.getStockList().then(data => {
      expect(data).length.to.be.above(600)
      expect(data[0]).to.have.property('symbol')
      expect(data[0]).to.have.property('market')
    })
  })
})
