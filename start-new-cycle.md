---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
---
# Starting a new release cycle.

In order to start a new release cycle you need to be an administrator of both 
`cms-sw/cmssw`, `cms-sw/cmsdist` and have write privileges to jenkins (to setup IBs).

The following needs to happen:

- Create a new `CMSSW_X_Y_Z` branch in cms-sw/cmssw using the parent release
  series as a starting point. This is done by going to the [main github page](https://github.com/cms-sw/cmssw)
  and clicking on the branch combo box.
- Create a new `IB/CMSSW_X_Y_Z/stable` branch in [CMSDIST](https://github.com/cms-sw/cmsdist).
- [Create a new milestone for the new release
  cycle.](https://github.com/cms-sw/cmssw/milestones/new) note down the
  milestone number.
- Modify
  [cms-bot/releases.py](https://github.com/cms-sw/cms-bot/edit/master/releases.py)
  and add the appropriate entry in `RELEASE_BRANCH_MILESTONE` and `RELEASE_MANAGERS` for the new queue.


This is enough to setup releases. In order to have IBs you also need to.

- [Edit config.map and add the appropriate line for a new
  IB](https://github.com/cms-sw/cmsdist/edit/IB/CMSSW_7_0_X/stable/config.map).
  The options which need to be provided are:
  - `SCRAM_ARCH`: the architecture for the given IB.
  - `PKGTOOLS_TAG`: the [PKGTOOLS][] branch to be used.
  - `CMSDIST_TAG`: the [CMSDIST][] branch to be used.
  - `RELEASE_QUEUE`: the [CMSSW][] branch to be used.

- Create a new jenkins rule to build the IB.

[CMSDIST]: https://github.com/cms-sw/cmsdist
[PKGTOOLS]: https://github.com/cms-sw/pkgtools
[CMSSW]: https://github.com/cms-sw/cmssw
