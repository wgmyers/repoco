// git.js

// All the git interaction happens here

const fs   = require("fs");
const simpleGit = require("simple-git");

const SITES_DIR = process.env.SITES_DIR
const GIT_ROOT = process.env.GIT_ROOT

// get_unpushed_files
// Return a list of modified files
async function get_unpushed_files(name) {
  const git = simpleGit(`${GIT_ROOT}/${name}`);
  const status = await git.status();
  return status.modified;
}

// load_changes
async function load_changes() {
  let data;
  const result = [];

  try {
    const configs = fs.readdirSync(SITES_DIR).filter(f => f.endsWith(".yml"));

    for (const f of configs) {
      const name = f.slice(0, -4);
      const modified_files = await get_unpushed_files(name);
      result.push({
        name: name,
        files: modified_files
      });
    }

    data = {
      status: "ok",
      changes: result
    };
  } catch (e) {
    console.error(e);
    data = {
      status: "error",
      error: e.message
    };
  }
  return data;
}

async function publish(site,target) {
  console.log("FIXME: git.publish not implemented");
  return {
    status: "error",
    error: "Unimplemented"
  }
}

async function update(site) {
  console.log("FIXME: git.update not implemented");
  return {
    status: "error",
    error: "Unimplemented"
  }
}

async function revert(site) {
  console.log("FIXME: git.revert not implemented");
  return {
    status: "error",
    error: "Unimplemented"
  }
}

module.exports = {
  load_changes: load_changes,
  publish: publish,
  update: update,
  revert: revert
};
