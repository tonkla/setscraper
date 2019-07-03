# SET Scraper

The utility scraper for https://www.set.or.th.

**Warning:** It works only on `node < 12.0.0`, because of [switching to a new HTTP parser](https://nodejs.org/api/deprecations.html#deprecations_dep0131_legacy_http_parser)

For more details,

* https://github.com/nodejs/node/issues/27711
* https://nodejs.org/api/cli.html#cli_http_parser_library

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
  expect(data).to.have.property('index')
  expect(data.index).to.equal('SET50')
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

```text
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
scraper.getStocks().then(data => {
  expect(data).length.to.be.above(600)
  expect(data[0]).to.have.property('symbol')
  expect(data[0]).to.have.property('name')
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

### Get highlights of the stock

```javascript
scraper.getHighlights('advanc').then(data => {
  expect(data).to.have.property('symbol')
  expect(data).to.have.property('highlights')
  expect(data.symbol).to.equal('ADVANC')

  // schema = [ date, asset, liability, equity, revenue, profit, eps,
  //            roa, roe, npm, price, mktCap, pe, pbv, bvps, yield ]
  const hl = data.highlights[0]
  Object.keys(schema).forEach(key => {
    expect(hl).to.have.property(key)
  })
})
```

```text
{ symbol: 'ADVANC',
  highlights:
   [ { date: '2013-12-31',
       asset: 112025710000,
       liability: 66133120000,
       equity: 45748110000,
       revenue: 143653640000,
       profit: 36274130000,
       eps: 12.2,
       roa: 44.36,
       roe: 81.42,
       npm: 25.25,
       price: 199.5,
       mktCap: 593132520000,
       pe: 16.51,
       pbv: 16.06,
       bvps: 12.42,
       yield: 5.46 },
      ...
  ]
}
```
