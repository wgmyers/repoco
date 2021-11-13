/* user.js */

/* Handle HTML routes only available to logged in regular users */

const express = require("express");
const router = express.Router();
const auth = require("../lib/auth");

router.get("/dashboard", (req, res, next) => {
  if (req.user) {
    if (auth.is_regular(req.user)) {
      res.render("dashboard", { title: "Dashboard", user: req.user });
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      next(err);
    }
  } else {
    res.redirect("/");
  }
});

router.get("/edit", (req, res, next) => {
  if (req.user) {
    if (auth.is_regular(req.user)) {
      res.render("edit", { title: "Edit", user: req.user });
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      next(err);
    }
  } else {
    res.redirect("/");
  }

});

router.get("/help", (req, res, next) => {
  if (req.user) {
    if (auth.is_regular(req.user)) {
      res.render("help", { title: "Help", user: req.user });
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      next(err);
    }
  } else {
    res.redirect("/");
  }
});

module.exports = router;
