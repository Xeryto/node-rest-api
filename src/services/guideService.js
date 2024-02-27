const {loadCachedResponse} = require('./responseService');

// Get info from Countries API by country name or currency
const getCountryInfo = async (country, currency) => {
    // try country name first
    if (country !== undefined) {
        try {
            return await loadCachedResponse('https://restcountries.com/v3.1/name/'+country+'?fields=name,nativeName,currencies,borders,flag,maps');
        } catch (error) {
            // if API responded with any status other than 200, there would be an error
            if (currency !== undefined) {
                // if currency is provided, try to return with currency
                currency = currency.toUpperCase();
                return await loadCachedResponse('https://restcountries.com/v3.1/currency/'+currency+'?fields=name,nativeName,currencies,borders,flag,maps');
            } else {
                return error;
            }
        }
    } else {
        currency = currency.toUpperCase();
        return await loadCachedResponse('https://restcountries.com/v3.1/currency/'+currency+'?fields=name,nativeName,currencies,borders,flag,maps');
    }
};

// Calculate money translated into another target country's currency
const getCurrencyInfo = async (currency, money, countryInfo) => {
    currency = currency.toUpperCase();
    const exchangeRates = (await loadCachedResponse('https://api.freecurrencyapi.com/v1/latest?apikey=',process.env.EXCHANGE_RATE_API_KEY))['data'];
    // the first element always contains the most accurate currency from search
    const targetCurrencyRate = exchangeRates[Object.keys(countryInfo[0]['currencies'])[0]];
    const ownCurrencyRate = exchangeRates[currency];
    if (targetCurrencyRate === undefined || ownCurrencyRate === undefined) {
        // if couldn't find either of currencies in the list, return false
        return false;
    } else {
        return money * targetCurrencyRate / ownCurrencyRate;
    }
};

module.exports = {getCountryInfo, getCurrencyInfo};