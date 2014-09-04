---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: "https://github.com/cms-sw/cmssw" }
 - { name: Feedback, link: "https://github.com/cms-sw/cmssw/issues/new" }
---

# How to update externals

# Updating externals for which we do not have a github mirror.

This is the old way of maintaining externals. In order to update them 
you need to modify the appropriate spec in
[CMSDIST](https://github.com/cms-sw/cmsdist) changing the line specifying the
source, adding a new patch or modifing the build recipe.

More information can be found at <http://cms-sw.github.io/cmsdist>

# Updating externals which we maintain in a github mirror

For some of the externals we have started to maintain a GitHub mirror in order
to better keep track of the changes we do on them. A notable example of this ir
the root external for which you can find the [CMS mirror
here](https://github.com/cms-sw/root). Similarly you can find the mirror of
many other externals in the [cms-extenals](https://github.com/cms-externals)
organization (root notably missing due to historical reasons).

In the case we have a full mirror of a repository, whenever an update is needed
we update the mirror and then we apply CMS patches on top, using a branch
which is called "cms/<commit-or-tag>".

For example if we get told "Please use commit `<commit-or-tag>` from the
<branch> branch of <external> and apply the patches which we had for `<old-commit-or-tag>`. 
You should do:

    git clone -b <branch> https://github.com/cms-externals/<external> # To get the repository
    git checkout -b cms/<commit-or-tag> <commit-or-tag>  # To create a new branch with the new tag
    git log <old-commit-or-tag>..cms/<old-commit-or-tag> # to see what are the old cms-specific patches
    git cherry-pick <cms-specific-patches> ...           # To apply the patches
    git push origin HEAD:cms/<commit-or-tag>             # To publish the new cms-specific branch

Once you have done this, you should still go to cmsdist and change the relevant
spec file so that the new branch *and* the new commit are used. This is usually
done modifying the lines:

    %define tag <some-commit-id>
    %define branch cms/<branch>

in the spec and doing a PR with the changes to the appropriate cmsdist branch.
