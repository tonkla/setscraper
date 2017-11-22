/* global describe it */

const { expect } = require('chai')
const scraper = require('../src')

describe('GET summary real-time prices of all indexes', function () {
  this.timeout(3000)
  it('should work', () => {
    return scraper.get().then(data => {
      expect(data.indexes).length.to.be.above(3)
      expect(data.updatedAt).to.be.an.instanceof(Date)
    })
  })
})

describe('GET real-time prices of all stocks in the SET50 index', () => {
  it('should get 50 stocks', () => {
    return scraper.get('set50').then(data => {
      expect(data.updatedAt).to.be.an.instanceof(Date)
      expect(data.stocks).have.length(50)
    })
  })
})

describe('GET real-time price of the stock', () => {
  it('should work', () => {
    return scraper.get('advanc').then(data => {
      expect(data).to.have.property('updatedAt')
      expect(data.updatedAt).to.be.an.instanceof(Date)
      expect(data).to.have.property('symbol')
      expect(data.symbol).to.equal('ADVANC')
      expect(data.value).to.be.above(0)
    })
  })
})

describe('GET invalid stock', () => {
  it('should return empty object', () => {
    return scraper.get('mai').then(data => {
      expect(data).to.be.empty
    })
  })
})
