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
  [cms-bot/releases.map](https://github.com/cms-sw/cms-bot/edit/master/releases.map)
  and add the production architecture entry for the new release cycle


This is enough to setup releases. In order to have IBs you also need to.

- [Edit config.map and add the appropriate line for a new
  IB](https://github.com/cms-sw/cmsdist/edit/IB/CMSSW_7_0_X/stable/config.map).
  The options which need to be provided are:
  - `SCRAM_ARCH`: the architecture for the given IB.
  - `PKGTOOLS_TAG`: the [PKGTOOLS][] branch to be used.
  - `CMSDIST_TAG`: the [CMSDIST][] branch to be used.
  - `RELEASE_QUEUE`: the [CMSSW][] branch to be used.
  
- Create a new jenkins rule to build the IB.
  - In Jenkins, click on "New Item", a form to create a new jenkins item will appear.
  - On "Item name" write ib-`RELEASE_QUEUE`-`ARCHITECTURE`, select the option "Copy existing Item" and write the name of     the rule that was used to build the previous IB, its name should be something like ib-`PREVIOUS_RELEASE_QUEUE`-`ARCHITECTURE` , click on "OK"
  - Check that the parameters are correct, and then click on save
  - Do this for each architecture for which you want to create the IB.

- Create a new jenkins rule to validate the IB.
  - Follow the same procedure to create the build rule. In this case the new name should be validation-`RELEASE_QUEUE`-`ARCHITECTURE`
  - Do this for each architecture for which you want to create the IB.
- Remember to make sure that ib-`RELEASE_QUEUE`-`ARCHITECTURE` triggers validation-`RELEASE_QUEUE`-`ARCHITECTURE` after finishing.
- Add the new ib to the rule schedule-single-ibs
  - you can do this by clicking on "configure" in the jenkins rule page.
  - this also needs to be done for each architecture for which you want to create the IB.
- Add the new cmssw branch ( Release queue ) to the default parameter RELEASE_QUEUES in the Tag Daily IBs job.

[CMSDIST]: https://github.com/cms-sw/cmsdist
[PKGTOOLS]: https://github.com/cms-sw/pkgtools
[CMSSW]: https://github.com/cms-sw/cmssw
