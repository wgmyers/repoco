# TODO

1. DONE Basic node/express scaffolding
2. DONE Basic data structure outline
3. Edit page integrating file tree and MD editor for markdown w/ load/save file
4. Code tidy - .env, bin/www, routes/ logging etc
5. Git integration
6. User login
7. Test suite
8. Deploy!

## TASKS

### DOING

* Embed filetree on UI LHS
* Load filetree content from config
* Clicking on file in filetree loads it in editor
* Mark edited files
* Implement save file button

### DONE

* Split edit UI into two columns with space for filetree
* Basic embed of MD editor
* Research filetree / MD editor / CSV editor / git components
* Devise data structure
* Set up node/express scaffolding

# NOTES

## Edit page notes

For markdown editing: EasyMDE.

See notes over in vmyers.com TODO.md.

For filetree: TBD

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

## Git integration notes

We should ensure this is modular, with an abstraction layer over a specific
git-local library, so support for github etc can be easily added later on.

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
```

Basically we have 'files' as a top level thing (why?) and then arbitrary names
containing stuff, including optional paths to the specific file, counted from
the root of the git repo. Filetype is be implied by extension. Initially we're
only going to handle .md files. Next will be .csv files. Later, if we want to
get fancy we can add .yml or .html or whatever, but there is no need for now.
However, lets not make it hard to add. From the outset, unhandled files will
simply give you a 'sorry unimplemented' page rather than an editor. Actually,
a straight-up syntax highlighted text editor might solve a lot of those issues,
but we definitely need something more than that for Markdown, which is our
MAIN DESIGN GOAL at the moment.

Please don't over-engineer this.


## Scaffolding notes

NB - we appear to have installed Bootstrap 5, which means we didn't really need
jQuery. So, to remove it or not? Let's leave it for now, but maybe lose it later.

* DONE Basic scaffolding
* DONE Basic layout of pages, w/ navbar
