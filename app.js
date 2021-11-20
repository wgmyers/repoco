// app.js

/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require("express-session");
const MemoryStore = require('memorystore')(session)
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

/**
 * Local Modules
 */
const admin = require("./lib/admin");
const secrets = require("./lib/secrets");

/**
 * App Variables
 */

const index_routes = require("./routes/index");
const auth_routes = require("./routes/auth");
const user_routes = require("./routes/user");
const admin_routes = require("./routes/admin");
const api_routes = require("./routes/api");
const app = express();

/**
 *  App Configuration
 */

/* Use pug */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

/* Use favicon middleware */
app.use(favicon(__dirname + "/public/favicon.ico"));

/* Logging */
app.use(logger("dev"));

/* Public files */
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
 * Session configuration
 * FIXME - ensure we are using sensible settings
 */

app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: secrets.secrets.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

/* Use flash messages */
app.use(flash());

/* Parse JSON POST request properly */
app.use(express.json());

/**
 * Passport configuration
 */
app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/Users");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * Database connection
 */

// See https://mongoosejs.com/docs/deprecations.html
// also https://www.freecodecamp.org/news/mongodb-mongoose-node-tutorial/
// NB: Not sure why commented out options won't work any more.
// FIXME: Find out.
mongoose.connect(`mongodb://${secrets.secrets.DB_USER}:${secrets.secrets.DB_PASSWORD}@localhost/${secrets.secrets.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//  useCreateIndex: true,
//  useFindAndModify: false
}, async function(err) {
  if (err) {
    console.error("Could not connect to mongodb on localhost - please check mongodb is running.");
    console.dir(err);
    // FIXME: shut down if we have no db
  } else {
    try {
      await admin.check_admin_exists();
    } catch (err) {
      console.error("Admin user check failed");
      // FIXME: shut down if we can't check for admin
    }
  }
});

/**
 * Routes Definitions
 */

// handle / , which is either dashboard or login page
app.use("/", index_routes);

// When we implement auth, here will live /login, /logout
app.use("/", auth_routes);

// handle pages requiring login
app.use("/", user_routes);

// handle admin page/s
app.use("/", admin_routes);

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

// Graceful app cleanup
process.once("SIGINT", () => {
  mongoose.connection.close(function () {
    console.log('Mongoose connection disconnected');
  });
});

module.exports = app;
