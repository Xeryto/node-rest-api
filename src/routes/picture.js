const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getTodayPicture } = require('../thirdParty/pictureOfDay');

const router = express.Router();

router.get('/pictureOfDay/', authenticate, getTodayPicture);

module.exports = router;