# TODO

1. Basic node/express scaffolding
2. Basic data structure outline
3. Edit page integrating file tree and MD editor for markdown
4. User login
5. Git integration
6. Test suite
7. Deploy!

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
* Basic update to init doc - routes/, bin/www, test scaffolding etc.
