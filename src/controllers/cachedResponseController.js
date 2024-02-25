const CachedResponse = require('../models/cachedResponseModel');

const getResponse = async (req, res, next) => {
    const { title } = req.body;

    try {
        const cachedResponse = CachedResponse.findOne({title});
        res.json({cachedResponse});
    } catch (error) {
        next(error);
    }
};

const postResponse = async (req, res, next) => {
    const { title, response } = req.body;

    try {
        await CachedResponse.create({title, response});
    } catch (error) {
        next(error);
    }
};

module.exports = {getResponse, postResponse};

