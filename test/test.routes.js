// test.routes.js

// Test that our basic routes work

/* eslint-env mocha */

// Set up test environment
require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const secrets = require("../lib/secrets");


// Tweak setup for tests
secrets.secrets.DB_USER = secrets.secrets.TEST_DB_USER;
secrets.secrets.DB_PASSWORD = secrets.secrets.TEST_DB_PASSWORD;
secrets.secrets.DB_NAME = secrets.secrets.TEST_DB_NAME;
secrets.secrets.DEFAULT_ADMIN_USER = "test_admin";
secrets.secrets.DEFAULT_ADMIN_EMAIL = "noreply@example.com";
secrets.secrets.DEFAULT_ADMIN_PWD = "poop";


describe("Test routes", () => {
  let agent;

  before(() => {
    const app = require("../app");
    agent = request.agent(app);
  })

  after(async (done) => {
    //await mongoose.connection.db.dropDatabase();
    mongoose.connection.close(function () {
      console.log('Mongoose connection disconnected');
    });
    done();
  })

  describe("Routes w/ no user", () => {

    it("index route works", done => {
      agent
        .get("/")
        .expect("Content-Type", /html/)
        .expect(200, done);
    });

    it("dashboard page redirects to /", done => {
      agent
        .get("/dashboard")
        .expect("Content-Type", /text/)
        .expect("Location", "/", done);
    });

    it("edit page redirects to /", done => {
      agent
        .get("/edit")
        .expect("Content-Type", /text/)
        .expect("Location", "/", done);
    });

    it("help page redirects to /", done => {
      agent
        .get("/help")
        .expect("Content-Type", /text/)
        .expect("Location","/", done);
    });

    it("admin page redirects to /", done => {
      agent
        .get("/admin")
        .expect("Content-Type", /text/)
        .expect("Location","/", done);
    });

    it("unknown page gives 404", done => {
      agent
        .get("/poop")
        .expect("Content-Type", /html/)
        .expect(404, done);
    });

  });

});
