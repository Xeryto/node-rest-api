let responseService = require('../src/services/responseService');
const chai = require('chai');
expect = chai.expect;
const {stub, restore} = require("sinon");
const {Model} = require("mongoose");
const rewire = require("rewire");
chai.use(require('chai-as-promised'));

describe('Test responseService', () => {
    afterEach(() => {
        responseService = rewire('../src/services/responseService');
        restore();
    });

    describe('Test loadCachedResponse with sampleCachedResponse', () => {
        let sampleCachedResponse;
        let findOneStub;

        beforeEach(() => {
            sampleCachedResponse = {
                'title': 'https://api.thedogapi.com/v1/images/xK7ZGh9GV?api_key=',
                'response': {"breeds": [], "id": "xK7ZGh9GV", "url": "https://cdn2.thedogapi.com/images/xK7ZGh9GV.jpg", "width": 1800, "height": 1200}
            };

            findOneStub = stub(Model, 'findOne').resolves(sampleCachedResponse);
        });

        it('When provided with a title, it should return the response corresponding to that title from database', async () => {
            const result = await responseService.loadCachedResponse('https://api.thedogapi.com/v1/images/xK7ZGh9GV?api_key=',process.env.DOG_API_KEY);
            const expected = {"breeds": [], "id": "xK7ZGh9GV", "url": "https://cdn2.thedogapi.com/images/xK7ZGh9GV.jpg", "width": 1800, "height": 1200};
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });

        it('When provided with a title, it should not depend on api key provided', async () => {
            const result = await responseService.loadCachedResponse('https://api.thedogapi.com/v1/images/xK7ZGh9GV?api_key=');
            const expected = {"breeds": [], "id": "xK7ZGh9GV", "url": "https://cdn2.thedogapi.com/images/xK7ZGh9GV.jpg", "width": 1800, "height": 1200};
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });
    });

    describe('Test loadCachedResponse with no saved response', async () => {
        let sampleCachedResponse;
        let findOneStub;
        let createStub;

        beforeEach(() => {
            sampleCachedResponse = null;

            findOneStub = stub(Model, 'findOne').resolves(sampleCachedResponse);
            createStub = stub(Model, 'create').resolves(sampleCachedResponse);
        });

        it('When provided with a title, it should return the response from calling the API', async () => {
            const result = await responseService.loadCachedResponse('https://api.thedogapi.com/v1/images/xK7ZGh9GV?api_key=',process.env.DOG_API_KEY);
            const expected = {"id": "xK7ZGh9GV", "url": "https://cdn2.thedogapi.com/images/xK7ZGh9GV.jpg", "width": 1800, "height": 1200};
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });

        it('When not provided with an API key, it should result in error or error message if the key is needed', async () => {
            const result = await responseService.loadCachedResponse('https://financialmodelingprep.com/api/v3/profile/TSLA?apikey=');
            const expected = {"Error Message" : "Invalid API KEY. Please retry or visit our documentation to create one FREE https://financialmodelingprep.com/developer/docs"};
            expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
        });

        it('When not provided with an API key, it should return the response if the API key is not needed', async () => {
            const result = JSON.stringify(await responseService.loadCachedResponse('https://restcountries.com/v3.1/name/United States of America?fields=name,nativeName,currencies,borders,flag,maps'));
            const expected = JSON.stringify(JSON.parse('[{"name": {"common": "United States", "official": "United States of America", "nativeName": {"eng": {"official": "United States of America", "common": "United States"}}}, "currencies": {"USD": {"name": "United States dollar", "symbol": "$"}}, "borders": ["CAN", "MEX"], "flag": "\uD83C\uDDFA\uD83C\uDDF8", "maps": {"googleMaps": "https://goo.gl/maps/e8M246zY4BSjkjAv6", "openStreetMaps": "https://www.openstreetmap.org/relation/148838#map=2/20.6/-85.8"}}]'));
            expect(result).to.equal(expected);
        });

        it('When the API call results in status not found, it should result in error',  async () => {
            await expect(responseService.loadCachedResponse('https://restcountries.com/v3.1/name/book?fields=name,nativeName,currencies,borders,flag,maps')).to.be.rejectedWith(Error);
        });
    });
});