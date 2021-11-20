// test.user.js

// Tests for user creation, login etc

/* eslint-env mocha */

require("dotenv").config();

const should = require("should");
const mongoose = require("mongoose");
const secrets = require("../lib/secrets");
const User = require("../models/Users.js");
let db;

describe("Test User schema", () => {

  before((done) => {
    db = mongoose.connect(`mongodb://${secrets.secrets.TEST_DB_USER}:${secrets.secrets.TEST_DB_PASSWORD}@localhost/${secrets.secrets.TEST_DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false
    }, function(err) {
      if (err) {
        console.error("Could not connect to mongodb on localhost - please check mongodb is running and test db user exists.");
      }
    });
    done();
  });

  after((done) => {
    User.deleteMany({}, () => {});
    mongoose.connection.close();
    done();
  });

  describe("New user", () => {
    it("add a user", (done) => {
      const user = new User({
        username: "poop",
        password: "poop",
        email: "poop@poop.com"
      });
      user.save((error) => {
        if (error) {
          done(error);
        }
        done();
      });
    });
    it("refuse to add new user with existing email", (done) => {
      const user = new User({
        username: "poop",
        password: "parp",
        email: "poop@poop.com"
      });
      user.save((error) => {
        if (error) {
          // console.error("error" + error.message);
          done();
        } else {
          done(new Error("duplicated user"));
        }
      });
    });
  });

  describe("User operations", () => {
    beforeEach((done) => {
      const user = new User({
        username: "12345",
        password: "testy",
        email: "poopy@poop.com"
      });
      user.save((error) => {
        if (error) {
          console.log("error" + error.message);
          done(error);
        } else {
          // else console.log("no error");
          done();
        }
      });
    });

    afterEach((done) => {
      User.deleteMany({}, () => {
        done();
      });
    });

    it("find a user by username", (done) => {
      User.findOne({ username: "12345" }, function(err, user) {
        user.username.should.eql("12345");
        // console.log("   username: ", user.username);
        done();
      });
    });
  });

});
