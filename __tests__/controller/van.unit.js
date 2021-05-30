// unit test
// snippets of this code are extracted from FoodBuddy-testing-w10 by INFO30005
// to run the test use npm test van.unit.js --detectOpenHandles

// connect to Mongoose model
const mongoose = require("mongoose");

// we are going to test the locateVan from the food controller
const vanController = require("../../controllers/vanController");

// we will need the Van model. Note that I have also changed the
// way I import the Food and User models in the vanController.js
// because the test would not run without me making that change.
const Van = require("../../models/van");

// defining a test suite for testing the locateVan with valid input
describe("Unit testing locateVan from vanController.js for valid input", () => {
  // mocking the request object. This acts as a dummy / mock
  // object that are called and used in the locateVan function
  // we define isAuthenticated as 'True'
  // we create a mocking function for res using jest.fn(), and we can
  // return a mock value for the mock function as well
  const req = {
    // searching for SisterCoffee in my database
    session: { name: "SisterCoffee" },
    // don't forget to stringify the JSON file because the parameter in findOneAndUpdate has JSON.parse()
    body: {
      location: JSON.stringify({ latitude: -239, longitude: 188 }),
      location_description: "37 Spencer Street",
    },
    // assuming that the user is logged in
    isAuthenticated: jest.fn().mockReturnValue("True"),
  };

  // response object has a render, parse, status and send function
  // so that the controller can render, parse, status, send the view
  const res = {
    render: jest.fn(),
    status: jest.fn(),
    send: jest.fn(),
  };

  // the setup function does a few things before
  // any test is run
  beforeAll(() => {
    // clear the render method (also read about mockReset)
    res.render.mockClear();

    // I'm going to mock the findOneandUpdate Mongoose method
    // to return some of the details of the object
    // that I'm searching, i.e. SisterCoffee
    // here, mockResolvedValue returns the value inside the brackets ({_id: ..., name: ...})
    Van.findOneAndUpdate = jest.fn().mockResolvedValue({
      _id: "60815f63b544b956283d6ca5",
      name: "SisterCoffee",
      location_description: "37 Spencer Street",
      location: { latitude: -239, longitude: 188 },
      ready_for_order: true,
    });
    // We are using the lean() method, so need to
    // mock that as well. I'm mocking the function
    // to return Plain Old JavaScript Object (POJO)
    Van.findOneAndUpdate.mockImplementationOnce(() => ({
      lean: jest.fn().mockReturnValue({
        _id: "60815f63b544b956283d6ca5",
        name: "SisterCoffee",
        location_description: "37 Spencer Street",
        location: { latitude: -239, longitude: 188 },
        ready_for_order: true,
      }),
    }));
    // And, we call the vanController with the mocked
    // request and response objects
    vanController.locateVan(req, res);
  });

  test(
    "Test case 1: unit test locateVan (open Van) with existing van name" +
      "SisterCoffee, expecting updated details of Van and open Van",
    () => {
      // when I run the controller, I expect that the render method will
      // be called exactly once
      expect(res.render).toHaveBeenCalledTimes(1);
      // and because I'm looking up a van that I expect to be in my
      // database, the controller should render the page and not
      // return an error message
      expect(res.render).toHaveBeenCalledWith("van-open", {
        oneVan: {
          _id: "60815f63b544b956283d6ca5",
          name: "SisterCoffee",
          location_description: "37 Spencer Street",
          location: { latitude: -239, longitude: 188 },
          ready_for_order: true,
        },
        layout: "vendor-main.hbs",
        vanloggedin: "True",
      });
    }
  );
});

// defining a test suite for testing the locateVan with invalid input
describe("Unit testing locateVan from vanController.js for invalid input", () => {
  // mocking the request object. This acts as a dummy / mock
  // object that are called and used in the locateVan function
  // we define isAuthenticated as 'True'
  // we create a mocking function for res using jest.fn(), and we can
  // return a mock value for the mock function as well
  const req = {
    // searching for SisterCoffee in my database
    session: { name: "SisterCoffee" },
    // don't forget to stringify the JSON file because the parameter in findOneAndUpdate has JSON.parse()
    body: {
      location: JSON.stringify({ latitude: -239, longitude: 188 }),
      location_description: "37 Spencer Street",
    },
    // assuming that the user is logged in
    isAuthenticated: jest.fn().mockReturnValue("True"),
  };

  // response object has a send, status and send function
  // so that the controller can send, parse, status, send the view
  const res = {
    send: jest.fn(),
    status: jest.fn(),
  };

  // the setup function does a few things before
  // any test is run
  beforeAll(() => {
    // clear the render method (also read about mockReset)
    res.send.mockClear();

    // I'm going to mock the findOneandUpdate Mongoose method
    // to return some of the details of the object
    // that I'm searching, i.e. SisterCoffee
    // here, mockResolvedValue returns the value inside the brackets ({_id: ..., name: ...})
    Van.findOneAndUpdate = jest.fn().mockResolvedValue({
      _id: "60815f63b544b956283d6ca5",
      name: "SisterCoffee",
      location_description: "37 Spencer Street",
      location: JSON.stringify({ latitude: -239, longitude: 188 }),
      ready_for_order: true,
    });
    // We are using the lean() method, so need to
    // mock that as well. I'm mocking the function
    // to return Plain Old JavaScript Object (POJO)
    // here, .lean returns null value, so oneVan is not defined
    Van.findOneAndUpdate.mockImplementationOnce(() => ({
      lean: jest.fn().mockReturnValue(null),
    }));
    // And, we call the vanController with the mocked
    // request and response objects
    vanController.locateVan(req, res);
  });

  test("Test case 2: testing if van name equals to null, expecting res.send van not found", () => {
    // when I run the controller, I expect that the render method will
    // be called exactly once
    expect(res.send).toHaveBeenCalledTimes(1);
    // and because I'm looking up a van that I expect to be in my
    // database, the controller should render the page and not
    // return an error message
    expect(res.send).toHaveBeenCalledWith("Van not found");
  });
});

