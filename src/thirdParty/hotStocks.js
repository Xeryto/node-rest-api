const {getStockInfo,getTopStocks} = require('../services/stocksService');

const getHottestStocks = async (req,res,next) => {
    try {
        let resp = [];
        const stocks = await getTopStocks();
        let stock, info, stockInfo;
        for (let i = 0; i < stocks.length; i++) {
            stock = stocks[i];
            info = await getStockInfo(stock['ticker']);
            stockInfo = stock;
            stockInfo.info = info;
            resp.push(stockInfo);
        }
        res.json(resp);
    }
    catch (error) {
        next(error);
    }
}

module.exports = {getHottestStocks}