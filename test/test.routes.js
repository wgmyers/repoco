// test.routes.js

// Test that our basic routes work

/* eslint-env mocha */

// Set up test environment
require("dotenv").config();

const expect = require('chai').expect;
const request = require("supertest");
const mongoose = require("mongoose");
const secrets = require("../lib/secrets");


// Tweak setup for tests
secrets.secrets.DB_USER = secrets.secrets.TEST_DB_USER;
secrets.secrets.DB_PASSWORD = secrets.secrets.TEST_DB_PASSWORD;
secrets.secrets.DB_NAME = secrets.secrets.TEST_DB_NAME;
secrets.secrets.DEFAULT_ADMIN_USER = "admin";
secrets.secrets.DEFAULT_ADMIN_EMAIL = "noreply@example.com";
secrets.secrets.DEFAULT_ADMIN_PWD = "poop";

const app = require("../app");

// See https://appdividend.com/2020/07/31/javascript-sleep-how-to-make-your-functions-sleep/
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

describe("Test routes", () => {
  let agent;

  before(async () => {
    agent = request.agent(app);
    // NB: it takes a second to create the default admin user
    // Without a fake sleep function, the admin login tests execute before
    // the user is created, and therefore fail. So we use a fake sleep
    // function to avoid this.
    await sleep(1000);
  });

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

  const test_user_creds = {
    username: "TestUser",
    password: "testuser",
    email: "testuser@example.com"
  }

  describe("Admin user routes", () => {

    const admin_creds = {
      username: secrets.secrets.DEFAULT_ADMIN_USER,
      password: secrets.secrets.DEFAULT_ADMIN_PWD
    }

    it("admin login works", done => {
      agent
        .post("/login")
        .redirects(2)
        .type("form")
        .send(admin_creds)
        .expect("Content-Type", /html/)
        .expect(res => {
          //console.dir(res);
          if (!res.text.match(/Admin/)) {
            throw new Error("Did not redirect to admin page");
          }
        })
        .expect(200, done);
    });

    it("admin route works logged in as admin", done => {
      agent
        .get("/admin")
        .expect("Content-Type", /html/)
        .expect(res => {
          if (!res.text.match(/Admin/)) {
            throw new Error("Admin page did not load");
          }
        })
        .expect(200, done);
    });

    it("admin can create a user", done => {
      agent
        .post("/adduser")
        .redirects(2)
        .type("form")
        .send(test_user_creds)
        .expect("Content-Type", /html/)
        .expect(res => {
          if(!res.text.match(/User.*?created/)) {
            throw new Error("Did not create user");
          }
        })
        .expect(200, done);
    });

    it("admin can modify a user", done => {
      agent
        .post(`/updateuser/${test_user_creds.username}`)
        .redirects(2)
        .type("form")
        .send({
          "site-example.com": "on",
          "active": "on",
          "email": test_user_creds.email
         })
        .expect("Content-Type", /html/)
        .expect(res => {
          if (!res.text.match(/User.*?updated/)) {
            throw new Error("Could not update user");
          }
        })
        .expect(200,done)
    })

    it("admin can delete a user", done => {
      agent
        .get(`/deluser/${test_user_creds.username}`)
        .redirects(2)
        .expect("Content-Type", /html/)
        .expect(res => {
          if (!res.text.match(/User.*?deleted/)) {
            throw new Error("Could not delete user");
          }
        })
        .expect(200, done);
    });

    it("admin logout works", done => {
      agent
        .get("/logout")
        .redirects(2)
        .expect("Content-Type", /html/)
        .expect(res => {
          if (!res.text.match(/Login/)) {
            throw new Error("Unexpected res.text in /logout");
          }
        })
        .expect(200, done);
    });

  });

});
