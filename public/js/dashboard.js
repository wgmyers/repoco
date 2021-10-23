// dashboard.js

// Client-side code for the dashboard

// make_list
// Take a list of items each of form:
// { name: NAME, files: NUMBER }
// Create our list group and return it
function make_list(items) {
  const list_group = document.createElement("ul");
  list_group.classList.add("list-group");
  for (const it of items) {
      const item = document.createElement("li");
      item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      item.innerHTML = it.name;
      const badge = document.createElement("span");
      if (it.files > 0) {
        badge.classList.add("badge", "bg-warning", "rounded-pill");
        badge.innerHTML = it.files + (it.files > 1 ? " changes" : " change");
      } else {
        badge.classList.add("badge", "bg-info", "rounded-pill");
        badge.innerHTML = "Up to date";
      }
      item.appendChild(badge);
      list_group.appendChild(item);
  }
  return list_group;
}

async function make_list_group() {
  const list = document.getElementById("sitelist");
  const response = await fetch(`/api/changes`);

  if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
    const json = await response.json();
    if (json.status == "ok") {
      list.appendChild(make_list(json.changes));
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

window.onload = make_list_group();
