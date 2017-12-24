const { get } = require('./realtime')
const { getStockList } = require('./list')
const { getHistoricalPrices } = require('./history')
const { getHighlights } = require('./highlight')
module.exports = { get, getStockList, getHistoricalPrices, getHighlights }
