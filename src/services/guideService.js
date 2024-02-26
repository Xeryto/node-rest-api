const {loadCachedResponse} = require('./responseService');

const getCountryInfo = async (country, currency) => {
    if (country !== undefined) {
        return await loadCachedResponse('https://restcountries.com/v3.1/name/'+country+'?fields=name,nativeName,currencies,borders,flag,maps');
    } else {
        currency = currency.toUpperCase();
        return await loadCachedResponse('https://restcountries.com/v3.1/currency/'+currency+'?fields=name,nativeName,currencies,borders,flag,maps');
    }
}

const getCurrencyInfo = async (currency, money, countryInfo) => {
    currency = currency.toUpperCase();
    const exchangeRates = (await loadCachedResponse('https://api.freecurrencyapi.com/v1/latest?apikey=',process.env.EXCHANGE_RATE_API_KEY))['data'];
    // the first element always contains the most accurate currency from search
    const targetCurrencyRate = exchangeRates[Object.keys(countryInfo[0]['currencies'])[0]];
    const ownCurrencyRate = exchangeRates[currency];
    if (targetCurrencyRate === undefined || ownCurrencyRate === undefined) {
        return false;
    } else {
        return money * targetCurrencyRate / ownCurrencyRate;
    }
}

module.exports = {getCountryInfo, getCurrencyInfo}