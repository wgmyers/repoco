// site.js

// Handle loading data from the site config file
// and returning it as a JSON object so filetree can display it

const yaml = require("js-yaml");
const fs   = require("fs");

const DATADIR = "config/sites";

// parse_site
// Take the raw YAML returned by load_site
// Transform it into something usable by filetree
// ISSUES:
//  FIXED a) There is no easy way to have more than one site
//  FIXED b) We do *not* need to count keys, they are auto-generated if missing
//  FIXED c) Parse site should just handle parts of the tree for a site, allowing
//     the whole tree to be constructed from multiple site trees
//  d) We cannot handle actual directory structures
//  e) We do not need a top level 'pages' thing.
function parse_site(site, data) {
  let child_arr = [];
  const generator = data["generator"] ? data["generator"] : "unknown";

  // Iterate over top level keys under 'files'
  const keys = Object.keys(data["files"]);
  for (const k of keys) {
    let file_arr = [];
    const expand = k == "pages" ? true : false; // Expand only 'pages' section

    // Iterate over child nodes of a top level key
    for (const f of data["files"][k]) {
      const file_data = {
        title: f,
        loadable: true,
        loadpath: `${site}/${f}`,
        generator: generator
      };
      file_arr.push(file_data);
    }
    const folder = {
      title: k,
      folder: true,
      expanded: expand,
      children: file_arr
    };
    child_arr.push(folder);
  }

  return child_arr;
}

function load_site(site) {
  let data;
  try {
    const raw_data = yaml.load(fs.readFileSync(`${DATADIR}/${site}.yml`, "utf8"));
    const site_data = parse_site(site, raw_data);
    data = site_data;
  } catch (e) {
    console.error(e);
    data = ["error"];
  }
  return data;
}

// load_sites
// For now, just return data for all the YML found in config/sites
// Later:
// 1 - Load only files in config/sites for which the user has access
// 2 - If no user, return an error
function load_sites() {
  let data;
  const result = [];

  try {
    const configs = fs.readdirSync(DATADIR).filter(f => f.endsWith(".yml"));

    for (const f of configs) {
      const name = f.slice(0, -4);
      result.push({
        title: name,
        folder: true,
        expanded: true,
        children: load_site(name)
      });
    }

    data = {
      status: "ok",
      result: result
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
  load_sites: load_sites
};
