// dashboard.js

// Client-side code for the dashboard

// A place to squirrel away the status of each site
const sites_status = {};

// make_list
// Take a list of items each of form:
// { name: NAME, files: NUMBER }
// Create our list group and return it
// Also populate sites_status.
// FIXME: poor separation of concerns.
function make_list(items) {
  const list_group = document.getElementById("site-list");
  list_group.innerHTML = ""; // clear out any existing children
  list_group.classList.add("list-group");
  for (const it of items) {
    sites_status[it.name] = { active: false, files: it.files };
    const item = document.createElement("a");
    item.setAttribute("href", "#");
    item.setAttribute("id", it.name);
    item.classList.add("list-group-item", "list-group-item-action", "d-flex", "justify-content-between", "align-items-center");
    item.innerHTML = it.name;
    const badge = document.createElement("span");
    const num_files = it.files.length;
    if (num_files > 0) {
      badge.classList.add("badge", "bg-warning", "rounded-pill");
      badge.innerHTML = num_files + (num_files > 1 ? " changes" : " change");
    } else {
      badge.classList.add("badge", "bg-info", "rounded-pill");
      badge.innerHTML = "Up to date";
    }
    item.appendChild(badge);
    item.addEventListener("click", handle_select_site);
    list_group.appendChild(item);
  }
}

// make_list_group
// FIXME: poorly named function.
// Calls API to get latest changes for all available sites
// This implicitly enforces the site perms.
// If ok, calls make_list to create the LH menu
// This function (also poorly named) also keeps a copy of the API result
async function make_list_group() {
  const list = document.getElementById("site-list");
  const response = await fetch("/api/changes");

  if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
    const json = await response.json();
    if (json.status == "ok") {
      make_list(json.changes);
    } else  {
      // JSON reports error
      const err_msg = document.createElement("div");
      err_msg.classList.add("alert", "alert-danger");
      err_msg.innerHTML = "Error: JSON not ok";
      list.appendChild(err_msg);
    }
  } else {
    // API call failed
    const err_msg = document.createElement("div");
    err_msg.classList.add("alert", "alert-danger");
    err_msg.innerHTML = "Error: API call failed";
    list.appendChild(err_msg);
  }
}



// select site
// Mark a site as active in sites_status
// Update dashboard to display site name, list of changed files
// Update LH menu to mark correct site active
// Also update live and publish links
function select_site(site) {
  const site_list = document.getElementById("site-list");
  const header = document.getElementById("selected-site-header");
  const changed_files = document.getElementById("changed-files-list");
  const live_link = document.getElementById("publish-live-link");
  const test_link = document.getElementById("publish-test-link");

  // Construct list of changed files
  let file_list;
  if(sites_status[site].files.length > 0) {
    file_list = sites_status[site].files.join(", ");
  } else {
    file_list = "None";
  }

  // Update display
  header.innerHTML = site;
  changed_files.innerHTML = `Changed files: ${file_list}`;

  // Update live and test site links
  // FIXME: we ought not assume we can derive the links from site name like this
  // Instead we need to read the config files and get them from there.
  // BUT this will do for now.
  live_link.setAttribute("href", `https://www.${site}/`);
  test_link.setAttribute("href", `https://www.${site}/test/`);

  // Set correct list item active
  for (const item of site_list.children) {
    if (item.id == site) {
      item.classList.add("active");
      sites_status[item.id].active = true;
    } else {
      item.classList.remove("active");
      sites_status[item.id].active = false;
    }
  }
}

// display_alert
// See https://getbootstrap.com/docs/5.0/components/alerts/#dismissing
// I'm not sure this is the easiest way to do this nor the most elegant, but
// it works, so fine.
function display_alert(type, msg) {
  const alert_holder = document.getElementById("alert-holder");
  const alert = document.createElement("div");
  alert.classList.add("alert", `alert-${type}`, "alert-dismissible", "fade", "show");
  alert.setAttribute("role", "alert");
  const button = document.createElement("button");
  button.classList.add("btn-close");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-dismiss", "alert");
  button.setAttribute("aria-label", "Close");
  alert.innerHTML = msg;
  alert.appendChild(button);
  alert_holder.appendChild(alert);
}

function get_selected_site() {
  let result;
  for (const key of Object.keys(sites_status)) {
    if (sites_status[key].active == true) {
      result = key;
      break;
    }
  }
  return result;
}

// call_api
// Takes an API call and optional target as parameter
// Calls the API publish command with current site, if publish, target
// Displays reponse as alert
async function call_api(call, target = undefined) {
  let api_call;
  let ok_msg;
  const site = get_selected_site();
  if (target) {
    api_call = `/api/${call}/${site}/${target}`;
    ok_msg = `Success! You have ${call}ed ${site} to ${target}`;
  } else {
    api_call = `/api/${call}/${site}`;
    ok_msg = `Success! You have ${call}ed ${site}`;
  }
  try {
    const response = await fetch(api_call);
    if (response.ok) {
      const json = await response.json();
      if (json.status == "ok") {
        // API call succeeded. Update message if we got one
        if(json.message) {
          ok_msg = json.message;
        }
        display_alert("info", ok_msg);
        // Update LH menu and reselect current site
        make_list_group().then(() => {
          select_site(site);
        });
      } else {
        // Bugger
        display_alert("danger", `Error: ${json.error}`);
      }
    } else {
      // Fetch failed
      display_alert("danger", `Error: API call ${api_call} failed`);
    }
  } catch {
    display_alert("danger", `Error: Could not call ${api_call}`);
  }

}

// Event handlers

// handle_toggle
// Event handler for enabler toggles
function handle_toggle() {
  // Get the relevant button
  const btn = document.getElementById(this.id.replace("check", "btn"));
  if (this.checked) {
    // Enable the button
    btn.removeAttribute("disabled");
  } else {
    // Disable the button
    btn.setAttribute("disabled", true);
  }
}

// handle_select_site
// Event handler for LH menu clicks
function handle_select_site() {
  select_site(this.id);
}

// Handlers for git interface buttons
function handle_publish() {
  const target = this.id.slice(8, 12);
  call_api("publish", target);
}

function handle_update() {
  call_api("update");
}

function handle_revert() {
  call_api("revert");
}



// Main

// make_dashboard
// First make the LH menu
// Then, if possible, select the first site on it
function make_dashboard() {
  // make_list_group makes an async API call so we must wait
  make_list_group().then(() => {
    // Select first site in sites, if we have any
    if(Object.keys(sites_status).length > 0) {
      select_site(Object.keys(sites_status)[0]);
    } else {
      // We have no sites. Disable all the toggles + update button
      const toggles = document.querySelectorAll(".enable-toggle");
      toggles.forEach(tog => tog.setAttribute("disabled", true));
      const update_btn = document.getElementById("update-btn");
      update_btn.setAttribute("disabled", true);
    }

  });
}

// Build page
window.onload = make_dashboard();

// Event handlers for enable-toggle switches
const toggles = document.querySelectorAll(".enable-toggle");
toggles.forEach(tog => tog.addEventListener("click", handle_toggle));

// Event handlers for dashboard buttons
const publish_live = document.getElementById("publish-live-btn");
publish_live.addEventListener("click", handle_publish);

const publish_test = document.getElementById("publish-test-btn");
publish_test.addEventListener("click", handle_publish);

const revert = document.getElementById("revert-btn");
revert.addEventListener("click", handle_revert);

const update = document.getElementById("update-btn");
update.addEventListener("click", handle_update);
