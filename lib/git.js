// git.js

// All the git interaction happens here

const fs   = require("fs");
const simpleGit = require("simple-git");

const SITES_DIR = process.env.SITES_DIR
const GIT_ROOT = process.env.GIT_ROOT

// get_unpushed_files
// Return a list of modified files
async function get_unpushed_files(site) {
  const git = simpleGit(`${GIT_ROOT}/${site}`);
  const status = await git.status();
  return status.modified;
}

// get_changes
async function get_changes() {
  let data;
  const result = [];

  try {
    const configs = fs.readdirSync(SITES_DIR).filter(f => f.endsWith(".yml"));

    for (const f of configs) {
      const site = f.slice(0, -4);
      const modified_files = await get_unpushed_files(site);
      result.push({
        name: site,
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

async function do_publish(site,target) {
  console.log("FIXME: git.publish not implemented");
  return {
    status: "error",
    error: "Publish unimplemented in API"
  }
}

// do_update
// IE we do a git pull origin master
// QUERY: do we want to specify origin master here or allow this to be set in repo?
// FIXME: what happens if git pull fails?
async function do_update(site) {
  let data;
  let msg;

  const git = simpleGit(`${GIT_ROOT}/${site}`);
  const response = await git.pull("origin", "master");

  console.log(`do_update for ${site}`);
  console.dir(response);
  
  // FIXME: Not sure how to test for success here
  if(response.summary) {
    if(response.summary.changes == 0) {
      msg = "There were no changes.";
    } else if (response.summary.changes == 1) {
      msg = `${response.summary.changes} file updated.`
    } else {
      msg = `${response.summary.changes} files updated.`
    }
    data = {
      status: "ok",
      message: `Update complete: ${msg}`
    }
  } else {
    data = {
      status: "error",
      message: "Update failed. Complain loudly."
    }
  }

  return data;
}

async function do_revert(site) {
  console.log("FIXME: git.revert not implemented");
  return {
    status: "error",
    error: "Revert unimplemented in API"
  }
}

module.exports = {
  get_changes: get_changes,
  do_publish: do_publish,
  do_update: do_update,
  do_revert: do_revert
};
