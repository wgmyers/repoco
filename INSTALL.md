# Installation

This document very not yet done.

## 1. Clone the repoco repo

```
$ cd /somewhere/sensible
$ git clone git@github.com:wgmyers/repoco.git
```

## 2. Ensure you have node and npm installed

I built this on node version 12.22.7, npm 6.14.15.

I /was/ running it on a server using node 15.5.1, npm 7.11.1.

Now that's back to node 14.18.1, npm 6.14.8, for Reasons.

Everything seems ok with these versions (and presumably later?).

Yes, I should probably update some stuff.

## 3. Ensure you have MongoDB installed

We've been using version 4.4.x, so hopefully that will be fine.

On FreeBSD you must edit `/usr/local/etc/mongodb.conf` and add

```
security:
  authorization: enabled
```

*after* adding your admin user. (Otherwise, you can't.)

To add your admin user, invoke the mongo shell and do this:

```
use admin
db.createUser(
  {
    user: "admin",
    pwd: "changeMeToAStrongPassword",
    roles: [ "root" ]
  }
)
```

Then enable authorisation.

## 4. Configure MongoDB

Manually set up the users for the production and optionally test DBs in the
mongo shell like so:

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

## 5. Configure repoco

### 5.1 Settings

Copy `.env.example` to `.env` and fill in suitable values.

If your main repos are still called 'master', set GIT_MAIN to that, otherwise
use 'main', or whatever you use.

In particular, you need to create the `config/sites` directory, if that is where
you are putting things.

Use `config/example/example.com.yml` as a template for your own sites.

Currently, Repoco can only edit .md files in _either_ the root directory of
the git repo, or in a subdirectory of root. If it is a subdirectory, you need
to set `path` in your YAML file. If not, you can leave that out.

__This is a bug and I am fixing it.__

Next, same thing with `.secrets.example` - obviously the DB user and test DB user
should be the same as in last step.

Finally, you need to decide where you are putting your git repos. These must
be work-trees, not bare repos - one option is to have them in a subdirectory
of the repoco clone called `repos` - git will ignore these so you can safely
put them there. Or whereever else you like. Or you may already have them somewhere.

Either way, you need to tell repoco where they are.

### 5.2 Install modules and build

`npm install`

`npm run build`

All the build target does is run sass to create the custom.css and custom.css.map
files in `public/css`. This stops github thinking the project is 80% css.

## Run

`npm run prod` will run the app in production mode.

If you use pm2, you might want something like:

`pm2 start "npm run proc" --name=repoco`

## 6. Configure git

The idea is that repoco works on a set of clones of main repos, and, on
'publish', will both commit and push to them. In each main repo, you then
set up a post-receive hook to run your actual deploy scripts.

That might look something like this:

```
#!/bin/sh

SITE_ROOT=/home/ploni/src/www-dev/my-site

case $GIT_PUSH_OPTION_0 in

  live)
    cd $SITE_ROOT
    ./build/deploy-prod.sh
    ;;
  test)
    cd $SITE_ROOT
    ./build/deploy-test.sh
    ;;
  *)
    echo "Bad push option in post-receive hook"
    ;;

esac
```

In order for this to work, you need to enable push options, by running the
following in the root of each _main_ repo.

`git config receive.advertisePushOptions true`

__NB__

If your build scripts contain git commands, they may fail silently when being
called from a git hook. This is because git hooks set a variable called GIT_DIR
which git prefers over PWD; however, this is probably not being set to the value
you want and stops everything working.

If this is the case, you need to call

`unset GIT_DIR`

prior to any git commands in your build scripts.

See:

https://stackoverflow.com/questions/4043609/getting-fatal-not-a-git-repository-when-using-post-update-hook-to-execut#4100577

## 7. Set up some users and see if it all works

Your default admin user will be auto-created using the details you have chosen.
Now you can log in as that user and add some actual users, give them permissions
to edit some sites, and see if it all works.

## 8. Adding a new site

### 8.1 Set up config file

Create a file called `yoursite.com.yml` in `config/sites`.

Make sure you set `path` properly if need be, and only list .md files in the
files/pages section that you want to be editable under Repoco.

Make sure you set `generator` to 'jekyll' if it is a Jekyll site.

FIXME: What happens if `generator` is not set? I don't know.

Also, be sure to update the URIs for the test and prod versions of the site.

### 8.2 Update your site repo

Do you need to add `unset GIT_DIR` in your build scripts? Probably.

Also, be sure to run `git config receive.advertisePushOptions true` in
your main repo. Otherwise your post-receive hook won't work.

Oh, and you'll need to implement that post-receive hook. See above.

### 8.3 Clone the repo for this site

Are you putting the repos into `repos` or somewhere else? None of my business,
tbh, but wherever it is, you'll need a fresh clone of that site in there.

NB: The name of the config file, sans suffix, needs to be the same as the name
of the repo. So if the site is `yoursite.com` and it lives in a repo called
`yoursite.com`, your config file should be called `yoursite.com.yml`.

### 8.4 Set up users to work on this site

Log into Repoco as admin. Create any new users you need to create. For now you
have to set their passwords yourself, so make a note of those so you can tell
them how to log in, and add them as editors of the newly created Repoco-managed
site.

### 8.5 Check it works

Log in as the special regular user you use to do editing, which you gave permissions
to edit the new site in the previous step. Check you can make changes and publish
them ok. Can you? Good. No? Oh dear. Fix whatever is b0rked.

### 8.6 Tell your new user/s they can go ahead

You'll need to tell them the URI of your Repoco installation and their username
and password. You now have a new user / new users! Hooray!
