---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
---
# Starting a new release cycle.

In order to start a new release cycle you need to be an administrator of both 
`cms-sw/cmssw`, `cms-sw/cmsdist` and `cms-sw/cms-bot`

The following needs to happen:

- Run cms-bot/new-release-cycle script to setup new release cycle. This should create a new brach, setup new milestone, move all the open PRs for cmssw master branch new milestone and update cms-bot files (milestones.py, releases.py and config.map).
```
export CYCLE=CMSSW_9_4_X
git clone git@github.com:cms-sw/cms-bot
d cms-bot
./new-release-cycle --cycle ${CYCLE}
git commit -a -m "setup new developement cycle ${CYCLE}"
git push origin
```
- Setup cmssw and cmsdist branches. Checkif you need to set special cmssw and cmsdist branches for the new release cycle e.g. DEVEL_X and ROOT6_X. You can crete these branches using cms-bot/gh_create_branches.py e.g.
```
export SRC_BR=CMSW_9_3
export DES_BR=CMSSW_9_4
./cms-bot/gh_create_branches.py --cmssw ${SRC_BR}_DEVEL_X=${DES_BR}_DEVEL_X \
    --cmssw ${SRC_BR}_ROOT6_X=${DES_BR}_ROOt6_X \
    --cmsdist IB/${SRC_BR}_X/gcc530=DEVEL_X=IB/${DES_BR}_X/gcc530 \
    --cmsdist IB/${SRC_BR}_X/gcc630=DEVEL_X=IB/${DES_BR}_X/gcc630 \
    --cmsdist IB/${SRC_BR}_X/gcc630next=DEVEL_X=IB/${DES_BR}_X/gcc630next \
    --cmsdist IB/${SRC_BR}_X/gcc700=DEVEL_X=IB/${DES_BR}_X/gcc700 \
    --cmsdist IB/${SRC_BR}_X/root6=DEVEL_X=IB/${DES_BR}_X/root6
```
- Update cms-bot/config.map to setup IBs to be run for new release cycle e.g.
```
export DES_BR=CMSSW_9_4
cat << \EOF >> cms-bot/config.map
SCRAM_ARCH=slc6_amd64_gcc530;PKGTOOLS_TAG=V00-30-XX;CMSDIST_TAG=IB/${DES_BR}_X/gcc530;RELEASE_BRANCH=master;RELEASE_QUEUE=${DES_BR}_X;BUILD_PATCH_RELEASE=1;ADDITIONAL_TESTS=HLT,baseline,static-checks,fwlite,valgrind,igprof,geometry,iwyu,material-budget;PR_TESTS=1;PROD_ARCH=1;ENABLE_DEBUG=1;PRS_TEST_CLANG=1;
SCRAM_ARCH=slc6_amd64_gcc630;PKGTOOLS_TAG=V00-30-XX;CMSDIST_TAG=IB/${DES_BR}_X/gcc630;RELEASE_BRANCH=master;RELEASE_QUEUE=${DES_BR}_X;PR_TESTS=1;
SCRAM_ARCH=slc6_amd64_gcc700;PKGTOOLS_TAG=V00-30-XX;CMSDIST_TAG=IB/${DES_BR}_X/gcc700;RELEASE_BRANCH=${DES_BR}_ROOT6_X;RELEASE_QUEUE=${DES_BR}_ROOT6_X;BUILD_HOUR=23;
SCRAM_ARCH=slc7_ppc64le_gcc700;PKGTOOLS_TAG=V00-30-XX-dev;CMSDIST_TAG=IB/${DES_BR}_X/gcc700;RELEASE_BRANCH=${DES_BR}_ROOT6_X;RELEASE_QUEUE=${DES_BR}_ROOT6_X;BUILD_HOUR=23;
SCRAM_ARCH=slc7_amd64_gcc530;PKGTOOLS_TAG=V00-30-XX;CMSDIST_TAG=IB/${DES_BR}_X/gcc530;RELEASE_BRANCH=master;RELEASE_QUEUE=${DES_BR}_X;DOCKER_IMG=cmssw/slc7-builder:latest;
SCRAM_ARCH=slc6_amd64_gcc530;PKGTOOLS_TAG=V00-30-XX-dev;CMSDIST_TAG=IB/${DES_BR}_X/gcc530;RELEASE_BRANCH=master;RELEASE_QUEUE=${DES_BR}_CLANG_X;BUILD_HOUR=23;
SCRAM_ARCH=slc7_aarch64_gcc530;PKGTOOLS_TAG=V00-30-XX-dev;CMSDIST_TAG=IB/${DES_BR}_X/gcc530;RELEASE_BRANCH=master;RELEASE_QUEUE=${DES_BR}_X;
SCRAM_ARCH=slc7_aarch64_gcc700;PKGTOOLS_TAG=V00-30-XX-dev;CMSDIST_TAG=IB/${DES_BR}_X/gcc700;RELEASE_BRANCH=${DES_BR}_ROOT6_X;RELEASE_QUEUE=${DES_BR}_ROOT6_X;
SCRAM_ARCH=slc6_amd64_gcc530;PKGTOOLS_TAG=V00-30-XX-dev;CMSDIST_TAG=IB/${DES_BR}_X/root6;RELEASE_BRANCH=${DES_BR}_ROOT6_X;RELEASE_QUEUE=${DES_BR}_ROOT6_X;BUILD_HOUR=23;
SCRAM_ARCH=slc6_amd64_gcc630;PKGTOOLS_TAG=V00-30-XX-dev;CMSDIST_TAG=IB/${DES_BR}_X/gcc630next;RELEASE_BRANCH=${DES_BR}_DEVEL_X;RELEASE_QUEUE=${DES_BR}_DEVEL_X;PR_TESTS=1;BUILD_HOUR=23;
SCRAM_ARCH=slc7_amd64_gcc630;PKGTOOLS_TAG=V00-30-XX-dev;CMSDIST_TAG=IB/${DES_BR}_X/gcc630next;RELEASE_BRANCH=${DES_BR}_DEVEL_X;RELEASE_QUEUE=${DES_BR}_DEVEL_X;DOCKER_IMG=cmssw/slc7-builder:latest;BUILD_HOUR=23;
SCRAM_ARCH=slc7_amd64_gcc630;PKGTOOLS_TAG=V00-30-XX;CMSDIST_TAG=IB/${DES_BR}_X/gcc630;RELEASE_BRANCH=master;RELEASE_QUEUE=${DES_BR}_X;DOCKER_IMG=cmssw/slc7-builder:latest;
EOF
```
and make sure to disable previous developement release IBs which are not needed. Just add ```DISABLED=1;IB_WEB_PAGE=1;``` for each of the IB which is not needed. ```DISABLED=1;``` to disable running IBs and ```IB_WEB_PAGE=1;``` to keep showing the disabled IBs on IBs pages.
- Setup automatic forward ports for special branches in cms-bot/forward_ports_map.py e.g.
```
export DES_BR=CMSSW_9_4
cat << \EOF >> cms-bot/forward_ports_map.py
#Added explicitly by Shahzad MUZAFFAR
GIT_REPO_FWPORTS["cmssw"]["${DES_BR}_X"]=[]
GIT_REPO_FWPORTS["cmssw"]["${DES_BR}_X"].append("${DES_BR}_ROOT6_X")
GIT_REPO_FWPORTS["cmssw"]["${DES_BR}_X"].append("${DES_BR}_DEVEL_X")

GIT_REPO_FWPORTS["cmsdist"]["IB/${DES_BR}_X/gcc530"]=[]
GIT_REPO_FWPORTS["cmsdist"]["IB/${DES_BR}_X/gcc530"].append("IB/${DES_BR}_X/root6")
GIT_REPO_FWPORTS["cmsdist"]["IB/${DES_BR}_X/gcc530"].append("IB/${DES_BR}_X/gcc630")
GIT_REPO_FWPORTS["cmsdist"]["IB/${DES_BR}_X/gcc630"]=[]
GIT_REPO_FWPORTS["cmsdist"]["IB/${DES_BR}_X/gcc630"].append("IB/${DES_BR}_X/gcc630next")
GIT_REPO_FWPORTS["cmsdist"]["IB/${DES_BR}_X/gcc630"].append("IB/${DES_BR}_X/gcc700")
EOF
```
- update cms-bot/material_budget_ref.py for new release cycle (use existing reference for the new cycle).
- Set default SCRAM_ARCH for new release cycle in cms-bot/releases.map e.g.
```
export DES_BR=CMSSW_9_4
echo "architecture=slc6_amd64_gcc530;label=${DES_BR}_X;type=Development;state=IB;prodarch=1;" >> cms-bot/releases.map
```
- Update cmssw known errors for new release cycle if needed in cms-bot/cmssw_known_errors.py
- Commit and push these changes
```
export DES_BR=CMSSW_9_4
cd cms-bot
git commit -a -m "IB setup for new release cycle $DES_BR"
git push origin 
```
- Force start an IB for new release cycle for prodduction architecture in cms jenkins https://cmssdt.cern.ch/jenkins/job/tag-all-ibs/build?delay=0sec . Set the correct job parameters e.g.
```
RELEASE_FILTER=CMSSW_9_4_X
ARCHITECTURE_FILTER=slc6_amd64_gcc530
```

[CMSDIST]: https://github.com/cms-sw/cmsdist
[PKGTOOLS]: https://github.com/cms-sw/pkgtools
[CMSSW]: https://github.com/cms-sw/cmssw
