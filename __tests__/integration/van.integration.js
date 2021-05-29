// snippets of this code are extracted from FoodBuddy-testing-w10 by INFO30005
// to run the test use npm test van.integration.js --detectOpenHandles

// include supertest to enable sending HTTP requests to app
const { sanitizeBody } = require('express-validator');
const request = require('supertest');

// require app
const app = require('../../app');

// set time out just in case it takes too long to process DB requests for 5 seconds
jest.setTimeout(10000)

// Test Suite for testing set van functionality
describe('integration test: set up van status as opened', () => {
    // need request.agent to create & use sessions
    let agent = request.agent(app)

    // store cookie returned by the app
    let cookie = null

    // use beforeAll function to create a request agent to login the vendor app
    // that is authenticated and can be used by all tests within this suite
    beforeAll(() => agent
        // send post request to login in the vendor app
        .post('/vendor/login') // go to vendor login page
        // need Content-Type setting because if it isn't there, request will be ignored by express
        .set('Content-Type', 'application/x-www-form-urlencoded')
        // send username and password
        .send({
            name: 'SisterCoffee',
            password: 'Sister123456',
        })
        // after we get back the cookie, store it in a variable
        .then((res) => {
            cookie = res
               .headers['set-cookie'][0]
               .split(',')
               .map(item => item.split(';')[0])
               .join(';')
        }));

        // testing for case 1 : POST method in van controller (locateVan) to set Van status as open and update location with valid input
        // the input are Latitude: -239, Longitude: 188, Location description: 37 Spencer Street
        test('Test 1 (Lat: -239, Long: 188, Loc desc: 37 Spencer Street, set Van to Open) (Valid)', async function(){
            var body = {location: JSON.stringify({'latitude': -239, 'longitude': 188}), location_description: '37 Spencer Street'}
            return agent
            // sends post request to route /vendor/update-van-details/open
            // with req.body accepted in the locateVan function as var body defined above
            .post('/vendor/update-van-details/open')
            // set cookie in header since we use cookie instead of token
            .set('Cookie', cookie)
            // send variable named body as the data sent using post request
            // to update the van location and set van status to open
            .send(body)
            .then((response) => {
                // expect server to say everything is OK
                // HTTP response code should be 200
                expect(response.statusCode).toBe(200);
                // expect that the rendered html page contain a text indicating the vendor is opened
                expect(response.text).toContain('Yes, we are open!');
            })
        })

        // testing for case 2: POST method in van controller (locateVan) to set van status as open and upate location 
        // with invalid input such as location and location description null 
        test('Test 2 (Lat: ???, Long: ???, Loc desc: ???, set Van to Open) (Invalid)', async function(){
            var body = {location: {}, location_description: ''}
            return agent
            // sends post request to route /vendor/update-van-details/open
            // with body = {location: {}, location_description: ''}
            .post('/vendor/update-van-details/open')
            // set cookie in header since we use cookie instead of token
            .set('Cookie', cookie)
            // send variable named body as the data sent using post request
            // to update the van location and set van status to open
            .send(body)
            .then((response) => {
                // HTTP response code should be 400
                // expect server to say that the request failed because the variable in body has no input
                expect(response.statusCode).toBe(400);
                // we expect the server to send message that database query is failed
                expect(response.text).toEqual('Database query failed');
            })
        })

        // testing for case 3: POST request in van controller (closeVan) to set van status to closed
        test('Test 3: set Van to Close (Valid)', async function (){
            return agent
            // send a post request to app on the route /vendor/update-van-details/close
            .post('/vendor/update-van-details/close')
            // set the cookie in the header
            .set('Cookie', cookie)
            .then((response) => {
                // expect server to say everything is OK / HTTP response code to be 200
                expect(response.statusCode).toBe(200);
                // expect that the rendered html page contain a text indicating the vendor is closed
                expect(response.text).toContain('Sorry, we are closed!');
            })
        })

        // may not have a case where the van would fail to update status to close because
        // we are retrieving van name from session and the van has to be in the database to be logged in
    })