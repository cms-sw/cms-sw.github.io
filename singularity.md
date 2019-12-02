# Using singularity to develop CMSSW on other operating systems

We now distribute `cmssw-*` (available under `/cvmfs/cms.cern.ch/common`) helper script to setup cms env

## Setting up SLC5/SLC6/SLC7/CentOS8 CMS environment.

On lxplus, run `cmssw-*` commands to setup up the env e.g.

- For `SLC 5`:

```
cmssw-slc5
OR
cmssw-slc5 --command-to-run <command-to-run-under-slc5>
```

- For `SLC6`:

```
cmssw-slc6
OR
cmssw-slc6 --command-to-run <command-to-run-under-slc6>
```

- For `SLC7/CentOS7`:

```
cmssw-cc7
OR
cmssw-cc7 --command-to-run <command-to-run-under-cc7>
```

- For `CentOS 8`: CentOS8 environment can only be set from SLC7/CentOS7 host (e.g. lxplus, lxplsu7)

```
cmssw-cc8
OR
cmssw-cc8 --command-to-run <command-to-run-under-CentOs8>
```
