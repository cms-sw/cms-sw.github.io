---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
---

# Foreword about Docker and CMSSW

Docker is a an OpenSource framework for developing, distributing and deploying
so called Containers, middle ground between virtual machines and process.

It allows processes to be running on the same kernel as system processes, yet it
uses separate runtime (include basic things like libc). It basically allows you
to run centos on ubuntu or (via Virtual Box) on your Mac and Windows installation.

This pages show how to take advantage of docker sandboxing capabilities to do a
number of CMSSW related tasks, including installation and testing externals.

These instructions are not meant to be a full blown docker guide for which we
recommend looking at the [official documentation on the docker.io web site](https://docker.io).


# Before you start: installing Docker

Please make sure you have docker installed on your machine, either via:

    yum install docker-io

if you use slcX or by following the instructions for your platform on:

<http://docs.docker.com/installation>

In particular mac and windows users should probably look into:

<http://boot2docker.io>

for a user mode docker installation (relying on VirtualBox). 

Notice that if you want to use CMSSW, you should pass `-s 30000 -m 4096` to
your `boot2docker init` command or add:

    DiskSize = 30000
    Memory = 4096

in `~/.boot2docker/profile`.

On the other hand notice that linux installation will require root access to the
box or at least to be part of the `docker` UNIX group.

# Working with docker

## Running CMSSW docker image

The docker image for CMSSW provides you a shell from where you can install CMS
releases and setup scram area. The only limitation is that currently docker has
an image size limited to 10GB and there is no simple way to change it from the
command line. In order to overcome this you'll have to create a temporary
directory on your host machine where the software will be effectively installed.

    mkdir /tmp/$USER/slc6-docker-installation

Done this you can use cms docker image by doing:

    docker run -v /tmp/$USER/slc6-docker-installation:/opt/cms -it cmsdocker.cern.ch/builder-slc6_amd64_gcc481


notice you might want to use additional `-v <host-directory>:<data-directory>`
to have persistent storage of datafiles you might produce.

The above mentioned command will present you a bash prompt from which you can
install CMSSW via:

    apt-get install <release>

e.g.:

    apt-get install cms+cmssw+CMSSW_7_2_0_pre5

and once this is done you can setup the workarea as usual, e.g.:

    scram project CMSSW_7_2_0_pre5

notice that for the moment this only works at CERN and for the moment only
`slc6_amd64_gcc481` is available out of the box.

For more information you might want to dig into the
[cms-docker](https://github.com/cms-sw/cms-docker) in GitHub.

## Testing externals changes via docker

It's now possible to use docker as a sandbox to test externals changes (e.g. a pull
request made to cms-sw/root or cms-externals/xrootd).

This works only for packages which have a Github mirror in cms-externals (or
similar) and which have a spec file which uses it as **unique** source url. This is
the case for things like root, xrootd but also others. Basically what is needed is
to have:

    %define tag <some-git-hash>
    %define branch <some-git-branch>

at the top of the specfile to specify which commit to pick.

Once you have a pull request for an external, say `cms-externals/xrootd#1` you
can then build it by doing:

    docker pull cms-sw/slc6-externals
    docker run -it -e SCRAM_ARCH=<architecture> \
                   -e RELEASE_QUEUE=<release-queue> \
                   -e PR=<pr-id> \
                   -e JOBS=<n> cms-sw/slc6-externals

Where:

- `<architecture>` is the architecture you want to test.
- `<release-queue>` is the release for which the given external needs to be built.
- `<pr-id>` is the github-encoded pull request ID,
  <organization>/<repository>#<pr>, e.g. `cms-externals/xrootd#1`.
- <n> is the number of parallel compilation processes you want to use.

You can also specify `-e INTERACTIVE=1` if you want docker to simply leave you
in a bash prompt before starting to build, so that you can check actual changes
to cmsdist and the package being tested.
