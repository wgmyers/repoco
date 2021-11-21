// admin.js

// Functions for the admin user

const secrets = require("../lib/secrets");
const User = require("../models/Users");

// get_users
// Query the database for all users
// Return an array of hashes in the following format:
// { username: name, email: email, level: admin|regular, sites: [array of sites] }
async function get_users() {
  const retval = [];
  for await (const user of User.find()) {
    retval.push({
      username: user.username,
      email: user.email,
      level: user.level,
      active: user.active ? "Yes" : "No",
      sites: user.sites
    });
  }
  return retval;
}

// check_admin__exists
// Run once on startup.
// Look to see if we have an admin user, and if not, create one.
async function check_admin_exists() {
  const admin_user = await User.findOne({ level: "admin" }).exec();
  if (!admin_user) {
    console.log("No admin user found! Creating one.");
    try {
      _create_admin_user()
    } catch (err) {
      console.dir(err);
      throw err;
    }
  }
}

// _create_admin_user
// Called if no admin user found
// Creates an admin user with default credentials from .env
function _create_admin_user() {
  User.register(
    new User({
      username: secrets.secrets.DEFAULT_ADMIN_USER,
      email: secrets.secrets.DEFAULT_ADMIN_EMAIL,
      level: "admin"
    }),
    secrets.secrets.DEFAULT_ADMIN_PWD,
    function (err, admin) {
      if (err) {
        console.log("Could not create admin user");
        throw (err);
      }
    }
  );
}

module.exports = {
  check_admin_exists: check_admin_exists,
  get_users: get_users
};
