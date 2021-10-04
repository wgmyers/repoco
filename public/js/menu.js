/*
 * menu.js
 *
 * Highlight menu item of current user page
 */

function set_menu_highlight() {
  const path = window.location.pathname.substring(1) || 'home';
  //alert(`Welcome to ${path}`);
  console.log(`Got ${path}`);
  const selected_item = document.getElementById(`nav-${path}`);
  console.dir(selected_item);
  const selected_link = selected_item.children[0];
  selected_link.classList.add("active");
  selected_link.setAttribute("aria-current", "page")
}

window.onload = set_menu_highlight();
