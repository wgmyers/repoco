// auth.js

// Convenience methods to authenticate the api

function is_admin(user) {
  if (user && user.level == 'admin') {
    return true;
  }
  return false;
}

function is_regular(user) {
  if (user && user.level == 'regular') {
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

function not_authorised() {
  return {
    status: "error",
    msg: "User not authorised"
  };
}

module.exports = {
  is_admin: is_admin,
  is_regular: is_regular,
  site_allowed: site_allowed,
  not_authorised: not_authorised
};
