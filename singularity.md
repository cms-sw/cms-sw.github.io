# Setting up SLC6 CMS environment on CentOS7
In order to develop CMSSW for `SLC6`, one can use `singularity` to get `SLC6 CMS` environment. `singularity` is available on `lxplus7` and can be used by any user.
Here is how you can run `singularity` to setup `cms` environment.
```
#login to CentOS7 system with singularity installed e.g. lxplus7 or 
ssh lxplus7
singularity shell -B /afs -B /eos -B /cvmfs docker://cmssw/slc6-builder:latest
export SCRAM_ARCH=slc6_amd64_gcc700
source /cvmfs/cms.cern.ch/cmsset_default.sh
```

# Setting up CentOS7 CMS environment on SLC6
```
#login to SLC6 system with singularity installed e.g. lxplus6 or cmsdevXX
ssh cmsdev15
singularity shell -B /afs -B /cvmfs docker://cmssw/slc7-builder:latest
export SCRAM_ARCH=slc7_amd64_gcc700
source /cvmfs/cms.cern.ch/cmsset_default.sh
```
