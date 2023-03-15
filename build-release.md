---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: "https://github.com/cms-sw/cmssw" }
 - { name: Feedback, link: "https://github.com/cms-sw/cmssw/issues/new" }
---

# How to Build a CMSSW Release

## Create CMSSW Github Issue:
   
   Create a new cmssw [issue](https://github.com/cms-sw/cmssw/issues/new). Only github users mentioned [here](https://github.com/cms-sw/cms-bot/blob/master/categories.py#L18) can request for a release. The title of the issue should be
 
 ```Build CMSSW_NN_MM_OO<_pre[0-9]+|_[a-zA-Z]*patch[0-9]+><_TYPE>```
 
 where ```<_TYPE>``` and ```<_pre[0-9]+|_[a-zA-Z]*patch[0-9]+>``` are optional e.g. **CMSSW_8_1_0, CMSSW_8_1_0_patch2, CMSSW_9_0_0_pre2, CMSSW_9_0_0_pre2_ROOT6**
 
 Body of the issue may contain extra exformation about the release e.g. following keys are supported
 

    #RELEASE_QUEUE: value
    #  This is used to find the matching configuration (cmsdist, pkgtools, archs etc.) from
    #  cms-bot/config.map.
    #  By default RELEASE_QUEUE is obtained from the release name in the title of the github
    #  release build issue but one can override it using RELEASE_QUEUE: value
    RELEASE_QUEUE: CMSSW_13_1_X
    
    #CMSSW_COMMIT |  TAG_COMMIT: cmssw tag|commit|branch
    #  By default bot tags the head of cmssw RELEASE_BRANCH found in cms-bot/config.map.
    #  If you want to build a release basd on different branch/tag then use CMSSW_COMMIT or TAG_COMMIT
    CMSSW_COMMIT: CMSSW_13_1_0_pre2
    
    #CMSDIST_COMMIT: cmsdist tag|commit|branch
    #  By default bot uses the head of cmsdist CMSDIST_TAG branch for externals.
    #  If you want to build a release based on a specific branch/tag then use CMSDIST_COMMIT
    #  Note that if you use a cmsdist tag then you might not be able to built the cmssw release
    #  for all archirectures e.g. a cmsdist tag for gcc11 might not be able to build cmssw for gcc12.
    CMSDIST_COMMIT: REL/CMSSW_13_1_0_pre1/el8_amd64_gcc11
    #OR
    CMSDIST_COMMIT: IB/CMSSW_13_1_X/special_branch
    
    #ARCHITECTURE: arch1[,arch2[,...]]
    #  By default bot builds the release for all the archirtectures it found in cms-bot/config.map for
    #  the selected RELEASE_QUEUE. If you want to build a release for only selected archs then use
    #  ARCHITECTURE. Note that archs should be a valid architecture for the RELEASE_QUEUE. 
    #  In case you have used CMSDIST_COMMIT: commit|tag then you should only provide a arch value otherwise
    #  release build process might fail.
    ARCHITECTURE: el8_amd64_gcc11, el8_aarch64_gcc11
    
    #PRODUCTION_ARCHITECTURE: value
    #  By default bot gets the production archirecture of the RELEASE_QUEUE from cms-bot/config.map. But
    #  If you want to declare a different arch as production then use PRODUCTION_ARCHITECTURE. e.g. for 
    #  for 9.4.X the PR_TESTS=1 is set to slc6 but sometime production needs a slc7 to be declare as production
    #  arch. In that case you can set PRODUCTION_ARCHITECTURE to one of the valid arch for RELEASE_QUEUE
    PRODUCTION_ARCHITECTURE: slc7_amd64_gcc630

 Make sure that [releases config](https://github.com/cms-sw/cms-bot/blob/master/config.map) information file contains at least one line matching  ```RELEASE_QUEUE=CMSSW_NN_MM_X;```
 
 Once issue is created then CMS build bot will acknowledge it.
 
## Start build process:
 
 One of the [release managers](https://github.com/cms-sw/cms-bot/blob/master/categories.py#L18) can comment with ```+1``` on the issue to start the build process.
 
 CMS build bot should then guide you (via comments in the issue) how to proceed with upload and announce the release.

 Old instruction to build release are available [here](http://cms-sw.github.io/build-release-old.html)
