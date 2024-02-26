const User = require('../models/userModel');
const {loadCachedResponse} = require('./responseService');
const https = require("https");
const CachedResponse = require("../models/cachedResponseModel");

// Check if the picture of the day should be updated and return it
const checkPictureUpdate = async (user) => {
    try {
        let resp;
        const pictureLastUpdate = user['pictureLastUpdate'], pictureID = user['pictureID'], today = new Date(Date.now());
        if (pictureID === undefined || (today.getTime() - pictureLastUpdate.getTime()) >= 24*60*60*1000) {
            let url = 'https://api.thedogapi.com/v1/images/search?api_key='+process.env.DOG_API_KEY;
            return new Promise((resolve, reject) => {
                https.get(url, function(res){
                    let body = '';

                    res.on('data', function(chunk){
                        body += chunk;
                    });

                    res.on('end', async function () {
                        const fbResponse = JSON.parse(body)[0];
                        if (fbResponse.status && fbResponse.status !== 202) {
                            console.log("rejected");
                            reject(new Error("The API call did not result in success, status "+fbResponse.status));
                        }
                        const searchTitle = 'https://api.thedogapi.com/v1/images/'+fbResponse['id']+'?api_key='+process.env.DOG_API_KEY;
                        await CachedResponse.create({'title': searchTitle, 'response': fbResponse});
                        const id = fbResponse['id'];
                        await User.updateOne({'username': user['username']}, {'pictureID': id, 'pictureLastUpdate': new Date(Date.now())});
                        resolve(fbResponse);
                    });
                }).on('error', function(e){
                    reject(e);
                });
            });
        }
        else {
            resp = await loadCachedResponse('https://api.thedogapi.com/v1/images/'+pictureID+'?api_key=', process.env.DOG_API_KEY);
            return resp;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = { checkPictureUpdate }