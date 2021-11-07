// admin.js

// Functions for the admin user

const User = require("../models/Users");

// check_admin__exists
// Run once on startup.
// Look to see if we have an admin user, and if not, create one.
async function check_admin_exists() {
  const admin_user = await User.findOne({ level: "admin" }).exec();
  if (!admin_user) {
    _create_admin_user();
  }
}

// _create_admin_user
// Called if no admin user found
// Creates an admin user with default credentials from .env
function _create_admin_user() {
  User.register(new User({
    username: process.env.DEFAULT_ADMIN_USER,
    email: process.env.DEFAULT_ADMIN_EMAIL,
    level: "admin" }),
  process.env.DEFAULT_ADMIN_PWD,
  (err, admin) => {
    if (err) {
      console.log(`Error: ${err.message} with new admin user:`);
      console.dir(admin);
    }
  });
}

module.exports = {
  check_admin_exists: check_admin_exists,
};
