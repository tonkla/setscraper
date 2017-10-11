/* global describe it */

const { expect } = require('chai')
const scraper = require('../src')

describe('GET all indexes', () => {
  it('should work', () => {
    return scraper.get().then(res => {
      expect(res.indexes).length.to.be.above(1)
      expect(res.updatedAt).to.be.an.instanceof(Date)
    })
  })
})

describe('GET SET50 index', () => {
  it('should get 50 stocks', () => {
    return scraper.get('set50').then(res => {
      expect(res.updatedAt).to.be.an.instanceof(Date)
      expect(res.stocks).have.length(50)
    })
  })
})

describe('GET by symbol', () => {
  it('should work', () => {
    return scraper.get('true').then(res => {
      expect(res.updatedAt).to.be.an.instanceof(Date)
      expect(res.symbol).to.equal('TRUE')
      expect(res.value).to.be.above(0)
    })
  })
})
