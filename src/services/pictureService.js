const User = require('../models/userModel');
const {loadCachedResponse} = require('./responseService');
const https = require("https");
const CachedResponse = require("../models/cachedResponseModel");

// Check if the picture of the day should be updated and return it
const checkPictureUpdate = async (user) => {
    let resp;
    const pictureLastUpdate = user['pictureLastUpdate'], pictureID = user['pictureID'], today = new Date(Date.now());
    if (pictureID === undefined || (today.getTime() - pictureLastUpdate.getTime()) >= 24*60*60*1000) {
        resp = await getNewRandomPicture();
        const id = resp['id'];
        await User.updateOne({'username': user['username']}, {'pictureID': id, 'pictureLastUpdate': new Date(Date.now())});
    }
    else {
        resp = await loadCachedResponse('https://api.thedogapi.com/v1/images/'+pictureID+'?api_key=', process.env.DOG_API_KEY);
    }
    return resp;
};

// Generate a new random picture and cache the response with right title
const getNewRandomPicture = async () => {
    let url = 'https://api.thedogapi.com/v1/images/search?api_key='+process.env.DOG_API_KEY;
    return new Promise((resolve, reject) => {
        https.get(url, function(res){
            let body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', async function () {
                const fbResponse = JSON.parse(body)[0];
                // if there's a status and it's not OK, the API call was unsuccessful
                if (fbResponse.status && fbResponse.status !== 200) {
                    console.log("rejected");
                    reject(new Error("The API call did not result in success, status "+fbResponse.status));
                }
                // generate a different title to save, since initial url returns a random picture and not the same response
                const searchTitle = 'https://api.thedogapi.com/v1/images/'+fbResponse['id']+'?api_key='+process.env.DOG_API_KEY;
                await CachedResponse.create({'title': searchTitle, 'response': fbResponse});
                resolve(fbResponse);
            });
        }).on('error', function(e){
            reject(e);
        });
    });
};

module.exports = { checkPictureUpdate };