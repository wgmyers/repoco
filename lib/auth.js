// auth.js

// Convenience methods to authenticate the api

const yaml = require("js-yaml");
const fs   = require("fs");

const SITES_DIR = process.env.SITES_DIR;

function is_admin(user) {
  if (user && user.level == "admin") {
    return true;
  }
  return false;
}

function is_regular(user) {
  if (user && user.level == "regular") {
    return true;
  }
  return false;
}

function site_allowed(user, site) {
  if (user && user.sites.includes(site)) {
    return true;
  }
  return false;
}

function file_allowed(user, site, file) {
  // First check we're allowed to look at this site
  // Return false straightaway if not
  if (!site_allowed(user, site)) {
    return false;
  }
  // Ok, so let's check the file is ok
  try {
    const data = yaml.load(fs.readFileSync(`${SITES_DIR}/${site}.yml`, "utf8"));
    // check file against contents of files here
    // NB: This will need fixing when we change the file declaration format
    // in the YAML files. But for now, everything is in an array one key deep.
    for (const key of Object.keys(data.files)) {
      if (data.files[key].includes(file)) {
        return true;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return false;
}

function not_authorised() {
  return {
    status: "error",
    message: "User not authorised"
  };
}

module.exports = {
  is_admin: is_admin,
  is_regular: is_regular,
  site_allowed: site_allowed,
  file_allowed: file_allowed,
  not_authorised: not_authorised
};
