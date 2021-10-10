// editor.js

/*global EasyMDE */

// Create a markdown editor with (mostly) default settings
// FIXME: sort settings out
const easyMDE = new EasyMDE({
  minHeight: "70vh",
  sideBySideFullscreen: false
});

const val = "No file loaded!";
easyMDE.value(val);

const jekyll_headers = {};

function process_jekyll_md(filename, fileconts) {
  let [head, ...bodyparts] = fileconts.split("---\n\n");
  let body;
  if (!bodyparts) {
    body = head;
  } else {
    jekyll_headers[filename] = head;
    body = bodyparts.join("---\n\n");
  }
  return body;
}

// See https://javascript.info/fetch
async function load_file(filename, generator) {
  let response = await fetch(`/api/files/${filename}`);

  if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let json = await response.json();
    if (json.status == "ok") {
      switch(generator) {
        case "jekyll":
          const body = process_jekyll_md(filename, json.contents);
          easyMDE.value(body);
          break;
        default:
          easyMDE.value(json.contents);
      }

    } else {
      easyMDE.value(json.message);
    }
  } else {
    // FIXME: No.
    alert("HTTP-Error: " + response.status);
  }
}

function load_file_event(event) {
  load_file(event.detail.file, event.detail.generator);
}

document.addEventListener("load_file", load_file_event, false);
