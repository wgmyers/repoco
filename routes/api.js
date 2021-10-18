/* api.js */

/* Handle API routes only available to logged in users */

// FIXME: auth not yet implemented

const express = require("express");
const router = express.Router();

const site = require("../lib/site");
const files = require("../lib/files");

// API routes
router.get("/api/sites", (req, res) => {
  res.json(site.load_sites());
});

router.get("/api/files/:site/:file", (req, res) => {
  res.json(files.load_file(req.params.site, req.params.file));
});

router.post("/api/files/:site/:file", (req, res) => {
  res.json(files.save_file(req.params.site, req.params.file, req.body));
})

module.exports = router;
