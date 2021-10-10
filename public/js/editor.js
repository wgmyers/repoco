// editor.js

// Create a markdown editor with (mostly) default settings
// FIXME: sort settings out
const easyMDE = new EasyMDE({
  minHeight: "70vh",
  sideBySideFullscreen: false
});

const val = "No file loaded!";
easyMDE.value(val);

// See https://javascript.info/fetch
async function load_file(file) {
  let response = await fetch(`/api/files/${file}`);

  if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let json = await response.json();
    if (json.status == 'ok') {
      easyMDE.value(json.contents);
    } else {
      easyMDE.value(json.message);
    }
  } else {
    // FIXME: No.
    alert("HTTP-Error: " + response.status);
  }
}

function load_file_event(event) {
  load_file(event.detail.file);
}

document.addEventListener("load_file", load_file_event, false);
