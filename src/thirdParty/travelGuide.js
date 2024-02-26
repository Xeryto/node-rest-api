const {loadCachedResponse} = require('../services/responseService');

const getGuide = async (req, res, next) => {
    let targetCurrency = req.query.targetCurrency, country = req.query.country,
        ownCurrency = req.query.currency, money = req.query.money;

    if (targetCurrency === undefined && country === undefined) {
        res.status(404).json({message: "Country info not provided"});
    }
    else {
        try {
            let countryInfo;
            if (country !== undefined)
                countryInfo = await loadCachedResponse('https://restcountries.com/v3.1/name/'+country+'?fields=name,nativeName,currencies,borders,flag,maps');
            if (countryInfo === undefined && targetCurrency !== undefined) {
                targetCurrency = targetCurrency.toUpperCase();
                countryInfo = await loadCachedResponse('https://restcountries.com/v3.1/currency/'+targetCurrency+'?fields=name,nativeName,currencies,borders,flag,maps');
            }
            if (countryInfo === undefined) {
                res.status(404).json({message: "Country not found"});
            }
            else {
                if (ownCurrency !== undefined && money !== undefined) {
                    ownCurrency = ownCurrency.toUpperCase();
                    const exchangeRates = (await loadCachedResponse('https://api.freecurrencyapi.com/v1/latest?apikey=',process.env.EXCHANGE_RATE_API_KEY))['data'];
                    let targetCurrencyRate = exchangeRates[targetCurrency];
                    if (targetCurrencyRate === undefined) {
                        // the first element always contains the most accurate currency from search
                        targetCurrencyRate = exchangeRates[countryInfo[0]['currencies'][0]];
                    }
                    if (targetCurrencyRate === undefined) {
                        res.status(404).json({message: "Could not find currency of the target country"});
                    } else {
                        const ownCurrencyRate = exchangeRates[ownCurrency];
                        countryInfo.push({'moneyInLocalCurrency': money * targetCurrencyRate / ownCurrencyRate});
                    }
                }
                else if (ownCurrency !== undefined || money !== undefined) {
                    res.status(404).json({message: 'Currency or money to be translated not provided'});
                }
                res.json(countryInfo);
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {getGuide}