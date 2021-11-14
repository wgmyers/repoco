# TODO

1. DONE Basic node/express scaffolding
2. DONE Basic data structure outline
3. DONE Code tidy - logging, .env, favicon, routes outside app.js, simple tests etc
4. DONE Edit page integrating file tree and MD editor for markdown w/ load/save file
5. DONE Git integration - publish / mark edited but unpublished files
6. DONE User login
7. Security audit and code cleanup - include proper session handling
8. Proper test suite with reasonable coverage
9. Deploy!
10. Make Github repo public, register repoco.org, build documentation site etc
11. Add support for plaintext and csv editors, other phase 2 features

## TASKS

### DOING

Testing:
* Ensure we shut down gracefully so we don't need mocha --exit
* Test login as admin
* Test login as user
* Unit tests

Security:
* See notes below (way below)

User settings:
* Add a user settings page where you can change eg password and email (?)

Authentication:
* Implement 'Remember Me'
* Add password reset mechanism

Auto-deploy:
* Implement method of auto-deploying on git push in a repo

Config:
* Lose `pages` section - just replicate editable portion of filetree under `files`

Editor:
* File load errors should come up as flash alerts
* Mark unpublished changed files in filetree
* Support arbitrary filetrees defined under files in config
* Have 'No File Loaded' msg when no file loaded, not an empty editor
* Add filename in top banner in case we back out of new file load and tree no longer in sync with editor
* Handle multiple editors (csv editor, code editor)

Help page:
* Have one

### DONE

* File access locked down to list of files in config
* Simple route testing works again
* Disable login for users marked inactive
* API routes only respond to allowed sites  files
* User pages only display allowed sites / files
* User site edit enable/disable implemented
* Update user implemented
* Admin page shows whether user is active
* Admin page allows delete user, will not delete admin user
* All routes now check user perms via lib/auth.js
* API routes now check user permissions
* Display current user in RH of nav
* Display flash info on successful registration
* Allow user registration
* Display flash error on failed registration
* Display flash error on failed login
* Display users on admin page
* Keep DB credentials and default admin settings in .secrets not .env
* Logout works and redirects to /
* User pages only display for logged in regular users
* Admin page only displays for logged in admin
* Create admin user from .env if none found on startup
* / displays login page
* Manually create repoco and repoco_test db users
* Add routes/auth.js with login and logout routes
* Add passport and mongoose code from bandmin
* Add suitable Users.js model
* Add mongoose, passport, passport-local, passport-local-mongoose
* Pushed to Github. Private repo for now though.
* Git backend implemented
* Git integration front-end implemented
* Add git config section
* Dashboard site select LH menu implemented
* Dashboard enable toggle switches implemented
* Design dashboard page with status info and publish buttons
* Implement function that returns list of files modified but not yet committed
* Support for multiple config files
* Make local repo an actual repo so we can test our local git commands
* Save file implemented
* Add modal dialog confirmation if file load attempted while current file has changes
* Add modal dialog Are You Sure Y/N for revert button
* Implement revert button action to reload
* Implement dirty flag and toggle save/revert buttons if set
* Add save / revert buttons to edit page
* Add basic integration test
* Add mocha, chai, supertest and nyc
* Add connect-flash and express-session
* Add morgan for logging and serve-favicon for favicon
* Move routes from app.js to routes/foo.js
* Install dotenv, start app with bin/www
* Hide jekyll markdown file header if generator is 'jekyll'
* Clicking on file in filetree loads it in editor
* Add api route to load file
* Load filetree content from config
* Add api route to populate filetree
* Add basic error page handling
* Embed filetree on UI LHS
* Split edit UI into two columns with space for filetree
* Basic embed of MD editor
* Research filetree / MD editor / CSV editor / git components
* Devise data structure
* Set up node/express scaffolding

# NOTES

## Authentication

We need an admin user (who can add users and alter their permissions) and one
or more regular users. The admin user is /not/ a super-user; all they can do
is manage the user DB: adding and removing regular users and able to alter their
settings (change password, enable/disable, add/remove site permissions and other
settings).

There can only be one admin user, it is created by default, using settings
found in .secrets - DEFAULT_ADMIN_USER and DEFAULT_ADMIN_PWD. When we come to have
installation instructions, we will not provide values for these: in this way there
is no single set of default admin credentials - it is up to installers to put
something sensible here.

## DB

The 'repoco' user needs to be set up (also the repoco_test user) manually.

The following commands in Mongo shell does this:

```
> use database
> db.createUser({
  user: "username",
  pwd: "password",
  roles:[{
    role: "readWrite",
    db:"dbname"}]
})
```

DB credentials live in .secrets and not .env

