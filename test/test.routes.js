// test.routes.js

// Test that our basic routes work

/* eslint-env mocha */

// Set up test environment
require("dotenv").config();

const request = require("supertest");
const app = require("../app");

describe("Test routes", () => {

  const agent = request.agent(app);

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
