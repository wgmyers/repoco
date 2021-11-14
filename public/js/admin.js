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
  const sites = row.getAttribute("data-bs-sites").split("|");

  // Modal title
  const modal_title = document.getElementById("modal-title");
  modal_title.innerHTML = `Editing '${username}'`;

  // Modal body
  const modal_text = document.getElementById("modal-text");
  modal_text.innerHTML = `User ${username} is level '${level}'`;

  // Email textbox
  const modal_email = document.getElementById("modal-email");
  modal_email.value = email;

  // Ok button
  const modal_ok = document.getElementById("modal-ok");
  modal_ok.addEventListener("click", () => {
    // Do stuff here
    console.log("I am in the ok button click handler");
    modal.hide();
  });
}

// Event handler to bring up modal on table row click
// Table rows contain data-bs-* elements as required to set this up
const modal = document.getElementById("modal-admin");
modal.addEventListener("show.bs.modal", populate_modal);
