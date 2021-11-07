/* index.js */

/* Handle / route */

const express = require("express");
const router = express.Router();

// Admin user gets admin page
// Regular user gets dashboard
// Any other user gets 403 (should never happen :) )
// Otherwise display login page
router.get("/", (req, res, next) => {
  if (req.user) {
    if(req.user.level == "admin") {
      res.redirect("/admin");
    } else if (req.user.level == "regular") {
      res.redirect("/dashboard");
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      next(err);
    }
  } else {
    res.render("index", { title: "Login" });
  }
});

module.exports = router;
