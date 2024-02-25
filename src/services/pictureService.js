const User = require('../models/userModel');
const {loadCachedResponse} = require('./responseService');

// Check if the picture of the day should be updated and return it
const checkPictureUpdate = async (user) => {
    try {
        let resp;
        const pictureLastUpdate = user['pictureLastUpdate'], pictureID = user['pictureID'], today = new Date(Date.now());
        if (pictureID === null || (today.getTime() - pictureLastUpdate.getTime()) >= 24*60*60*1000) {
            resp = await loadCachedResponse("https://api.thedogapi.com/v1/images/search?api_key=", process.env.DOG_API_KEY);
            resp = resp[0];
            const id = resp['id'];
            await User.updateOne({'username': user['username']}, {'pictureID': id, 'pictureLastUpdate': new Date(Date.now())});
        }
        else {
            resp = await loadCachedResponse('https://api.thedogapi.com/v1/images/'+pictureID+'?api_key=', process.env.DOG_API_KEY);
            resp = resp[0];
        }
        //console.log(resp);
        return resp;
    } catch (error) {
        return error;
    }
}

module.exports = { checkPictureUpdate }