---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
---

# Use CMSSW via Docker

Docker is a an OpenSource framework for developing, distributing and deploying
so called Containers, middle ground between virtual machines and process.

CMSSW is experimentally available as a docker container and these instructions
are meant to guide you to be able to install run and it using docker. They are
not meant to be a full blown docker guide for which we reccomend looking at the
[official documentation on the docker.io web site](https://docker.io).

# Installing Docker

Please make sure you have docker installed on your machine, either via:

    yum install docker-io

if you use slcX or by following the instructions for your platform on:

http://docs.docker.com/installation


# Running CMSSW docker image

The docker image for CMSSW provides you a shell from where you can install CMS
releases and setup scram area. Using it is as simple as:

    docker run cmsdocker.cern.ch/builder-slc6_amd64_gcc481

this will present you a bash prompt from which you can install CMSSW via:

    apt-get install <release>

e.g.:

    apt-get install cms+cmssw+CMSSW_7_2_0_pre5

and once this is done you can setup the workarea as usual, e.g.:

    scram project CMSSW_7_2_0_pre5

notice that for the moment this only works at CERN.
