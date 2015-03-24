---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
---
# Manual Forward Ports
When some pull request is committed in an old release, this does not get propagated in 
the subsequent one, apart from specific cases (e.g. THREADED builds).

In order to understand what is missing one can use the git log command, where the most
recent release is the beginning of the log and the previous one is the end of the log. E.g.:

    git fetch official-cmssw
    git log --reverse --first-parent --topo-order official-cmssw/CMSSW_7_3_X..official-cmssw/CMSSW_7_2_X

will show the merged pull requests which are part of `CMSSW_7_2_X` but not of
`CMSSW_7_3_X`. In order to merge a few of them, the best strategy is:

0. Move to the most recent branch e.g. `git fetch official-cmssw ; git reset --hard official-cmssw/CMSSW_7_3_X`.
1. Decide from the log which one is the most recent PR we want to merge.
2. Use `git merge <commit>` to merge that pull request and all those preceding it.
3. Push the branch to your repository and do a pull request. E.g. `git push my-cmssw HEAD:forward-port-CMSSW_7_3_X`

Variations for this include using a different merge strategy (e.g. `-X ours`)
when merging so that in case of conflict ours (i.e. the newest branch) side of
the conflict is preferred (you can also use `theirs`).
If you wish to ignore one or more PR, you can use:

    git merge -s ours <commit>

which will discard all the pull request up to `<commit>`.

Notice also that while you can do the merge incrementally, you should
**always** do it in order.

Find below a web based view of what is missing to be forward ported for the
various releases.

- [CMSSW_7_3_X](https://github.com/cms-sw/cmssw/compare/cms-sw:CMSSW_7_3_X...cms-sw:CMSSW_7_2_X)
- [CMSSW_7_2_X](https://github.com/cms-sw/cmssw/compare/cms-sw:CMSSW_7_2_X...cms-sw:CMSSW_7_1_X)
- [CMSSW_7_1_X](https://github.com/cms-sw/cmssw/compare/cms-sw:CMSSW_7_1_X...cms-sw:CMSSW_7_0_X)
- [CMSSW_6_2_SLHC_X](https://github.com/cms-sw/cmssw/compare/cms-sw:CMSSW_6_2_X_SLHC...cms-sw:CMSSW_6_2_X)

# Automatic Forward Ports

The script [auto-update-git-branches](https://github.com/cms-sw/cms-bot/blob/master/auto-update-git-branches) automatically forward ports the changes between some cmssw and cmsdist branches. You can see the script to know which branches are currenly being forward ported automatially. It is run by [update-github-pages](https://cmssdt.cern.ch/jenkins/job/update-github-pages/)

## Preventing a Pull Request for Being Forward Ported

Sometimes a pull request is merged in a branch and should not be merged into others. For example, [#8480](https://github.com/cms-sw/cmssw/pull/8480) was merged in CMSSW_7_5_X, but these changes should not be merged to CMSSW_7_5_ROOT5_X. The next time [update-github-pages](https://cmssdt.cern.ch/jenkins/job/update-github-pages/) runs, it will merge those unwanted changes. 

In order to prevent a pull request for being forward ported into another branch you can do the following: 

1. clone the official cmssw-repository. Add your clone and the repository from which the pr originally came from
<pre>
git clone git@github.com:cms-sw/cmssw.git
git remote add my_clone \<url\>
git remote add pr_repo \<url\>
</pre>
2. checkout the branch that you don't want to receive the changes. Create a new branch from it
<pre>
git checkout -b avoid-merge origin/unwanted_receiving_branch
</pre>
3. merge the unanted branch with -s ours from the repository from wich the pr came from
<pre>
git merge -s ours pr_repo/pr_branch_name
</pre>
4. push the new branch to your repository in order to create a new PR like [#8487](https://github.com/cms-sw/cmssw/pull/8487) from it.
<pre>
git push my_clone HEAD:avoid-merge
</pre>
