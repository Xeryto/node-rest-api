const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getGuide } = require('../thirdParty/travelGuide');

const router = express.Router();

router.get('/guide/', authenticate, getGuide);

module.exports = router;