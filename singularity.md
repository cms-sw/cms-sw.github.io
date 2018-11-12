# Setting up `SLC6` CMS environment on `Cent OS7`
In order to develop CMSSW for `SLC6`, one can use `singularity` to get `SLC6 CMS` environment. `singularity` is available on `lxplus7` and can be used by any user.
Here is how you can run `singularity` to setup `cms` environment.
```
#login to CentOS7 system with singularity installed e.g. lxplus7 or 
ssh lxplus7
singularity shell -B /cvmfs docker://clelange/slc6-cms:latest
export SCRAM_ARCH=slc6_amd64_gcc700
export HOME=$(eval echo  ~$(whoami))
source /cvmfs/cms.cern.ch/cmsset_default.sh
```