## Issues

* User email not validated at all
* After publishing to test, dashboard says 'up to date', but we have changes
not yet made live. This might seem confusing to users. We should track changes
published to test but not to live and report them on the dashboard. But how?
* Git push should grab user details from user
* Much testing / error checking on git integration needed
* Dashboard button toggles should be disabled if there are no changes. Or should they?
* Load error triggers dirty file flag. Really annoying.
* Load / save errors should pop up flash warning
* Need express-session solution for production deployment
* Missing files not handled consistently depending on path presence
* Hiding Jekyll headers makes sense, but a way to optionally edit parts of them might be nice
* FIXED npm audit complaining about node-sass - moved to dart-sass

## Future Ideas

* Internationalise
* Accessiblity audit and fixes
* Add Umami / stats integration
* Add create / delete file
* Add support for Jekyll blog posts w/ draft and preview
* Support non local repos eg Github etc

## Git snowflake configuration

Push options:

Not supported by default.

Run `git config receive.advertisePushOptions true` in each remote.

See https://stackoverflow.com/questions/45400553/the-receiving-end-does-not-support-push-options#45400809

## Git testing notes

`assets/testrepos` contains our test local bare repos
`repos/` contains our working copy of the repo

We are using a cut-down version of the actual vmyers.com repo for now, so the
config file will have to be amended for live.

We should also add another repo (example or some such) and BE VERY CAREFUL when
we come to push Repoco to github that we are not pushing anything we shouldn't.

Neither `assets/` nor `repos/` are being tracked in Repoco repo though, so we
should be ok.

## Git integration notes

We should ensure this is modular, with an abstraction layer over a specific
git-local library, so support for github etc can be easily added later on.

For local git: https://www.npmjs.com/package/simple-git looks pretty good.

### Git commands

We do not need or wish to implement the whole of git. We do not even want to
muck about with cloning the repo. That can be done by hand on a per-site basis.
At least initially.

What we do want is the following:

* git pull - on site load, to make sure we are up-to-date w/ local repo
* git commit; git push - on hitting Publish buttons
* git status - on displaying filetree and dashboard to show unpushed stuff

### Git Pull

There must be some mechanism to check upstream for changes and pull them.

### Git Commit / Push

We definitely don't want to commit without pushing because our target user is
non-technical and doesn't need to know that the 'publish' process is actually
a two-step thing. It's bad enough that deploying to prod after deploying to test
will automatically pick up all unreverted changes pushed to test, but I think
we can live with that. ("If you don't like the changes in test, edit and publish
to test again. Only when happy publish to live.") Yes, we could technically
do auto-revert-file somehow, but this is a pain. Yes will probably be motivated
to add it in at a later date, but Here Be Dragons and there may well be reason
not to (how do I unrevert my accidental revert questions etc).

We'll need to set up hooks on the remote git repo so that it will optionally
1) do nothing, 2) deploy to prod, 3) deploy to test.

This can be implemented using the --push-option option to git push, which can
be picked up by the post-receive hook.

Docs on post-receive: https://www.git-scm.com/docs/githooks#post-receive

Docs on --push-option: https://git-scm.com/docs/git-push

So, IIUC, we can have a post-receive hook that looks like:

```
switch(push-option) {
  case: 'prod'
    run-production-deploy-script
  case: 'test'
    run-test-deploy-script
  default:
    // do nothing
}
```

and we _can_ have both 'Publish live' and 'Publish test' buttons, which will
do one of:

`git push origin master --push-option='prod'`

or

`git push origin master --push-option='test'`

respectively.

### Git Status

Could be that `git status -s` is my friend - just gives a list of files that
are modified but not yet committed.

## Security audit

None of the below can be implemented until we have user auth.

All the below MUST be implemented when we do.

* DONE On load file: double check user actually has access to that file
* DONE On save file: double check user has write access to that file
* DONE IE, in re above, avoid situation where any logged in user can read / write any
file accessible by some other user.
* DONE Also, implement hard ban on symlinks. Refuse to edit any file that is a symlink.

Not sure about the following, tbh.

* Belt and braces: require config files to be 0400 and refuse to read them if
not. This stops a situation where a user finds a way to write to their own config
file and put a bunch of ../../../../ nonsense in there, giving permission to
write arbitrary files on the system.
* Maybe ban paths in config specified filenames entirely and implement path
traversal using some other mechanism in the config file, to avoid possibility of
arbitrary files being readable/writable

## Favicon

From favicon.io, using Marck Script font, fg \#FFA, bg \#222

## Edit page notes

For markdown editing: EasyMDE.

See notes over in vmyers.com TODO.md.

For filetree: Fancytree

