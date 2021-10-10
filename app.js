// app.js

/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

const site = require("./lib/site");
const files = require("./lib/files");

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

// HTML routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/edit", (req, res) => {
  res.render("edit", { title: "Edit" });
});

app.get("/help", (req, res) => {
  res.render("help", { title: "Help" });
});

// API routes
app.get("/api/sites", (req, res) => {
  res.json(site.load_sites());
});

app.get("/api/files/:site/:file", (req, res) => {
  res.json(files.load_file(req.params.site, req.params.file));
});

// Error routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace (pug - #{error.stack})
if (app.get("env") === "development") {
  app.use((err, req, res, _next) => {
    const errcode = err.status || 500;
    let errmsg = err.message;
    if (errcode == 500) {
      errmsg = "Internal server error";
    }
    //console.log(err);
    res.status(errcode);
    res.render("error", {
      message: errcode + ": " + errmsg,
      error: err
    });
  });
}

// production error handler
// no stacktraces or internals leaked to user
app.use((err, req, res, _next) => {
  const errcode = err.status || 500;
  let errmsg = err.message;
  if (errcode == 500) {
    errmsg = "Internal server error";
  }
  res.status(errcode);
  res.render("error", {
    message: errcode + ": " + errmsg,
    error: undefined
  });
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
