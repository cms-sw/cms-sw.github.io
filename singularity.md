# Using singularity to develop/run CMSSW

We now distribute `cmssw-env, cmssw-cc{6,7,8}` (available under `/cvmfs/cms.cern.ch/common`) helper scripts to setup cms env. The singularity images used by these scripts are available under `/cvmfs/unpacked.cern.ch/registry.hub.docker.com/cmssw` e.g. 
   - `/cvmfs/unpacked.cern.ch/registry.hub.docker.com/cmssw/cc8:amd64`
   - `/cvmfs/unpacked.cern.ch/registry.hub.docker.com/cmssw/cc7:amd64`
   - `/cvmfs/unpacked.cern.ch/registry.hub.docker.com/cmssw/slc6:amd64`

## Setting up SLC5/SLC6/SLC7/CentOS8 CMS environment.

On lxplus, run `cmssw-env` command to setup up the env e.g.

- **To use SLC 5 environment**:

```
cmssw-env --cmsos slc5
Singularity> cat /etc/redhat-release 
Scientific Linux CERN SLC release 5.11 (Boron)
Singularity> exit
```
OR
```
cmssw-env --cmsos slc5 --command-to-run cat /etc/redhat-release
Scientific Linux CERN SLC release 5.11 (Boron)
```

- **To use SLC6/CentOS6 environment**:

```
cmssw-cc6
Singularity> cat /etc/redhat-release 
CentOS release 6.10 (Final)
Singularity> exit
```
OR
```
cmssw-cc6 --command-to-run cat /etc/redhat-release
CentOS release 6.10 (Final)
```

- **To use SLC7/CentOS7 environment**:

```
cmssw-cc7
Singularity> cat /etc/redhat-release 
CentOS Linux release 7.8.2003 (Core)
Singularity> exit
```
OR
```
cmssw-cc7 --command-to-run cat /etc/redhat-release
CentOS Linux release 7.8.2003 (Core)
```

- **To use CentOS8 environment**: CentOS8 environment can only be set from SLC7/CentOS7 host (e.g. lxplus, lxplsu7)

```
cmssw-cc8
Singularity> cat /etc/redhat-release
CentOS Linux release 8.2.2004 (Core) 
Singularity> exit
```
OR
```
cmssw-cc8 --command-to-run cat /etc/redhat-release
CentOS Linux release 8.2.2004 (Core) 
```
