# Using singularity to develop CMSSW on other operating systems

## Setting up SLC5 or SLC6 CMS environment on CentOS7

In order to develop CMSSW on `SLC5` or `SLC6`, one can use [singularity](https://www.sylabs.io/docs/) to get the corresponding `SLC5/6 CMS` environment. `singularity` is available on `lxplus6` and `lxplus7`, and can be used by any user.
Here is how you can run `singularity` to set up `CMS` environment.

For `SLC6`:

```shell
# log in to CentOS7 system with singularity installed e.g. lxplus7
ssh lxplus7
export SINGULARITY_CACHEDIR="/tmp/$(whoami)/singularity"
singularity shell -B /afs -B /eos -B /cvmfs docker://cmssw/slc6:latest
export SCRAM_ARCH=slc6_amd64_gcc700
source /cvmfs/cms.cern.ch/cmsset_default.sh
```

For `SLC5`:

```shell
# log in to CentOS7 system with singularity installed e.g. lxplus7
ssh lxplus7
export SINGULARITY_CACHEDIR="/tmp/$(whoami)/singularity"
singularity shell -B /afs -B /eos -B /cvmfs docker://clelange/slc5-cms:latest
export SCRAM_ARCH=slc5_amd64_gcc434
source /cvmfs/cms.cern.ch/cmsset_default.sh
```

## Setting up CentOS7 CMS environment on SLC6

```shell
# log in to SLC6 system with singularity installed e.g. lxplus6 or cmsdevXX
ssh cmsdev15
export SINGULARITY_CACHEDIR="/tmp/$(whoami)/singularity"
singularity shell -B /afs -B /eos -B /cvmfs docker://cmssw/cc7:latest
export SCRAM_ARCH=slc7_amd64_gcc700
source /cvmfs/cms.cern.ch/cmsset_default.sh
```
