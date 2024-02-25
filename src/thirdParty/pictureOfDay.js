const { checkPictureUpdate } = require('../services/pictureService');

const getTodayPicture = async (req, res, next) => {
    try {
        const resp = await checkPictureUpdate(req.user);
        res.json(resp);
    } catch (error) {
        next(error);
    }
}

module.exports = { getTodayPicture }