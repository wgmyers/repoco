/* index.js */

/* Handle / route */

const express = require("express");
const router = express.Router();
const auth = require("../lib/auth");

// Admin user gets admin page
// Regular user gets dashboard
// Any other user gets 403 (should never happen :) )
// Otherwise display login page
router.get("/", (req, res, next) => {
  if (req.user) {
    if(auth.is_admin(req.user)) {
      res.redirect("/admin");
    } else if (auth.is_regular(req.user)) {
      res.redirect("/dashboard");
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      next(err);
    }
  } else {
    res.render("index", { title: "Login", message: req.flash("error") });
  }
});

module.exports = router;
