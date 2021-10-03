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

// Use local versions of jquery and bootstrap so we don't depend on external CDN
app.use("/css/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/js/jquery", express.static(path.join(__dirname, "node_modules/jquery/dist")));

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
