/* global describe it */

const { expect } = require('chai')
const scraper = require('../src')

describe('GET all indexes', function () {
  this.timeout(3000)
  it('should work', () => {
    return scraper.get().then(data => {
      expect(data.indexes).length.to.be.above(1)
      expect(data.updatedAt).to.be.an.instanceof(Date)
    })
  })
})

describe('GET SET50 index', () => {
  it('should get 50 stocks', () => {
    return scraper.get('set50').then(data => {
      expect(data.updatedAt).to.be.an.instanceof(Date)
      expect(data.stocks).have.length(50)
    })
  })
})

describe('GET by symbol', () => {
  it('should work', () => {
    return scraper.get('true').then(data => {
      expect(data.updatedAt).to.be.an.instanceof(Date)
      expect(data.symbol).to.equal('TRUE')
      expect(data.value).to.be.above(0)
    })
  })
})
