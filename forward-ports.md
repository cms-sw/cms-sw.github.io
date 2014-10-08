---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
---

When some pull request is committed in an old release, this does not get propagated in 
the subsequent one, apart from a few specific cases (e.g. THREADED builds).

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
