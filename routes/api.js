/* api.js */

/* Handle API routes only available to logged in users */

const express = require("express");
const router = express.Router();

const site = require("../lib/site");
const files = require("../lib/files");
const git = require("../lib/git");
const auth = require("../lib/auth");

// API routes

router.get("/api/filetrees", (req, res) => {
  if (auth.is_regular(req.user)) {
    res.json(site.load_filetrees(req.user.sites));
  } else {
    res.json(auth.not_authorised());
  }
});

router.get("/api/files/:site/:path/:file", (req, res) => {
  if (auth.file_allowed(req.user, req.params.site, req.params.file)) {
    res.json(files.load_file(req.params.site, req.params.path, req.params.file));
  } else {
    res.json(auth.not_authorised());
  }
});

router.post("/api/files/:site/:path/:file", (req, res) => {
  if (auth.file_allowed(req.user, req.params.site, req.params.file)) {
    res.json(files.save_file(req.params.site, req.params.path, req.params.file, req.body));
  } else {
    res.json(auth.not_authorised());
  }
});

router.get("/api/changes", async (req, res) => {
  if (auth.is_regular(req.user)) {
    const changes = await git.get_changes(req.user.sites);
    res.json(changes);
  } else {
    res.json(auth.not_authorised());
  }
});

router.get("/api/publish/:site/:target", async (req, res) => {
  if (auth.site_allowed(req.user, req.params.site)) {
    const result = await git.do_publish(req.params.site, req.params.target, req.user.username, req.user.email);
    res.json(result);
  } else {
    res.json(auth.not_authorised());
  }
});

router.get("/api/update/:site", async (req, res) => {
  if (auth.site_allowed(req.user, req.params.site)) {
    const result = await git.do_update(req.params.site);
    res.json(result);
  } else {
    res.json(auth.not_authorised());
  }
});

router.get("/api/revert/:site", async (req, res) => {
  if (auth.site_allowed(req.user, req.params.site)) {
    const result = await git.do_revert(req.params.site);
    res.json(result);
  } else {
    res.json(auth.not_authorised());
  }
});

module.exports = router;
