# Installation

This document very not yet done.

## 1. Clone the repoco repo

$ cd /somewhere/sensible
$ git clone git@github.com:wgmyers/repoco.git

## 2. Ensure you have node and npm installed

I built this on node version 12.22.7, npm 6.14.15.

I'm running it on a server using node 15.5.1, npm 7.11.1.

Everything seems ok?

## 3. Ensure you have MongoDB installed

We've been using version 4.4.x, so hopefully that will be fine.

On FreeBSD you must edit /usr/local/etc/mongodb.conf and add

security:
  authorization: enabled

*after* adding your admin user. (Otherwise, you can't.)

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

## 4. Configure MongoDB

Manually set up the users for the production and optionally test DBs.

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

Copy .env.example to .env and fill in suitable values.

In particular, you need to create the config/sites directory, if that is where
you are putting things.

Use config/example/example.com.yml as a template for your own sites.

FIXME: Currently, we can only edit .md files in the root directory of the git repo.
This is a bug and I am fixing it.

Next, same thing with .secrets.example - obviously the DB user and test DB user
should be the same as in last step.

Finally, you need to decide where you are putting your git repos. These must
be work-trees, not bare repos - one option is to have them in a subdirectory
of the repoco clone called 'repos' - git will ignore these so you can safely
put them there. Or whereever else you like. Or you may already have them somewhere.

Either way, you need to tell repoco where they are.

### 5.2 Install modules

`npm install`

There is (as yet) no build script. Everything is pre-built. You can run it now.

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

  prod)
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
