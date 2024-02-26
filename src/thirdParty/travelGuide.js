const {getCurrencyInfo, getCountryInfo} = require('../services/guideService');

// Get info about country and translate money into local currency if provided
const getGuide = async (req, res, next) => {
    let targetCurrency = req.query.targetCurrency, country = req.query.country,
        ownCurrency = req.query.currency, money = req.query.money;

    // if neither country name nor currency was provided, can't search for a country
    if (targetCurrency === undefined && country === undefined) {
        res.status(404).json({message: "Country info not provided"});
    }
    else {
        try {
            const countryInfo = await getCountryInfo(country,targetCurrency);
            if (countryInfo !== undefined) {
                // if neither currency nor money were provided, just return country info
                if (ownCurrency === undefined && money === undefined) {
                    res.json(countryInfo);
                }
                // if both currency and money were provided, add a field with money translated into local currency
                else if (ownCurrency !== undefined && money !== undefined){
                    const translatedMoney = await getCurrencyInfo(ownCurrency, money, countryInfo);
                    if (translatedMoney !== false) {
                        countryInfo.push({'moneyInLocalCurrency': translatedMoney});
                        res.json(countryInfo);
                    }
                    else {
                        // if couldn't find either of currencies, return message saying so
                        res.status(404).json({message: "Could not find one of the currencies"});
                    }
                }
                else {
                    res.status(404).json({message: 'Insufficient info: Either only own currency or only money provided'});
                }
            }
            else {
                res.status(404).json({message: "Country not found"});
            }
        } catch (error) {
            next(error)
        }
    }
};

module.exports = {getGuide};