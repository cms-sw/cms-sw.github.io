---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
redirect_from:
 - /cmssw/tutorial-collaborating-with-peers.html
---

## Tutorial: collaborating with peers.

This tutorial will guide you through the process of collaborating with other
people.

### Before you start.

Please make sure you registered to GitHub and that you have provided them
a ssh public key to access your private repository. For more information see
the [FAQ](faq.html).

### Development workflow

The development model CMS uses is to consider one repository:

https://github.com/cms-sw/cmssw

as the authoritative source of CMSSW sources. All other personal repositories
(aka forks, i.e. copies) are either for:

- Proposing changes to the official repository.
- Share changes between peers.

Proposing changes happens by creating a Pull Request from a given repository to
the official one (also referred as official-cmssw), this is documented in the
[Proposing changes to CMSSW tutorial](tutorial.html).

Sharing changes between peers is done instead by checking out or merging a remote branch in
your local workarea. Such a branch is not necessarily associated with a pull
request nor necessarily coming from the official CMSSW repository, effectively
allowing groups of people to collaborate with each other before a topic is
proposed for official inclusion in CMSSW.

### Developing on top of another topic branch

If your new topic branch requires changes from another topic branch to work (e.g. a pull request that hasn't been merged yet),
you can use `cms-checkout-topic` to recreate the working area used to develop the other topic branch, and then
make your changes on top of it.

Notes and caveats for this approach:
* You need to determine what release or IB was used as the base for the other topic branch using `git log` or the GitHub history view
(or by asking the other developer).
* If you have to rebase your branch, it is important to specify the "old base" of your branch as the first commit before your changes, 
i.e. the other developer's last commit. (This could happen if e.g. the other developer rebases the other branch, or if a conflict arises
once you have submitted the PR for your branch.) See the rebasing tutorial [Resolving conflicts & porting features](tutorial-resolve-conflicts.html)
for more information.

### Developing on top of multiple topic branches

If your new topic branch requires changes from multiple other topic branches to work,
it is easiest to use `git cms-merge-topic` to combine all the other branches in your working area.

However, this should only be done on a temporary basis. If you plan to make a PR, you should eventually
create a "clean" branch that contains just your commits and no uses of `cms-merge-topic`.
You can do this by rebasing or cherry-picking (again, see the rebasing tutorial [Resolving conflicts & porting features](tutorial-resolve-conflicts.html)
for more information.)
