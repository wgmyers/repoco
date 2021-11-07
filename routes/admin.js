/* admin.js */

/* Handle HTML routes only available to logged in admins */

const express = require("express");
const router = express.Router();

router.get("/admin", (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else if (req.user.level == "admin") {
    res.render("admin", { title: "Admin", user: req.user });
  } else {
    const err = new Error("Forbidden");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
