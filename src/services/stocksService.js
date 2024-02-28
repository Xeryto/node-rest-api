const {loadCachedResponse} = require('./responseService');

// Return top 3 most discussed stocks on reddit
const getTopStocks = async () => {
    return (await loadCachedResponse('https://tradestie.com/api/v1/apps/reddit')).slice(0, 3);
};

// Get company and stock info by the symbol provided
const getStockInfo = async (symbol) => {
    return (await loadCachedResponse('https://financialmodelingprep.com/api/v3/profile/' + symbol + '?apikey=',process.env.STOCK_API_KEY))[0];
};

module.exports = {getTopStocks, getStockInfo};