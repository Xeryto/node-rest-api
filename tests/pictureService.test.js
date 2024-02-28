let pictureService = require('../src/services/pictureService');
const chai = require('chai');
expect = chai.expect;
const {stub, restore} = require("sinon");
const {Model} = require("mongoose");
const rewire = require("rewire");
chai.use(require('chai-as-promised'));

describe('Test pictureService', () => {
    afterEach(() => {
        pictureService = rewire('../src/services/pictureService');
        restore();
    });

    describe('Test checkPictureUpdate', async () => {
        let sampleCachedResponse;
        let findOneStub
        let updateOneStub;
        let createStub;
        let user;
        let randomPictureResponse;

        beforeEach(() => {
            sampleCachedResponse = {
                'title': 'https://api.thedogapi.com/v1/images/xK7ZGh9GV?api_key=',
                'response': {"breeds": [], "id": "xK7ZGh9GV", "url": "https://cdn2.thedogapi.com/images/xK7ZGh9GV.jpg", "width": 1800, "height": 1200}
            };

            user = {
                'username': 'a',
                'pictureID': 'xK7ZGh9GV',
                'pictureLastUpdate': new Date(Date.now())
            };

            randomPictureResponse = {
                'title': 'https://api.thedogapi.com/v1/images/rkiByec47?api_key=',
                'response': {"breeds": [{"weight": {"imperial": "44 - 66", "metric": "20 - 30"}, "height": {"imperial": "30", "metric": "76"}, "id": 3, "name": "African Hunting Dog", "bred_for": "A wild pack animal", "life_span": "11 years", "temperament": "Wild, Hardworking, Dutiful", "origin": "", "reference_image_id": "rkiByec47"}], "id": "rkiByec47", "url": "https://cdn2.thedogapi.com/images/rkiByec47_1280.jpg", "width": 500, "height": 335}
            }

            findOneStub = stub(Model, 'findOne').resolves(sampleCachedResponse);
            updateOneStub = stub(Model, 'updateOne').resolves(user);
            createStub = stub(Model, 'create').resolves();
        });

        it('When the user has a pictureID and it was updated less than a day ago, it should return a response with that pictureID', async () => {
            const result = JSON.stringify(await pictureService.checkPictureUpdate(user));
            const expected = JSON.stringify(JSON.parse('{"breeds": [], "id": "xK7ZGh9GV", "url": "https://cdn2.thedogapi.com/images/xK7ZGh9GV.jpg", "width": 1800, "height": 1200}'));
            expect(result).to.equal(expected);
        });

        it('When the user has a pictureID but it was updated more than or exactly 24 hours ago, it should return a response with a new picture by calling getNewRandomPicture', async () => {
            user.pictureLastUpdate = new Date(Date.now()-24*60*60*1000);
            const result = JSON.stringify(await pictureService.checkPictureUpdate(user));
            const expected = JSON.stringify(JSON.parse('{"breeds": [], "id": "xK7ZGh9GV", "url": "https://cdn2.thedogapi.com/images/xK7ZGh9GV.jpg", "width": 1800, "height": 1200}'));
            // should return a different result than what's saved in database
            expect(result).to.not.equal(expected);
        });

        it('When the user does not have a pictureID (undefined), it should return a response with a new picture by calling getNewRandomPicture', async () => {
            user.pictureID = undefined;
            const result = JSON.stringify(await pictureService.checkPictureUpdate(user));
            const expected = JSON.stringify(JSON.parse('{"breeds": [], "id": "xK7ZGh9GV", "url": "https://cdn2.thedogapi.com/images/xK7ZGh9GV.jpg", "width": 1800, "height": 1200}'));
            // should return a different result than what's saved in database
            expect(result).to.not.equal(expected);
        });
    });
});
