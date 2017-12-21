const { get } = require('./realtime')
const { getStockList } = require('./list')
const { getHistoricalPrices } = require('./history')
const { getStatements } = require('./statement')
module.exports = { get, getStockList, getHistoricalPrices, getStatements }
