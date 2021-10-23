// test.routes.js

// Test that our basic routes work

/* eslint-env mocha */

// Set up test environment
require("dotenv").config();

const request = require("supertest");
const app = require("../app");

describe("Test routes", () => {

  const agent = request.agent(app);

  describe("Open page routes", () => {

    it("index route works", done => {
      agent
        .get("/")
        .expect("Content-Type", /html/)
        .expect(200, done);
    });

    it("dashaboard page works", done => {
      agent
        .get("/dashboard")
        .expect("Content-Type", /html/)
        .expect(200, done);
    });

    it("edit page works", done => {
      agent
        .get("/edit")
        .expect("Content-Type", /html/)
        .expect(200, done);
    });

    it("help page works", done => {
      agent
        .get("/help")
        .expect("Content-Type", /html/)
        .expect(200, done);
    });

  });

});
