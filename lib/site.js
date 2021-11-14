// site.js

// Handle loading data from the site config file
// and returning it as a JSON object so filetree can display it

const yaml = require("js-yaml");
const fs   = require("fs");

const SITES_DIR = process.env.SITES_DIR;

// parse_files
// Take the raw YAML returned by load_filetree
// Transform it into something usable by filetree
// ISSUES:
//  FIXED a) There is no easy way to have more than one site
//  FIXED b) We do *not* need to count keys, they are auto-generated if missing
//  FIXED c) Parse site should just handle parts of the tree for a site, allowing
//     the whole tree to be constructed from multiple site trees
//  d) We cannot handle actual directory structures
//  e) We do not need a top level 'pages' thing.
function parse_files(site, data) {
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

// load_filetree
// Load a sites config file
// Parse the files section as needed for filetree
// Return that
function load_filetree(site) {
  let data;
  try {
    const raw_data = yaml.load(fs.readFileSync(`${SITES_DIR}/${site}.yml`, "utf8"));
    const site_data = parse_files(site, raw_data);
    data = site_data;
  } catch (e) {
    console.error(e);
    data = ["error"];
  }
  return data;
}

// load_filetrees
// Take a list of allowed sites
// Return data for all the corresponding YML found in config/sites
function load_filetrees(allowed_sites) {
  let data;
  const result = [];

  try {
    const configs = get_sites();

    for (const site of configs) {
      if (!allowed_sites.includes(site)) {
        continue;
      }
      result.push({
        title: site,
        folder: true,
        expanded: true,
        children: load_filetree(site)
      });
    }

    data = {
      status: "ok",
      result: result
    };
  } catch (err) {
    console.error(err);
    data = {
      status: "error",
      error: err.message
    };
  }

  return data;
}

// get_sites
// Return all available sites if we can get them, with extension stripped
// Caller to catch errors
function get_sites() {
  const sites = fs.readdirSync(SITES_DIR).filter(f => f.endsWith(".yml"));
  return sites.map(s => s.slice(0, -4));
}

module.exports = {
  load_filetrees: load_filetrees,
  get_sites: get_sites
};
