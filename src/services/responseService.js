const https = require('https');
const CachedResponse = require("../models/cachedResponseModel");

const loadCachedResponse = async (searchTitle, apiKey=null) => {
    try {
        const cachedResponse = await CachedResponse.findOne({searchTitle});
        if (cachedResponse != null) {
            return JSON.parse(cachedResponse['response']);
        }
        else {
            if (apiKey != null) {
                searchTitle+=apiKey;
            }
            return new Promise((resolve, reject) => {
                https.get(searchTitle, function(res){
                    let body = '';

                    res.on('data', function(chunk){
                        body += chunk;
                    });

                    res.on('end', async function () {
                        const fbResponse = JSON.parse(body);
                        await CachedResponse.create({'title': searchTitle, 'response': fbResponse});
                        resolve(fbResponse);
                    });
                }).on('error', function(e){
                    reject(e);
                });
            });
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { loadCachedResponse };