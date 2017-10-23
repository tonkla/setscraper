const { get } = require('./realtime')
const { getStockList } = require('./list')
const { getHistoricalPrices } = require('./history')
module.exports = { get, getStockList, getHistoricalPrices }
