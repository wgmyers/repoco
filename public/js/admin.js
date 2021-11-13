// admin.js

// Client-side stuff for the admin user editor

// click_user_event
// Bring up the modal in which we edit our user details
function populate_modal(event) {
  console.log("I am in the callback");
  const modal_title = document.getElementById("modal-title");
  const modal_text = document.getElementById("modal-text");
  const modal_ok = document.getElementById("modal-ok");
  modal_title.innerHTML = "I Am The New Admin Modal Title";
  modal_text.innerHTML = "I am the text in the new admin modal.";
  modal_ok.addEventListener("click", () => {
    // Do stuff here
    modal.hide();
    modal.dispose();
  });
}

const modal = document.getElementById("modal-admin");
modal.addEventListener("show.bs.modal", populate_modal);
