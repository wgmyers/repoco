/* admin.js */

/* Handle HTML routes only available to logged in admins */

const express = require("express");
const router = express.Router();

const admin = require("../lib/admin");

router.get("/admin", async (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else if (req.user.level == "admin") {
    const users = await admin.get_users();
    res.render("admin", { title: "Admin", user: req.user, users: users, messages: req.flash() });
  } else {
    const err = new Error("Forbidden");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
