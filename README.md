# SET Scraper

The utility scraper for https://marketdata.set.or.th.

## Usage

```bash
npm install setscraper
```

```javascript
const scraper = require('setscraper')
```

### Get summary real-time prices of all indexes

```javascript
scraper.get().then(data => {
  expect(data.updatedAt).to.be.an.instanceof(Date)
  expect(data.indexes).length.to.be.above(3)
})
```

### Get real-time prices by index

```javascript
scraper.get('SET50').then(data => {
  expect(data.updatedAt).to.be.an.instanceof(Date)
  expect(data.stocks).have.length(50)
})
```

### Get real-time price of the stock

```javascript
scraper.get('advanc').then(data => {
  expect(data).to.have.property('updatedAt')
  expect(data.updatedAt).to.be.an.instanceof(Date)
  expect(data).to.have.property('symbol')
  expect(data.symbol).to.equal('ADVANC')
  expect(data.value).to.be.above(0)
})
```

```json
{ symbol: 'ADVANC',
  updatedAt: 2017-10-20T17:30:04.000Z,
  marketStatus: 'Closed',
  sign: '',
  last: 193,
  change: 0.5,
  percentChange: 0.26,
  prior: 192.5,
  open: 192.5,
  high: 195.5,
  low: 192.5,
  volume: 9520525,
  value: 1841384720,
  average: 193.42,
  par: 1,
  ceiling: 250,
  floor: 135,
  bid: 193,
  bidVolume: 102200,
  offer: 194,
  offerVolume: 2700 }
```

### Get all stocks in the market

```javascript
scraper.getStockList().then(data => {
  expect(data).length.to.be.above(600)
  expect(data[0]).to.have.property('symbol')
  expect(data[0]).to.have.property('market')
})
```

### Get historical prices of the stock

```javascript
scraper.getHistoricalPrices('advanc').then(data => {
  expect(data).to.have.property('symbol')
  expect(data).to.have.property('prices')
  expect(data.symbol).to.equal('ADVANC')
  expect(data.prices).length.to.be.above(100)
  expect(data.prices[0]).to.have.property('date')
  expect(data.prices[0].date).to.be.an.instanceof(Date)
  expect(data.prices[0]).to.have.property('open')
  expect(data.prices[0].open).to.be.above(0)
})
```
