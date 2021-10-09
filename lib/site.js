// site.js

// Handle loading data from the site config file
// and returning it as a JSON object so filetree can display it

// load_sites
// For now, just return some hardcoded JSON
// Later:
// 1 - Load all files found in config/sites and return that as JSON
// 2 - Load only files in config/sites for which the user has access
// 3 - If no user, return an error
function load_sites() {
  const data = {
    "status": "ok",
    "result": [
        { "title": "vmyers.com", "key": "1", "folder": true, "expanded": true, "children": [
          { "title": "abcoasters.md", "key": "2" },
          { "title": "about.md", "key": "3" },
          { "title": "abseries.md", "key": "4" },
          { "title": "beyond.md", "key": "5" }
        ]}
    ]
  };
  return data;
}

module.exports = {
  load_sites: load_sites
};
