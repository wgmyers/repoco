// alert.js

/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "mk_alert" }]*/

// Construct an alert
function mk_alert(holder_id, type, message) {
  // Get the holding div
  const holder = document.getElementById(holder_id);

  // Create a close button
  const button = document.createElement("button");
  button.classList.add("btn-close");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-dismiss", "alert");
  button.setAttribute("aria-label", "Close");

  // Create the alert
  const alert = document.createElement("div");
  alert.classList.add("alert", `alert-${type}`, "alert-dismissible", "fade", "show");
  alert.setAttribute("role", "alert");
  alert.innerHTML = message;

  // Add the button to the alert, and the alert to the DOM
  alert.appendChild(button);
  holder.appendChild(alert);
}
