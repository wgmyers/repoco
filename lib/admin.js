// admin.js

// Functions for the admin user

const User = require("../models/Users");

// check_admin__exists
// Run once on startup.
// Look to see if we have an admin user, and if not, create one.
async function check_admin_exists() {

  console.log("check_admin_exists():")

  const admin_user = await User.findOne({ level: "admin" }).exec();
  if (!admin_user) {
    _create_admin_user();
  }

}

// _create_admin_user
// Called if no admin user found
// Creates an admin user with default credentials from .env
function _create_admin_user() {

  console.log("_create_admin_user!");

}

module.exports = {
  check_admin_exists: check_admin_exists,
};
