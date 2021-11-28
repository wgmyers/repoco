// editor.js

/*global EasyMDE,bootstrap,mk_alert */

const editor_vars = {
  loaded: false,
  dirty: false,
  filepath: undefined,
  generator: undefined
};

// Create a markdown editor with (mostly) default settings
// FIXME: sort settings out
const easyMDE = new EasyMDE({
  minHeight: "70vh",
  sideBySideFullscreen: false,
  spellChecker: false
});

// Catch change events so we can toggle dirty flag and save/revert button status
easyMDE.codemirror.on("change", () => {
  // We're only interested in the case where loaded is true and dirty is false
  if(editor_vars.loaded && !editor_vars.dirty) {
    editor_vars.dirty = true;
    enable_buttons();
  }
});

// enable_btn
// Enable a button.
// Takes the DOM element, removes 'disabled', sets given style
function enable_btn(btn, style) {
  btn.classList.remove("btn-secondary");
  btn.removeAttribute("disabled");
  btn.classList.add(`btn-${style}`);
}

// disable_btn
// Disable a button
// Takes the DOM element, adds disabled, sets btn-secondary
// FIXME: we should not have to know the btn-style element to remove here
function disable_btn(btn, style) {
  btn.classList.remove(`btn-${style}`);
  btn.setAttribute("disabled", true);
  btn.classList.add("btn-secondary");
}

// enable_buttons
// Enable the save and revert buttons
function enable_buttons() {
  const save = document.getElementById("txt-save");
  const revert = document.getElementById("txt-revert");
  enable_btn(save, "primary");
  enable_btn(revert, "primary");
  save.addEventListener("click", handle_save_click);
  revert.addEventListener("click", handle_revert_click);
}

// disable_buttons
// Disable the save and revert buttons
function disable_buttons() {
  const save = document.getElementById("txt-save");
  const revert = document.getElementById("txt-revert");
  disable_btn(save, "primary");
  disable_btn(revert, "primary");
  save.removeEventListener("click", handle_save_click);
  revert.removeEventListener("click", handle_revert_click);
}

// Handlers for save and revert buttons.
// Save calls save file
// Revert calls load file
function handle_save_click() {
  save_file(editor_vars.filepath, editor_vars.generator);
}

function handle_revert_click() {
  const modal_element = document.getElementById("modal-editor");
  const modal = bootstrap.Modal.getOrCreateInstance(modal_element); // Returns a Bootstrap modal instance
  const modal_title = document.getElementById("modal-title");
  const modal_text = document.getElementById("modal-text");
  const modal_ok = document.getElementById("modal-ok");
  modal_title.innerHTML = "Confirm Revert To Saved";
  modal_text.innerHTML = "Are you sure? All changes since last save will be lost.";
  modal_ok.addEventListener("click", () => {
    load_file(editor_vars.filepath, editor_vars.generator);
    modal.hide();
    modal.dispose();
  });
  modal.show(); // show it
}

// Default editor contents
const val = "No file loaded!";
easyMDE.value(val);

// Special handling for Jekyll headers
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

// save_file
async function save_file(filepath, generator) {
  let text;

  // First we prepare a simple JSON payload, restoring Jekyll headers if needed
  switch (generator) {
  case "jekyll":
    text = jekyll_headers[filepath.filename] + "---\n\n" + easyMDE.value();
    break;
  default:
    text = easyMDE.value();
  }
  const body = JSON.stringify({ contents: text });

  // Next we call the API with it
  // See https://stackoverflow.com/questions/29775797/fetch-post-json-data#29823632
  const response = await fetch(`/api/files/${filepath.site}/${filepath.path}/${filepath.filename}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: body
  });
  const json= await response.json();
  // If all well, reset save and revert buttons and flags
  if (json.status == "ok") {
    editor_vars.dirty = false;
    disable_buttons();
    mk_alert("alert-holder", "info", `Saved ${filepath.filename} ok`);
  } else {
    // If not, display an error message
    console.error(`Could not save ${filepath.filename}`);
    mk_alert("alert-holder", "danger", `Could not save ${filepath.filename}`);
  }

}

function looks_dodgy(file) {
  if (file.match(/\.\.\//) || file.match(/%2f/i)) {
    return true;
  }
  return false;
}

// load_file
// Custom file loader
// See https://javascript.info/fetch
async function load_file(filepath, generator) {
  if (looks_dodgy(filepath.site) || looks_dodgy(filepath.path) || looks_dodgy(filepath.filename)) {
    mk_alert("alert-holder","danger", `Could not load ${filename}`);
    return;
  }
  const response = await fetch(`/api/files/${filepath.site}/${filepath.path}/${filepath.filename}`);

  if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
    const json = await response.json();
    if (json.status == "ok") {
      switch(generator) {
      case "jekyll":
        easyMDE.value(process_jekyll_md(filepath.filename, json.contents));
        break;
      default:
        easyMDE.value(json.contents);
      }
      editor_vars.loaded = true;
      editor_vars.dirty = false;
      editor_vars.filepath = filepath;
      editor_vars.generator = generator;
      disable_buttons();

    } else {
      mk_alert("alert-holder", "danger", json.message);
      // easyMDE.value(json.message);
    }
  } else {
    // FIXME: This should not happen
    mk_alert("alert-holder", "danger", "HTTP-Error: " + response.status);
  }
}

function load_file_event(event) {
  if (editor_vars.dirty) {
    const modal_element = document.getElementById("modal-editor");
    const modal = bootstrap.Modal.getOrCreateInstance(modal_element); // Returns a Bootstrap modal instance
    const modal_title = document.getElementById("modal-title");
    const modal_text = document.getElementById("modal-text");
    const modal_ok = document.getElementById("modal-ok");
    modal_title.innerHTML = "Confirm Load New File";
    modal_text.innerHTML = "Are you sure? All unsaved changes to current file will be lost.";
    modal_ok.addEventListener("click", () => {
      load_file(event.detail.filepath, event.detail.generator);
      modal.hide();
      modal.dispose();
    });
    modal.show(); // show it
  } else {
    load_file(event.detail.filepath, event.detail.generator);
  }
}

// FIXME: why not use our own much nicer modal?
function leave_page_event(event) {
  if(editor_vars.dirty) {
    //following two lines will cause the browser to ask the user if they
    //want to leave. The text of this dialog is controlled by the browser.
    event.preventDefault(); //per the standard
    event.returnValue = ''; //required for Chrome
  }
}

// Catch attempt to leave page so we can check for unsaved data
window.addEventListener('beforeunload', leave_page_event);

// Catch event emitted by filetree
document.addEventListener("load_file", load_file_event, false);
