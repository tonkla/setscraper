const { get } = require('./realtime')
const { getStocks, getStocksByPrefix } = require('./list')
const { getHistoricalPrices } = require('./history')
const { getHighlights } = require('./highlight')
module.exports = { get, getStocks, getStocksByPrefix, getHistoricalPrices, getHighlights }
