# Repoco

A fairly minimalist mildly opinionated headless CMS with local git repo support.

## Why?

There isn't one. I need one.

Is there one? Tell me about it. I'd rather not roll my own, but all I could find
were projects way too over-complex, and often way too expensive for my use-case.

Not only that, but absolutely none of them worked with a local git repo.

## What is your use-case

I maintain a number of small websites for non-technical people, all built with
Jekyll. I want to be able to give these folk limited edit access to some of
the Jekyll source files, so they can make small text changes themselves and
publish them, both to the test and live versions of their site. That's it.

I don't want to have to rebuild the whole site in order to integrate a CMS. I
don't need users to be to able upload anything, redesign things, add pages, remove
sections or anything like that. Also, I don't want to tie myself down to using
Jekyll forever, in case I switch to something else, so I want something only
loosely coupled to the actual web front end.

I just want limited editing of a few files in a git repo, plus hooks to my
custom deployment scripts. For now. Bells and whistles can come later or,
preferably, never.

Also, I am quite happy with keeping my git setup as it is, so I don't want to
have to move the whole lot over to Github, Gitlab, Bitbucket or anywhere else,
nor to have to implement some bug-prone Rube Goldberg-like multi-repo mirroring
contraption.

Finally, I want to self-host the whole thing, and have the project be OSS.

## Surely someone somewhere has already done this

You would have thought so. Not that I could find.

## Why Repoco

Twenty years ago I had the exact same problem, which I ended up solving with
my own Perl-based CMS called Poco. It was terrible, it was clunky, it was a pain
to maintain, but users actually used it, and were able to edit pages on their
own site without too much trouble.

After Poco, I swore I would never make the same mistake again.

And here we are.

## I see what you did there

Thanks.
