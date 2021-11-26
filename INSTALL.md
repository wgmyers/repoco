# Installation

This document very not yet done.

## 1. Clone the repoco repo

$ cd /somewhere/sensible
$ git clone git@github.com:wgmyers/repoco.git

## 2. Ensure you have node and npm installed

FIXME: Versions?

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

Copy .env.example to .env and fill in suitable values.

In particular, you need to create the config/sites directory, if that is where
you are putting things.

Use config/example/example.com.yml as a template for your own sites.

Next, same thing with .secrets.example - obviously the DB user and test DB user
should be the same as in last step.

## Install modules

$ npm install

## Build

FIXME: We don't have a build step, but we should, and it should build the css
so we don't have to have public/css/custom.css in repo. At the same time
we could look not necessarily including the whole kitchen sink in there.

## Run

FIXME: We don't actually have a production target in package.json, but we should.
