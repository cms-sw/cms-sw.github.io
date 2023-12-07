# Using singularity/apptainer to develop/run CMSSW

CMS now distribute `cmssw-el{5,6,7,8,9}` (available under `/cvmfs/cms.cern.ch/common`) helper scripts to setup cms OS env. The `singularity/apptainer` unpacked images used by these scripts are available under `/cvmfs/unpacked.cern.ch/registry.hub.docker.com/` e.g. `cmssw/elN:$(uname -m)`. List of available images is
   - `x86_64`
     - `cmssw/el9:x86_64`
     - `cmssw/el8:x86_64`
     - `cmssw/el7:x86_64`
     - `cmssw/el6:x86_64`
     - `cmssw/el5:x86_64`
   - `aarch64`
     - `cmssw/el9:aarch64`
     - `cmssw/el8:aarch64`
     - `cmssw/el7:aarch64`
   - `ppc64le`
     - `cmssw/el8:ppc64le`
     - `cmssw/el7:ppc64le`

## Setting up SLC5/SLC6/SLC7/EL8/EL9 CMS environment.

On lxplus, run `cmssw-elN` command to setup up the env e.g.

- **To use SLC 5 environment**:

```
lxplus> cmssw-el5
Singularity> cat /etc/redhat-release 
Scientific Linux CERN SLC release 5.11 (Boron)
Singularity> exit
lxplus>
```
or, to run a single command (in this example `cat /etc/redhat-release` to show the OS version), do
```
lxplus> cmssw-el5 -- cat /etc/redhat-release
Scientific Linux CERN SLC release 5.11 (Boron)
```

- **To use SLC6/CentOS6 environment**:

```
lxplus> cmssw-el6
Singularity> cat /etc/redhat-release 
CentOS release 6.10 (Final)
Singularity> exit
lxplus>
```
or, to run a single command (in this example `cat /etc/redhat-release` to show the OS version), do
```
lxplus> cmssw-el6 -- cat /etc/redhat-release
CentOS release 6.10 (Final)
```

- **To use SLC7/CentOS7 environment**:

```
lxplus> cmssw-el7
Singularity> cat /etc/redhat-release 
CentOS Linux release 7.8.2003 (Core)
Singularity> exit
lxplus>
```
or, to run a single command (in this example `cat /etc/redhat-release` to show the OS version), do
```
lxplus> cmssw-el7 -- cat /etc/redhat-release
CentOS Linux release 7.8.2003 (Core)
```

- **To use EL8/9 environment**:

```
lxplus> cmssw-el8 # OR cmssw-el9
Singularity> cat /etc/redhat-release
AlmaLinux release 8.5 (Arctic Sphynx)
Singularity> exit
lxplus>
```
or, to run a single command (in this example `cat /etc/redhat-release` to show the OS version), do
```
lxplus> cmssw-el9 -- cat /etc/redhat-release
AlmaLinux release 9.0 Beta (Emerald Puma)
```
