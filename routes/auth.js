/* auth.js */

/* All login / registration / authentication routes go here */

const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const User = require("../models/Users");
const router = express.Router();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

/* Login and logout */

router.get("/login", (req, res) => {
  res.render("login", { user: req.user, title: "Login", message: req.flash("error") });
});

router.post("/login", urlencodedParser, passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
