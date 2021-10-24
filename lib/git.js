// git.js

// All the git interaction happens here

const fs   = require("fs");
const simpleGit = require("simple-git");

const SITES_DIR = process.env.SITES_DIR
const GIT_ROOT = process.env.GIT_ROOT

// get_unpushed_files
// Return a list of modified files
// FIXME: check for errors ffs
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

// do_publish
// We need to run git commit and git push
// HOWEVER, simple-git doesn't like it if files aren't specified and I can't
// figure out how to run a git commit -a, so we call get_unpushed files first.
// FIXME: We should set --author using the logged in user details
async function do_publish(site, target) {
  let data;
  let msg;

  const git = simpleGit(`${GIT_ROOT}/${site}`);

  try {
    const changes = await get_unpushed_files(site);
    const commit = await git.commit("Updated via Repoco", changes, { '--author': '"Repoco <repoco@yutani.org>"' });
    const response = await git.push("origin", "master", { "--push-option": target });

    console.dir(commit);
    console.dir(response);

    // FIXME: Not sure how best to test for success here
    if(response.update) {
      const msg = `updated from ${response.update.hash.from} to ${response.update.hash.to}`;
      data = {
        status: "ok",
        message: `Publish complete: ${msg}`
      }
    } else if (commit.summary.changes == 0) {
      data = {
        status: "ok",
        message: "No updates to publish!"
      }
    } else {
      data = {
        status: "error",
        error: "Publish failed. Complain loudly."
      }
    }
  } catch (e) {
    data = {
      status: "error",
      error: "Publish failed. Complain bitterly."
    }
  }

  return data;
}

// do_update
// IE we do a git pull origin master
// QUERY: do we want to specify origin master here or allow this to be set in repo?
async function do_update(site) {
  let data;
  let msg;

  const git = simpleGit(`${GIT_ROOT}/${site}`);
  try {
    const response = await git.pull("origin", "master");

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
  } catch (e) {
    data = {
      status: "error",
      message: "Update failed. Complain bitterly."
    }
  }

  return data;
}

// do_revert
// Aka git reset --hard
async function do_revert(site) {
  let data;
  let msg;

  const git = simpleGit(`${GIT_ROOT}/${site}`);
  try {
    const response = await git.reset("hard");

    // FIXME: Not sure how to test for success here
    data = {
      status: "ok",
      message: response
    }

  } catch (e) {
    data = {
      status: "error",
      message: "Reset failed. Complain bitterly."
    }
  }

  return data;
}

module.exports = {
  get_changes: get_changes,
  do_publish: do_publish,
  do_update: do_update,
  do_revert: do_revert
};
