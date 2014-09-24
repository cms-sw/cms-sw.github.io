---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
---

# Managing categories

Package categories are used by an automated bot, [cms-bot][], to notify
coordinators of different areas. These are defined in
[cms-bot/categories.py](https://github.com/cms-sw/cms-bot/blob/master/categories.py).

In particular:

- `CMSSW_L2`: defines a mapping between github users and a given category.
- `CMSSW_CATEGORIES`: defines a mapping between github categories and packages
  associated to it.

In order to add a new package, just update the relevant categories in
`CMSSW_CATEGORIES` and do a pull request.  A package can belong to multiple
categories.

# Managing watchers

While github allows you to be notified for changes to a repository, you might
want to be notified just for an handful of packages. This can be done by adding
yourself as a watcher of a specific packege. This is controlled by the
[watchers.yaml](https://github.com/cms-sw/cms-bot/blob/master/watchers.yaml)
file.  In order to watch a package, add your github username and a list of
package names or a regular expression matching the packages you would like to
watch.

[cms-bot]: http://github.com/cms-sw/cms-bot
