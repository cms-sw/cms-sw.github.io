---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: "https://github.com/cms-sw/cmssw" }
 - { name: Feedback, link: "https://github.com/cms-sw/cmssw/issues/new" }

# How to setup cvmfs to mount the Integration Builds repository

1) Install cvmfs client, details can be found on the second chapter of [cvmfs technical report](http://cernvm.cern.ch/portal/sites/cernvm.cern.ch/files/cvmfstech-2.1-5.pdf)

2) Download the [public key](cms-sw.github.io/data/cms-ib.cern.ch.pub) of the repository and place it under /etc/cvmfs/keys (under linux)

3) Create a configuration file for the repository to be placed in /etc/cvmfs/config.d/cms-ib.cern.ch.local with the following:

```
CVMFS_HTTP_PROXY='<your proxy>'
CVMFS_SERVER_URL='http://sdtcvmfs.cern.ch/cvmfs/cms-ib.cern.ch'
CVMFS_PUBLIC_KEY='/etc/cvmfs/keys/cms-ib.cern.ch.pub'
```
Althought the proxy can be omitted using the option 'DIRECT' we strongly suggest to use one if it is available to reduce the stress on the server.

4) Mount the repository in a folder of your choice:

```
cvmfs2 cms-ib.cern.ch /home/my_cvmfs_mount_point
```
