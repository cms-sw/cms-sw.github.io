---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
---

## Bootstraping new architecture
- First select the [cmsdist](https://github.com/cms-sw/cmsdist) and [pkgtools](https://github.com/cms-sw/pkgtools) branches to use for building the bootstrap driver.
- Make sure that cmsdist/bootstrap-driver.spec has proper `<Os>_<ARCH>_platformSeeds` and `<Os>_<ARCH>_packagesWithProvides` set. 
- For bootstrap always build with `runpath` enabled and for this use pkgtools tag `V00-34-XX` branch
- Use special docker container e.g. `cmssw/<OS>:<ARCH>-bootstrap` for build new bootstrap. If you have to rebuild botstrap for an existing architecture then you can use normal `cmssw/<OS>:<ARCH>` container.

Below are instruction on how to bootstrap for e.g. slc7_aarch64_gcc11
- Login to aarch64 node ( make sure node has access to cvmfs and singularity)
- create a build directory and checkout cmsdist/pkgtools
```
cd /build/`whoami`
mkdir bootstrap-aarch61-gcc11
cd bootstrap-aarch61-gcc11
git clone git@github.com:cms-sw/cmsdist -b IB/CMSSW_12_1_X/gcc11
git clone git@github.com:cms-sw/pkgtools -b V00-34-XX
#edit cmsdist/bootstrap-driver.spec if needed
```
- Start singularity container
```
/cvmfs/cms.cern.ch/common/cmssw-env --cmsos cc7:aarch64-bootstrap
```
- Build the bootstrap
```
ARCH=slc7_aarch64_gcc11
./pkgtools/cmsBuild -a ${ARCH} -i gcc11 -j 20 --no-bootstrap build  bootstrap-driver cms-common
```
- Upload the newly build driver to a temp repo
```
./pkgtools/cmsBuild -a ${ARCH} -i gcc11 -j 20 --no-bootstrap bootstrap_${ARCH} --sync-back upload bootstrap-driver cms-common
```

## Testing the newly uploaded bootstrap
- Login to aarch64 node ( make sure node has access to cvmfs and singularity)
- create a build directory
```
cd /build/`whoami`
mkdir test-aarch61-gcc11
cd test-aarch61-gcc11
```
- Download `bootstrap.sh` and run it
```
wget http://cmsrep.cern.ch/cmssw/bootstrap.sh
ARCH=slc7_aarch64_gcc11
bash -ex ./bootstrap.sh -r bootstrap_${ARCH} -a ${ARCH} setup
```

 
