# SET Scraper

The utility scraper for https://marketdata.set.or.th.

## Usage

```bash
npm install setscraper
```

```javascript
const scraper = require('setscraper')

scraper.get().then(res => {
  // expect(res.updatedAt).to.be.an.instanceof(Date)
  // expect(res.indexes).length.to.be.above(1)
})

scraper.get('SET50').then(res => {
  // expect(res.updatedAt).to.be.an.instanceof(Date)
  // expect(res.stocks).have.length(50)
})

scraper.get('true').then(res => {
  // expect(res.updatedAt).to.be.an.instanceof(Date)
  // expect(res.symbol).to.equal('TRUE')
  // expect(res.value).to.be.above(0)
})
```
