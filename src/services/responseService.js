const { getResponse } = require('../controllers/cachedResponseController');
const CachedResponse = require("../models/cachedResponseModel");

const loadCachedResponse = async (searchTitle) => {
    try {
        const cachedResponse = CachedResponse.findOne({searchTitle});
        if (cachedResponse != null) {
            return JSON.parse(cachedResponse['response']);
        }
        else {
            fetch(searchTitle, { method: 'GET', headers: newHeaders })
                .then((results) => {
                    console.log(results);
                }).then(async results => {
                    results = results.json();
                    await CachedResponse.create({searchTitle, results});
                    return results;
            }).catch((err) => { console.error(err) });
        }
    } catch (error) {
        console.error(error);
    }
}