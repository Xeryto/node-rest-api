const {getCurrencyInfo, getCountryInfo} = require('../services/guideService');

const getGuide = async (req, res, next) => {
    let targetCurrency = req.query.targetCurrency, country = req.query.country,
        ownCurrency = req.query.currency, money = req.query.money;

    if (targetCurrency === undefined && country === undefined) {
        res.status(404).json({message: "Country info not provided"});
    }
    else {
        try {
            if (targetCurrency !== undefined || country !== undefined) {
                const countryInfo = await getCountryInfo(country,targetCurrency);
                if (ownCurrency !== undefined || money !== undefined) {
                    if (ownCurrency !== undefined && money !== undefined) {
                        const translatedMoney = await getCurrencyInfo(ownCurrency, money, countryInfo);
                        if (translatedMoney !== false) {
                            countryInfo.push({'moneyInLocalCurrency': translatedMoney});
                            res.json(countryInfo);
                        }
                        else {
                            res.status(404).json({message: "Could not find currency of the target country"});
                        }
                    }
                    else {
                        res.status(404).json({message: 'Currency or money to be translated not provided'});
                    }
                }
                else {
                    res.json(countryInfo);
                }
            }
            else {
                res.status(404).json({message: "Country not found"});
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {getGuide}