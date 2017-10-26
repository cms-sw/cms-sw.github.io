---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
---
# Starting a new release cycle.

In order to start a new release cycle you need to be an administrator of  `cms-sw/cmssw`, `cms-sw/cmsdist` and `cms-sw/cms-bot`

The following needs to happen:

- Run cms-bot/new-release-cycle script to setup new release cycle. This creates new release branch (based on existing development branches), setup new milestone, move all the open PRs for cmssw master branch to new milestone and update cms-bot files (forward_ports_map.py, milestones.py, releases.py, releases.map and config.map).
```
export CYCLE=CMSSW_10_0_X
git clone git@github.com:cms-sw/cms-bot
cd cms-bot
./new-release-cycle --cycle ${CYCLE}
```
- Verify (`git diff`) the changes it made in cms-bot. Disable any IBs for old development release cycle by appending `DISABLED=1;IB_WEB_PAGE=1;` at the end of each IB line in config.map e.g. to disable special ROOT6 IB
```
SCRAM_ARCH=slc6_amd64_gcc630;PKGTOOLS_TAG=V00-31-XX;CMSDIST_TAG=IB/CMSSW_9_4_X/rootgcc6;RELEASE_BRANCH=CMSSW_9_4_ROOT6_X;RELEASE_QUEUE=CMSSW_9_4_ROOT6_X;BUILD_HOUR=23,00;DOCKER_IMG=cmssw/slc6-builder:latest;
```
will become
```
SCRAM_ARCH=slc6_amd64_gcc630;PKGTOOLS_TAG=V00-31-XX;CMSDIST_TAG=IB/CMSSW_9_4_X/rootgcc6;RELEASE_BRANCH=CMSSW_9_4_ROOT6_X;RELEASE_QUEUE=CMSSW_9_4_ROOT6_X;BUILD_HOUR=23,00;DOCKER_IMG=cmssw/slc6-builder:latest;DISABLED=1;IB_WEB_PAGE=1;
```
- update cms-bot/material_budget_ref.py for new release cycle (use existing reference for the new cycle).
- Update cmssw known errors for new release cycle if needed in cms-bot/cmssw_known_errors.py
- Commit and push these changes
```
git commit -a -m "setup new developement cycle ${CYCLE}"
git push origin
```

[CMSDIST]: https://github.com/cms-sw/cmsdist
[PKGTOOLS]: https://github.com/cms-sw/pkgtools
[CMSSW]: https://github.com/cms-sw/cmssw
