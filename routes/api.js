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
  const changes = await git.get_changes();
  res.json(changes);
});

router.get("/api/publish/:site/:target", async (req, res) => {
  const result = await git.do_publish(req.params.site, req.params.target);
  res.json(result);
});

router.get("/api/update/:site", async (req, res) => {
  const result = await git.do_update(req.params.site);
  res.json(result);
});

router.get("/api/revert/:site", async (req, res) => {
  const result = await git.do_revert(req.params.site);
  res.json(result);
});

module.exports = router;
