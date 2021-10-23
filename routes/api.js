/* api.js */

/* Handle API routes only available to logged in users */

// FIXME: auth not yet implemented

const express = require("express");
const router = express.Router();

const site = require("../lib/site");
const files = require("../lib/files");
const git = require("../lib/git");

// API routes
router.get("/api/filetrees", (req, res) => {
  res.json(site.load_filetrees());
});

router.get("/api/files/:site/:file", (req, res) => {
  res.json(files.load_file(req.params.site, req.params.file));
});

router.post("/api/files/:site/:file", (req, res) => {
  res.json(files.save_file(req.params.site, req.params.file, req.body));
})

router.get("/api/changes", async (req, res) => {
  const changes = await git.load_changes();
  res.json(changes);
});

module.exports = router;
