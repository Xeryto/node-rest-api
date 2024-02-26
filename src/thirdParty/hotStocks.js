const {getStockInfo,getTopStocks} = require('../services/stocksService');

// Get top-3 most discussed stocks on Reddit with stock info
const getHottestStocks = async (req,res,next) => {
    try {
        let resp = [];
        const stocks = await getTopStocks();
        let stock, info, stockInfo;
        for (let i = 0; i < stocks.length; i++) {
            stock = stocks[i];
            // for each stock, search info up
            info = await getStockInfo(stock['ticker']);
            stockInfo = stock;
            // add a field with found information
            stockInfo.info = info;
            resp.push(stockInfo);
        }
        res.json(resp);
    }
    catch (error) {
        next(error);
    }
};

module.exports = {getHottestStocks};