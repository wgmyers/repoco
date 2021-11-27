// files.js

const fs = require("fs");

const GIT_ROOT = process.env.GIT_ROOT;

// get_real_path
// If our files are in the repo root dir, path will be NOPATH
// If you really want to load files from a subdir called NOPATH you are SoL.
function get_real_path(site, path, file) {
  let real_path;
  if (path == "NOPATH") {
    real_path = `${site}/${file}`;
  } else {
    real_path = `${site}/${path}/${file}`;
  }
  return real_path;
}

function is_symlink(real_path) {
  const stats = fs.lstatSync(`${GIT_ROOT}/${real_path}`);
  return stats.isSymbolicLink();
}

function looks_dodgy(file) {
  return file.match(/\.\.\//);
}

function save_file(site, path, file, json) {
  let data;
  const real_path = get_real_path(site, path, file);
  try {
    if (is_symlink(real_path)) {
      throw `${file} is a symlink, bailing`;
    }
    if (looks_dodgy(file) || looks_dodgy(path)) {
      throw `${path}/${file} looks dodgy, bailing`;
    }
    fs.writeFileSync(`${GIT_ROOT}/${real_path}`, json.contents, "utf8");
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

function load_file(site, path, file) {
  let data;
  const real_path = get_real_path(site, path, file);
  try {
    if (is_symlink(real_path)) {
      throw `${file} is a symlink, bailing`;
    }
    if (looks_dodgy(file) || looks_dodgy(path)) {
      throw `${path}/${file} looks dodgy, bailing`;
    }
    const file_content = fs.readFileSync(`${GIT_ROOT}/${real_path}`, "utf8");
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
