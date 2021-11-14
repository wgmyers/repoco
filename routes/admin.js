/* admin.js */

/* Handle routes only available to logged in admins:
 * - admin page
 * - adduser
 * - updateuser
 * - deluser
 */

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../models/Users");

const admin = require("../lib/admin");
const sites = require("../lib/site");
const auth = require("../lib/auth");

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/admin", async (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else if (auth.is_admin(req.user)) {
    try {
      const sites_available = sites.get_sites();
      const users = await admin.get_users();
      res.render("admin", { title: "Admin", user: req.user, users: users, sites: sites_available, messages: req.flash() });
    } catch (err) {
      const error = new Error(err);
      error.status = 500;
      next(error);
    }
  } else {
    const err = new Error("Forbidden");
    err.status = 403;
    next(err);
  }
});

router.post("/adduser", urlencodedParser, (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else if (auth.is_admin(req.user)) {
    User.register(new User({
      username: req.body.username,
      email: req.body.email,
      level: "regular",
      sites: []
    }), req.body.password, (err, user) => {
      if (err) {
        console.log(`Error: ${err.message} with user:`);
        console.dir(user);
        req.flash("error", err.message);
      } else {
        req.flash("info", `User '${req.body.username}' created`);
      }
      res.redirect("/admin");
    });
  } else {
    const err = new Error("Forbidden");
    err.status = 403;
    next(err);
  }
});

router.post("/updateuser/:user", urlencodedParser, (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else if (auth.is_admin(req.user)) {

    console.dir(req.body);

    // The active checkbox seems to return active: "on" if it is checked
    // It returns nothing at all if unchecked.
    // QUERY: ORLY?
    const active = (req.body.active && req.body.active == "on") ? true : false;

    // Extract site list from form data
    const sites = [];
    Object.keys(req.body)
      .filter(k => k.match(/^site-/))
      .forEach(k => sites.push(k.slice(5,)));

    User.findOneAndUpdate({
      username: req.params.user,
      level: 'regular',
    },
    {
      email: req.body.email,
      active: active,
      sites: sites
    }, (err, result) => {
      if (err) {
        console.error(err);
        req.flash("error", `Could not update user '${req.params.user}'`);
      } else {
        if (result) {
          req.flash("info", `User '${req.params.user}' updated`);
        } else {
          req.flash("error", `Did not update user '${req.params.user}'`);
        }
      }
      res.redirect("/admin");
    });
  } else {
    const err = new Error("Forbidden");
    err.status = 403;
    next(err);
  }
});

router.get("/deluser/:user", (req, res, next) => {
  if(!req.user) {
    res.redirect("/");
  } else if (auth.is_admin(req.user)) {
    // Try to delete the user
    // Report back with flash message either way
    // NB: Specify a regular user here to make it so we cannot delete the admin user
    User.findOneAndDelete({ username: req.params.user, level: 'regular' }, (err, result) => {
      if (err) {
        console.error(err);
        req.flash("error", `Could not delete user '${req.params.user}'`);
      } else {
        if (result) {
          req.flash("info", `User '${req.params.user}' deleted.`);
        } else {
          // Finding none is not an error according to Mongoose - if we get
          // here we tried to delete the admin user and didn't.
          req.flash("error", `Did not delete user '${req.params.user}'`);
        }
      }
      res.redirect("/admin");
    });
  } else {
    const err = new Error("Forbidden");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
