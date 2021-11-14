// admin.js

// Client-side stuff for the admin user editor

// click_user_event
// Bring up the modal in which we edit our user details
function populate_modal(event) {
  // Get the modal itself
  const modal_element = document.getElementById("modal-admin");     // This is just the DOM element
  const modal = bootstrap.Modal.getOrCreateInstance(modal_element); // This is the actual BS modal instance

  // Get data out of the row we were clicked from
  const row = event.relatedTarget;
  const username = row.getAttribute("data-bs-username");
  const email = row.getAttribute("data-bs-email");
  const level = row.getAttribute("data-bs-level");
  const active = row.getAttribute("data-bs-active");
  const sites = row.getAttribute("data-bs-sites").split("|");

  // Update form action
  const update_form = document.getElementById("modal-update-form");
  update_form.setAttribute("action", `/updateuser/${username}`);

  // Modal title
  const modal_title = document.getElementById("modal-title");
  modal_title.innerHTML = `Editing '${username}'`;

  // Modal body
  const modal_text = document.getElementById("modal-text");
  modal_text.innerHTML = `User level: '${level}'`;

  // Email textbox
  const modal_email = document.getElementById("modal-email");
  modal_email.value = email;

  // Sites
  // First uncheck them all
  const site_checks = document.querySelectorAll(".site-check");
  site_checks.forEach(check => check.checked = false);
  // Now check only the ones we want checked
  for (const site of sites) {
    // Skip empty sites created by empty site list
    if (site == "") {
      continue;
    }
    const site_checkbox = document.getElementById(`site-${site}`);
    site_checkbox.checked = true;
  }

  // Active toggle
  const modal_active = document.getElementById("modal-active");
  if (active == "Yes") {
    modal_active.checked = true;
  } else {
    modal_active.checked = false;
  }

  // Delete user button
  const modal_delete_user = document.getElementById("modal-delete-user-btn");
  modal_delete_user.setAttribute("disabled", true); // Always start disabled
  modal_delete_user.addEventListener("click", () => {
    window.location.href=`/deluser/${username}`;
  });
  // Delete user toggle should be unchecked on start
  const modal_delete_user_toggle = document.getElementById("modal-delete-user-check");
  modal_delete_user_toggle.checked = false;
  // Disable delete user toggle for admin user
  // Make sure it is enabled for other users though.
  switch (level) {
    case "admin":
      modal_delete_user_toggle.setAttribute("disabled", true);
      break;
    default:
      modal_delete_user_toggle.removeAttribute("disabled");
  }

  // Ok button
  //const modal_ok = document.getElementById("modal-ok");
  //modal_ok.addEventListener("click", () => {
    // Do stuff here
  //  console.log("I am in the ok button click handler");
  //  modal.hide();
  //});
}

// handle_toggle
// Event handler for enabler toggles
function handle_toggle() {
  // Get the relevant button
  const delete_btn = document.getElementById("modal-delete-user-btn");
  const update_btn = document.getElementById("modal-update-btn");
  if (this.checked) {
    // Enable the delete button and disable update
    delete_btn.removeAttribute("disabled");
    update_btn.setAttribute("disabled",true);
  } else {
    // Disable the delete button and enable update
    delete_btn.setAttribute("disabled", true);
    update_btn(removeAttribute("disabled"));
  }
}

// Event handler for delete user button toggle
const toggle = document.getElementById("modal-delete-user-check");
toggle.addEventListener("click", handle_toggle);

// Event handler to bring up modal on table row click
// Table rows contain data-bs-* elements as required to set this up
const modal = document.getElementById("modal-admin");
modal.addEventListener("show.bs.modal", populate_modal);
