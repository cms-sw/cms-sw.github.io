---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: "https://github.com/cms-sw/cmssw" }
 - { name: Feedback, link: "https://github.com/cms-sw/cmssw/issues/new" }
---

# How to Build a CMSSW Release

## Create CMSSW Github Issue:
   
   Create a new cmssw [issue](https://github.com/cms-sw/cmssw/issues/new). Only github users mentioned [here](https://github.com/cms-sw/cms-bot/blob/master/categories.py#L10) can request for a release. The title of the issue should be
 
 ```Build CMSSW_NN_MM_OO<_pre[0-9]+|_[a-zA-Z]*patch[0-9]+><_TYPE>```
 
 where ```<_TYPE>``` and ```<_pre[0-9]+|_[a-zA-Z]*patch[0-9]+>``` are optional e.g. **CMSSW_8_1_0, CMSSW_8_1_0_patch2, CMSSW_9_0_0_pre2, CMSSW_9_0_0_pre2_ROOT6**
 
 Body of the issue may contain extra exformation about the release e.g. following keys are supported
 

    #Override the cmssw branch to use for creating release tag
    RELEASE_QUEUE: CMSSW_NN_MM_X
 
    #Override the Commit on the branch to use to tag the release. It can be commit hash or an existing tag
    TAG_COMMIT: d82023a1d4f3ffd80183cf3f1f37cfe09a99399a


 By default build system uses ```CMSSW_NN_MM<_TYPE>_X``` branch to build the release. You can override it by setting **RELEASE_QUEUE** in the body of the issue. 
 
 By default the build system uses tip of ```CMSSW_NN_MM<_TYPE>_X``` or ```RELEASE_QUEUE``` branch of [cmssw](https://github.com/cms-sw/cmssw) to tag the release. You can override it by setting **TAG_COMMIT** in the body of the issue.
 
 Make sure that [releases config](https://github.com/cms-sw/cms-bot/blob/master/config.map) information file contains at least one line matching  ```RELEASE_QUEUE=CMSSW_NN_MM_X;```
 
 Once issue is created then CMS build bot will acknowledge it.
 
## Start build process:
 
 One of the [release managers](https://github.com/cms-sw/cms-bot/blob/master/categories.py#L10) can comment with ```+1``` on the issue to start the build process.
 
 CMS build bot should then guide you (via comments in the issue) how to proceed with upload and announce the release.

 Old instruction to build release are available [here](http://cms-sw.github.io/build-release-old.html)
