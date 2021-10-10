// files.js

const fs = require("fs");

const FILESDIR = "repos";

function load_file(site, file) {
  let data;
  try {
    const file_content = fs.readFileSync(`${FILESDIR}/${site}/${file}`, "utf8");
    data = {
      status: "ok",
      contents: file_content
    };
  } catch (e) {
    console.log(e);
    data = {
      status: "error",
      message: `Could not load file ${file} from ${site}`
    };
  }
  return data;
}

module.exports = {
  load_file: load_file
};
