/* index.js */

/* Handle / route */



const express = require("express");
const router = express.Router();

// FIXME: later this should either redirect to dashboard or login page,
//        depending on whether or not user is logged in.
router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

module.exports = router;
