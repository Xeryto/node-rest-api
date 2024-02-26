const { checkPictureUpdate } = require('../services/pictureService');

// Get daily picture
const getTodayPicture = async (req, res, next) => {
    try {
        // use service to decide whether picture should be updated and provide it with
        // user object from authentication middleware
        const resp = await checkPictureUpdate(req.user);
        res.json(resp);
    } catch (error) {
        next(error);
    }
};

module.exports = { getTodayPicture };