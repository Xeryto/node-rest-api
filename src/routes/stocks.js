const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getHottestStocks } = require('../thirdParty/hotStocks');

const router = express.Router();

router.get('/hottestStocksInfo', authenticate, getHottestStocks);

module.exports = router;