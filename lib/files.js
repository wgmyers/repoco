// files.js

const fs = require("fs");

const FILESDIR = "repos";

function save_file(site, file, json) {
  let data;
  try {
    fs.writeFileSync(`${FILESDIR}/${site}/${file}`, json.contents, "utf8");
    data = {
      status: "ok"
    };
  } catch (e) {
    console.error(e);
    data = {
      status: "error",
      message: `Could not save file ${file} from ${site}`
    };
  }
  return data;
}

function load_file(site, file) {
  let data;
  try {
    const file_content = fs.readFileSync(`${FILESDIR}/${site}/${file}`, "utf8");
    data = {
      status: "ok",
      contents: file_content
    };
  } catch (e) {
    console.error(e);
    data = {
      status: "error",
      message: `Could not load file ${file} from ${site}`
    };
  }
  return data;
}

module.exports = {
  load_file: load_file,
  save_file: save_file
};
