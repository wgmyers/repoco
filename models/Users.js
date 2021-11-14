// Users.js
// mongoose schema for the user object

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    email_is_verified: {
      type: Boolean,
      default: false
    },
    level: {
      type: String,
      enum: ["admin", "regular"],
      default: "regular"
    },
    sites: {
      type: Array
    },
    settings: {
      type: Array
    },
    active: {
      type: Boolean,
      default: true
    },
    joined_date: {
      type: Date,
      default: Date.now
    }
  },
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
