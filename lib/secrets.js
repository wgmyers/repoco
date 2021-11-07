// secrets.js

// Because we don't want to store passwords in .env
// Should this perhaps be an npm module? Hrm.

const fs = require("fs");

const DEBUG = false;
const secrets = {}
const secrets_file = "./.secrets";

function parse_secrets(file_content) {
  const lines = file_content.split("\n");
  lines.forEach(line => {
    // skip empty lines and comments
    if (!line.match(/^\s*\#?$/)) {
      const [key, val] = line.split("=");
      secrets[key] = val;
    };
  });
}

// load_secrets
// Load the secrets file
function load_secrets() {
  try {
    const file_content = fs.readFileSync(secrets_file, "utf8");
    parse_secrets(file_content);
  } catch (e) {
    console.log("Error in lib/secrets.js:");
    console.error(e);
  }
}

load_secrets();

if (DEBUG) {
  console.dir(secrets);
}


module.exports = {
  secrets: secrets
}
