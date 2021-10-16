// app.js

/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

/**
 * App Variables
 */

const index_routes = require("./routes/index");
// const auth_routes = require("./routes/auth");
const user_routes = require("./routes/user");
const api_routes = require("./routes/api");
const app = express();

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

// handle / , which is either dashboard or login page
app.use("/", index_routes);

// When we implement auth, here will live /login, /logout
// app.use("/", auth_routes);

// handle pages requiring login
app.use("/", user_routes);

// handle API routes (login required)
app.use("/", api_routes);

// Error routes (can't be under routes/ for some reason?)

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

module.exports = app;