* Looks veh fullfeatured. Ok so far.

Options:

* jstree: https://www.jstree.com/

jQuery. Demo not hugely impressive. Lots of plugins, supports dnd. Don't want dnd.

* bstreeview: https://github.com/chniter/bstreeview
* bs5treeview: https://github.com/nhmvienna/bs5treeview

jQuery, integrated with BS4, or BS5 with either the BS5 version or simple edits.
Seems to require font awesome? That's ok, though, as EasyMDE does too, so maybe
I should just use font awesome.
Not clear how to implement actions on clicking a child node though.

* tree.js https://github.com/lunu-bounir/tree.js

Vanilla JS. No documentation, some examples. Not maintained.

* treejs https://github.com/daweilv/treejs

Vanilla JS. Weird checkboxes. No icons.

* zTree http://www.treejs.cn/v3/faq.php#_206

Very full featured. jQuery.

Github https://github.com/zTree/zTree_v3

* Fancytree https://github.com/mar10/fancytree

Very full featured. jQuery. Extremely impressive demo using itself.

* Don't bother option

Or, I could just use vanilla Bootstrap accordions and list groups:

https://getbootstrap.com/docs/5.0/components/accordion/
https://getbootstrap.com/docs/5.0/components/list-group/

For csv:

CSV file handler: https://github.com/mholt/PapaParse
CSV display handler: http://tabulator.info/

(more JS table displays here: https://jspreadsheets.com/)

Steps:
* Integrate EasyMDE into a page
* Integrate a filetree solution into same page (?)
* Add config for test files and some test files
* Have filetree load the test files and display them
* Implement load file
* Implement save file
* Publish button - won't do anything yet b/c no git integration

## User login notes

Just use passport-local-mongoose for this. Perfectly reasonable use case for
the db since we'll be needing to store a bunch of other per-user info.

## Data structure notes

The only thing we really need in the db is the authentication, but! This will
be what we are authenticating /for/, which means that the user schema should
look something like:

username: String   -
email:    String   - Should allow people to login with either username or email
password: String   - (hashed, obvs, we will use passport-local-mongoose)
active:   Boolean  - So we can disable users easily if need be
sites:    Array    - Most users will have only one site, but admin (me) wants
                     them all. And maybe some users will need access to more than
                     one site one day?
role:     String   - probably just user/admin for now; let's have it there so we
                     can avoid mucking with the user DB later too much.

HOWEVER, there is no need to put the actual site configs in the DB (yet), as for
now it will be fine - and, indeed, easier - just to have the sites Array point
to hand-written YAML config files on a per site basis.

IF we ever add stuff like 'add site', 'add/remove page', THEN we might want to
keep those configs in the DB instead and read-write them from there, but doing
so implies an actual admin user and an admin interface. And I don't want to
build that yet, and possibly don't want to build it at all.

UPDATE (after two straight weekends building admin interface): Hah

So, YAML config files it is.

Something like the following for foo.com:

```
---
files:
  pages:
    - 'about.md'
    - 'contact.md'
    - 'index.md'
  data:
    - '/path/to/data.csv'
    - '/path/to/moredata.csv'
  config:
    - '/path/to/nav.yml'
    - 'config.yml'
generator: "poop"
```

Basically we have 'files' as a top level thing and then arbitrary names
containing stuff, including optional paths to the specific file, counted from
the root of the git repo. Filetype is be implied by extension. Initially we're
only going to handle .md files. Next will be .csv files. Later, if we want to
get fancy we can add .yml or .html or whatever, but there is no need for now.
However, lets not make it hard to add. From the outset, unhandled files will
simply give you a 'sorry unimplemented' page rather than an editor. Actually,
a straight-up syntax highlighted text editor might solve a lot of those issues,
but we definitely need something more than that for Markdown, which is our
MAIN DESIGN GOAL at the moment.

Later we will add a 'git' top level item to configure git settings, such as
local or remote repo etc.

There is a 'generator' top level item which gives hints to the app as to how to
process files. Eg Jekyll markdown contains a YAML header which we need to handle
specially. Other generators may have other special requirements. Who knows?


## Scaffolding notes

NB - we appear to have installed Bootstrap 5, which means we didn't really need
jQuery. So, to remove it or not? Let's leave it for now, but maybe lose it later.

* DONE Basic scaffolding
* DONE Basic layout of pages, w/ navbar

## Sass notes

node-sass deprecated, we use dart-sass now.

Steps:

1) `npm uninstall --save-dev node-sass`
2) `npm install --save-dev sass`
3) Change scss target in package.json to `"scss": "sass --watch scss:public/css",`

Now npm audit stops complaining.
