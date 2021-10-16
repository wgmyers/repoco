/* user.js */

/* Handle HTML routes only available to logged in users */

// FIXME: auth not yet implemented

const express = require("express");
const router = express.Router();

router.get("/edit", (req, res) => {
  res.render("edit", { title: "Edit" });
});

router.get("/help", (req, res) => {
  res.render("help", { title: "Help" });
});


module.exports = router;
