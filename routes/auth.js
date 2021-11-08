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

router.post("/login", urlencodedParser, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
  failureFlash: true
}));

router.post("/adduser", urlencodedParser, (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else if (req.user.level == "admin") {
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

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
