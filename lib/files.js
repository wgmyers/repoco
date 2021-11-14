// files.js

const fs = require("fs");

const GIT_ROOT = process.env.GIT_ROOT;

function is_symlink(site, file) {
  const stats = fs.lstatSync(`${GIT_ROOT}/${site}/${file}`);
  return stats.isSymbolicLink();
}

function save_file(site, file, json) {
  let data;
  try {
    if (is_symlink(site, file)) {
      throw `${file} is a symlink, bailing`;
    }
    fs.writeFileSync(`${GIT_ROOT}/${site}/${file}`, json.contents, "utf8");
    data = {
      status: "ok"
    };
  } catch (err) {
    console.error(err);
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
    if (is_symlink(site, file)) {
      throw `${file} is a symlink, bailing`;
    }
    const file_content = fs.readFileSync(`${GIT_ROOT}/${site}/${file}`, "utf8");
    data = {
      status: "ok",
      contents: file_content
    };
  } catch (err) {
    console.error(err);
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
