// unit test
// snippets of this code are extracted from FoodBuddy-testing-w10 by INFO30005

// connect to Mongoose model
const { body } = require('express-validator');
const mongoose = require('mongoose')

// we are going to test the locateVan from the food controller 
const vanController = require("../../controllers/vanController")

// we will need the Van model. Note that I have also changed the
// way I import the Food and User models in the vanController.js
// because the test would not run without me making that change.
const Van = require("../../models/van");



// defining a test suite for testing the locateVan
describe("Unit testing locateVan from vanController.js", () => {

    // mocking the request object. The controller function expects 
    // that at least the request object will have an 'id' params, and
    // isAuthenticated() function.
    // we create a mocking function using jest.fn(), and we can
    // return a mock value for the mock function as well.
    // see: https://jestjs.io/docs/mock-functions
    const req = {
        // searching for SisterCoffee in my database
        session: { name: 'SisterCoffee' },
        body: {location: {'latitude': -239, 'longitude': 188}, location_description: '37 Spencer Street'},
        // assuming that the user is logged in
        isAuthenticated: jest.fn().mockReturnValue('True')
    };

    // response object should have at least a render method
    // so that the controller can render the view
    const res = {
        render: jest.fn(),
        parse: jest.fn(),
        status: jest.fn(),
        send: jest.fn()
    };

    // the setup function does a few things before
    // any test is run
    beforeAll(() => {
        // clear the render method (also read about mockReset)
        res.render.mockClear();

        // I'm going to mock the findOneandUpdate Mongoose method
        // to return some of the details of the object
        // that I'm searching, i.e. SisterCoffee
        Van.findOneAndUpdate = jest.fn().mockResolvedValue({
            _id: '60815f63b544b956283d6ca5',
            name: 'SisterCoffee',
            location_description: '37 Spencer Street',
            location: {'latitude': -239, 'longitude': 188},
            ready_for_order: false,
            __v: 0
        });
        // We are using the lean() method, so need to 
        // mock that as well. I'm mocking the function
        // to return Plain Old JavaScript Object (POJO)
        Van.findOneAndUpdate.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue({
                _id: '60815f63b544b956283d6ca5',
                name: 'SisterCoffee',
                location_description: '37 Spencer Street',
                location: {'latitude': -239, 'longitude': 188},
                ready_for_order: false
            }),
        }));
        // And, we call the vanController with the mocked
        // request and response objects
        vanController.locateVan(req, res);
      });

    test("Test case 1: testing with existing van name \
        SisterCoffee, expecting updated details of Van", () => {
        // when I run the controller, I expect that the render method will
        // be called exactly once        
        expect(res.render).toHaveBeenCalledTimes(1);
        // and because I'm looking up a van that I expect to be in my
        // database, the controller should render the page and not
        // return an error message
        expect(res.render).toHaveBeenCalledWith('van-open', {"oneVan":
            {_id: '60815f63b544b956283d6ca5',
                name: 'SisterCoffee',
                location_description: '37 Spencer Street',
                location: {'latitude': 328, 'longitude': 283},
                ready_for_order: true}, "layout": "vendor-main.hbs", "vanloggedin" :"True"});
    });
  });