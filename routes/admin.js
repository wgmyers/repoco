/* admin.js */

/* Handle HTML routes only available to logged in admins */

const express = require("express");
const router = express.Router();

router.get("/admin", (req, res) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    res.render("admin", { title: "Admin"});
  }
});

module.exports = router;
