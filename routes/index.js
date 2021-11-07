/* index.js */

/* Handle / route */



const express = require("express");
const router = express.Router();

// FIXME: later this should either redirect to dashboard or login page,
//        depending on whether or not user is logged in.
router.get("/", (req, res) => {
  if (req.user) {
    if(req.user.level == "admin") {
      res.redirect("/admin");
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.render("index", { title: "Login" });
  }
});

module.exports = router;
