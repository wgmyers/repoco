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
const auth = require("../lib/auth");

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/admin", async (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else if (auth.is_admin(req.user)) {
    const users = await admin.get_users();
    res.render("admin", { title: "Admin", user: req.user, users: users, messages: req.flash() });
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
    // Update user here
    console.log("In update user with:");
    console.dir(req.body);
    res.redirect("/admin");
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
        req.flash("error", `Could not delete user ${req.params.user}`);
      } else {
        if (result) {
          req.flash("info", `User '${req.params.user} deleted.'`);
        } else {
          req.flash("error", `Did not delete user ${req.params.user}`);
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
