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

  describe("HTML Routes w/ no user", () => {

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

  describe("API routes w/ no user", () => {

    it("Filetree API call should fail with no user", done => {
      agent
        .get("/api/filetrees")
        .expect("Content-Type", /json/)
        .expect(res => {
          if (res.body.status != "error") {
            throw new Error("Filetree API call succeeded but no user logged in");
          }
        })
        .expect(200, done);
    });

    it("File load API call should fail with no user", done => {
      agent
        .get("/api/files/example.com/index.md")
        .expect("Content-Type", /json/)
        .expect(res => {
          if (res.body.status != "error") {
            throw new Error("File load succeeded but no user logged in");
          }
        })
        .expect(200, done);
    });

    it("File save API call should fail with no user", done => {
      agent
        .post("/api/files/example.com/index.md")
        .send({ "contents": "This should not work"})
        .expect("Content-Type", /json/)
        .expect(res => {
          if (res.body.status != "error") {
            throw new Error("File load succeeded but no user logged in");
          }
        })
        .expect(200, done);
    });

    it("File changes API call should fail with no user", done => {
      agent
        .get("/api/changes")
        .expect("Content-Type", /json/)
        .expect(res => {
          if (res.body.status != "error") {
            throw new Error("File changes API call succeeded but no user logged in");
          }
        })
        .expect(200, done);
    });

    it("Publish API call should fail with no user", done => {
      agent
        .get("/api/publish/example.com/test")
        .expect("Content-Type", /json/)
        .expect(res => {
          if (res.body.status != "error") {
            throw new Error("Publish API call succeeded but no user logged in");
          }
        })
        .expect(200, done);
    });

    it("Update API call should fail with no user", done => {
      agent
        .get("/api/update/example.com")
        .expect("Content-Type", /json/)
        .expect(res => {
          if (res.body.status != "error") {
            throw new Error("Update API call succeeded but no user logged in");
          }
        })
        .expect(200, done);
    });

    it("Revert API call should fail with no user", done => {
      agent
        .get("/api/revert/example.com")
        .expect("Content-Type", /json/)
        .expect(res => {
          if (res.body.status != "error") {
            throw new Error("Revert API call succeeded but no user logged in");
          }
        })
        .expect(200, done);
    });

  });

  const test_user_creds = {
    username: "TestUser",
    password: "testuser",
    email: "testuser@example.com"
  }

  const admin_creds = {
    username: secrets.secrets.DEFAULT_ADMIN_USER,
    password: secrets.secrets.DEFAULT_ADMIN_PWD
  }

  describe("Admin user routes", () => {

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

  describe("Regular user routes", () => {

    // We need to create a regular user before we can test them.
    // At this point, we don't have one, so we must log in as
    // admin, do so, and then log out again.
    before(async () => {
      console.log("Setting up test user");
      // Log in as admin
      agent
        .post("/login")
        .redirects(2)
        .type("form")
        .send(admin_creds)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw new Error("Could not log in as admin");
          }
        });
      // NB: POST /adduser below will fail unless we wait a bit here
      await sleep(500);

      // Create test user
      agent
        .post("/adduser")
        .redirects(2)
        .type("form")
        .send(test_user_creds)
        .expect(res => {
          if(!res.text.match(/User.*?created/)) {
            throw new Error("Did not create user");
          }
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw new Error("Could not create test user");
          }
        });

      // Wait for user to be added before we modify them
      await sleep(500);
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
        .end((err, res) => {
          if (err) {
            throw new Error("Could not modify test user permissions");
          }
        })

      // Log out
      agent
        .get("/logout")
        .redirects(2)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw new Error("Could not log out admin");
          }
        });

      // NB: wait again otherwise POST /login won't work in first user test
      await sleep(500);
      console.log("Test user ready");
    });

    it("regular user login works", done => {
      agent
        .post("/login")
        .redirects(2)
        .type("form")
        .send(test_user_creds)
        .expect("Content-Type", /html/)
        .expect(res => {
          if (!res.text.match(/Controls/)) {
            throw new Error("Did not redirect to dashboard page");
          }
        })
        .expect(200, done);
    });

    it("/dashboard route works logged in as regular user", done => {
      agent
        .get("/dashboard")
        .expect("Content-Type", /html/)
        .expect(res => {
          if (!res.text.match(/Controls/)) {
            throw new Error("Dashboard page did not load");
          }
        })
        .expect(200, done);
    });

    it("/edit route works logged in as regular user", done => {
      agent
        .get("/edit")
        .expect("Content-Type", /html/)
        .expect(res => {
          if (!res.text.match(/Editor/)) {
            throw new Error("Edit page did not load");
          }
        })
        .expect(200, done);
    });

    it("/help route works logged in as regular user", done => {
      agent
        .get("/help")
        .expect("Content-Type", /html/)
        .expect(res => {
          if (!res.text.match(/Help/)) {
            throw new Error("Help page did not load");
          }
        })
        .expect(200, done);
    });

    it("/api/filetrees works as regular user", done => {
      agent
        .get("/api/filetrees")
        .expect("Content-Type", /json/)
        .expect(res => {
          if (res.body.status != "ok") {
            throw new Error("/api/filetrees call failed");
          }
        })
        .expect(200, done);
    });

    it("regular user logout works", done => {
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
