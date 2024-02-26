const https = require('https');
const CachedResponse = require("../models/cachedResponseModel");

const loadCachedResponse = async (searchTitle, apiKey=null) => {
    try {
        const cachedResponse = await CachedResponse.findOne({'title': searchTitle});
        if (cachedResponse !== null) {
            return cachedResponse['response'];
        }
        else {
            let url = searchTitle;
            if (apiKey !== null) {
                url += apiKey;
            }
            return new Promise((resolve, reject) => {
                https.get(url, function(res){
                    let body = '';

                    res.on('data', function(chunk){
                        body += chunk;
                    });

                    res.on('end', async function () {
                        const fbResponse = JSON.parse(body);
                        if (fbResponse.status && fbResponse.status !== 202) {
                            console.log("rejected");
                            reject(new Error("The API call did not result in success, status "+fbResponse.status));
                        }
                        else {
                            await CachedResponse.create({'title': searchTitle, 'response': fbResponse});
                            resolve(fbResponse);
                        }
                    });
                }).on('error', function(e){
                    reject(e);
                });
            });
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = { loadCachedResponse };