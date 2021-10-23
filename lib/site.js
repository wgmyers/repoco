// site.js

// Handle loading data from the site config file
// and returning it as a JSON object so filetree can display it

const yaml = require("js-yaml");
const fs   = require("fs");

const DATADIR = "config/sites";

// Take the raw YAML returned by load_site
// Transform it into something usable by filetree
// QUERY: We could also do this clientside using the postProcess hook.
// Is it better here or not? idk
// FIXME: this needs a complete rewrite:
//  a) There is no easy way to have more than one site
//  b) We do *not* need to count keys, they are auto-generated if missing
//  c) Parse site should just handle parts of the tree for a site, allowing
//     the whole tree to be constructed from multiple site trees
//  d) We cannot handle actual directory structures
//  e) We do not need a top level 'pages' thing.
function old_parse_site(site, data) {
  let key = 2;         // key 1 is the toplevel, so start at 2
  let ckey;            // Separate counter for keys of child nodes
  let child_arr = [];  // ultimately the children of the top level node
  const generator = data["generator"] ? data["generator"] : "unknown";

  // Iterate over top level keys under 'files'
  const keys = Object.keys(data["files"]);
  for (const k of keys) {
    ckey = key + 1; // key is for new folder, children start with next key
    let file_arr = [];
    const expand = k == "pages" ? true : false; // Expand only 'pages' section

    // Iterate over child nodes of a top level key
    for (const f of data["files"][k]) {
      const file_data = {
        title: f,
        key: ckey,
        loadable: true,
        loadpath: `${site}/${f}`,
        generator: generator
      };
      file_arr.push(file_data);
      ckey += 1;
    }
    const folder = {
      title: k,
      key: key,
      folder: true,
      expanded: expand,
      children: file_arr
    };
    child_arr.push(folder);
    key = ckey; // Next item starts here
  }

  // Top level folder is always site name, with key of 1
  // We do this last because we need to calculate child_arr first
  const result = [
    {
      title: site,
      key: 1,
      folder: true,
      expanded: true,
      children: child_arr
    }
  ];
  return result;
}

// REWRITE parse_site:
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
    data = site_data
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
      })
    }

    data = {
      status: "ok",
      result: result
    }
  } catch (e) {
    console.error(e);
    data = {
      status: "error",
      error: e.message
    }
  }

  return data;
}

module.exports = {
  load_sites: load_sites
};