// defining a test suite for testing the closeVan with valid input
describe("Unit testing closeVan from vanController.js for valid input", () => {
  // mocking the request object. This acts as a dummy / mock
  // object that are called and used in the closeVan function
  // we define isAuthenticated as 'True'
  // we create a mocking function for res using jest.fn(), and we can
  // return a mock value for the mock function as well
  const req = {
    // searching for SisterCoffee in my database
    session: { name: "SisterCoffee" },
    // assuming that the user is logged in
    isAuthenticated: jest.fn().mockReturnValue("True"),
  };

  // response object has a send, render, status and send function
  // so that the controller can send, status, send the view
  const res = {
    render: jest.fn(),
    send: jest.fn(),
    status: jest.fn(),
  };

  // the setup function does a few things before
  // any test is run
  beforeAll(() => {
    // clear the render method (also read about mockReset)
    res.send.mockClear();

    // I'm going to mock the findOneandUpdate Mongoose method
    // to return some of the details of the object
    // that I'm searching, i.e. SisterCoffee
    // here, mockResolvedValue returns the value inside the brackets ({_id: ..., name: ...})
    Van.findOneAndUpdate = jest.fn().mockResolvedValue({
      _id: "60815f63b544b956283d6ca5",
      name: "SisterCoffee",
      ready_for_order: false,
    });
    // We are using the lean() method, so need to
    // mock that as well. I'm mocking the function
    // to return Plain Old JavaScript Object (POJO)
    // here, .lean returns the value passed
    Van.findOneAndUpdate.mockImplementationOnce(() => ({
      lean: jest.fn().mockReturnValue({
        _id: "60815f63b544b956283d6ca5",
        name: "SisterCoffee",
        ready_for_order: false,
      }),
    }));
    // And, we call the vanController with the mocked
    // request and response objects
    vanController.closeVan(req, res);
  });

  test(
    "Test case 3: testing with existing van name" +
      "SisterCoffee, expecting Van ready_for_order to be false",
    () => {
      // when I run the controller, I expect that the render method will
      // be called exactly once
      expect(res.render).toHaveBeenCalledTimes(1);
      // and because I'm looking up a van that I expect to be in my
      // database, the controller should render the page and not
      // return an error message
      expect(res.render).toHaveBeenCalledWith("van-close", {
        oneVan: {
          _id: "60815f63b544b956283d6ca5",
          name: "SisterCoffee",
          ready_for_order: false,
        },
        layout: "vendor-main.hbs",
        vanloggedin: "True",
      });
    }
  );
});

// defining a test suite for testing the closeVan with invalid input
describe("Unit testing closeVan from vanController.js for invalid input", () => {
  // mocking the request object. This acts as a dummy / mock
  // object that are called and used in the closeVan function
  // we define isAuthenticated as 'True'
  // we create a mocking function for res using jest.fn(), and we can
  // return a mock value for the mock function as well
  const req = {
    // searching for SisterCoffee in my database
    session: { name: "SisterCoffee" },
    // assuming that the user is logged in
    isAuthenticated: jest.fn().mockReturnValue("True"),
  };

  // response object has a send, status and send function
  // so that the controller can send, status, send the view
  const res = {
    send: jest.fn(),
    status: jest.fn(),
  };

  // the setup function does a few things before
  // any test is run
  beforeAll(() => {
    // clear the render method (also read about mockReset)
    res.send.mockClear();

    // I'm going to mock the findOneandUpdate Mongoose method
    // to return some of the details of the object
    // that I'm searching, i.e. SisterCoffee
    // here, mockResolvedValue returns the value inside the brackets ({_id: ..., name: ...})
    Van.findOneAndUpdate = jest.fn().mockResolvedValue({
      _id: "60815f63b544b956283d6ca5",
      name: "SisterCoffee",
      ready_for_order: false,
    });
    // We are using the lean() method, so need to
    // mock that as well. I'm mocking the function
    // to return Plain Old JavaScript Object (POJO)
    // here, .lean returns null value, so oneVan is not defined
    Van.findOneAndUpdate.mockImplementationOnce(() => ({
      lean: jest.fn().mockReturnValue(null),
    }));
    // And, we call the vanController with the mocked
    // request and response objects
    vanController.closeVan(req, res);
  });

  test(
    "Test case 4: testing with van name equals to null" +
      "expecting details to be closed",
    () => {
      // when I run the controller, I expect that the render method will
      // be called exactly once
      expect(res.send).toHaveBeenCalledTimes(1);
      // and because I'm looking up a van that I expect to be in my
      // database, the controller should render the page and not
      // return an error message
      expect(res.send).toHaveBeenCalledWith("Van not found");
    }
  );
});
