// site.js

// Handle loading data from the site config file
// and returning it as a JSON object so filetree can display it

const yaml = require('js-yaml');
const fs   = require('fs');

const DATADIR = "config/sites";

// Take the raw YAML returned by load_site
// Transform it into something usable by filetree
// QUERY: We could also do this clientside using the postProcess hook.
// Is it better here or not? idk
function parse_site(site, data) {
  let key = 2;         // key 1 is the toplevel, so start at 2
  let ckey;            // Separate counter for keys of child nodes
  let child_arr = [];  // ultimately the children of the top level node

  // Iterate over top level keys under 'files'
  const keys = Object.keys(data["files"]);
  for (const k of keys) {
    ckey = key + 1; // key is for new folder, children start with next key
    let file_arr = [];
    const expand = k == 'pages' ? true : false; // Expand only 'pages' section

    // Iterate over child nodes of a top level key
    for (const f of data["files"][k]) {
      const file_data = {
        title: f,
        key: ckey
      }
      file_arr.push(file_data);
      ckey += 1;
    }
    const folder = {
      title: k,
      key: key,
      folder: true,
      expanded: expand,
      children: file_arr
    }
    child_arr.push(folder);
    key = ckey; // Next item starts here
  }

  // Top level folder is always site name, with key of 1
  // We do this last because we need to calculate child_arr first
  result = [
    {
      title: site,
      key: 1,
      folder: true,
      expanded: true,
      children: child_arr
    }
  ]
  return result;
}

function load_site(site) {
  let data;
  try {
    const raw_data = yaml.load(fs.readFileSync(`${DATADIR}/${site}.yml`, 'utf8'));
    const site_data = parse_site(site, raw_data);
    data = {
      status: "ok",
      result: site_data,
    }
  } catch (e) {
    console.log(e);
    data = {
      status: "error",
      error: `No data for ${site}`
    }
  }
  return data;
}

// load_sites
// For now, just return some hardcoded JSON
// Later:
// 1 - Load all files found in config/sites and return that as JSON
// 2 - Load only files in config/sites for which the user has access
// 3 - If no user, return an error
function load_sites() {
  const data = load_site("vmyers.com");

  return data;
}

module.exports = {
  load_sites: load_sites
};
