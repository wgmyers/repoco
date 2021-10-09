// app.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";


/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

// Use local versions of things so we don't depend on external CDN
// Bootstrap CSS framework
app.use("/css/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
// EasyMDE markdown editor
app.use("/css/easymde", express.static(path.join(__dirname, "node_modules/easymde/dist")));
app.use("/js/easymde", express.static(path.join(__dirname, "node_modules/easymde/dist")));
// jQuery
app.use("/js/jquery", express.static(path.join(__dirname, "node_modules/jquery/dist")));
// Fancytree
app.use("/css/fancytree", express.static(path.join(__dirname, "node_modules/jquery.fancytree/dist")));
app.use("/js/fancytree", express.static(path.join(__dirname, "node_modules/jquery.fancytree/dist")));

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/edit", (req, res) => {
  res.render("edit", { title: "Edit" });
});

app.get("/help", (req, res) => {
  res.render("help", { title: "Help" });
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
