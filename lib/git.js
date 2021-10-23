// git.js

// All the git interaction happens here

const yaml = require("js-yaml");
const fs   = require("fs");
const simpleGit = require("simple-git");

const DATADIR = "config/sites";
const GITROOT = "repos";

// get_unpushed_files
// All we want to know is how many files are marked as modified
async function get_unpushed_files(name) {
  const git = simpleGit(`${GITROOT}/${name}`);
  const status = await git.status();
  return status.modified.length;
}

// load_changes
async function load_changes() {
  let data;
  const result = [];

  try {
    const configs = fs.readdirSync(DATADIR).filter(f => f.endsWith(".yml"));

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

module.exports = {
  load_changes: load_changes
};
