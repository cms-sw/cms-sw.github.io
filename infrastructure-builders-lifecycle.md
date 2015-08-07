---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
---

# Cluster architecture description:

The CMS build infrastructure consists of two kinds of nodes, masters,
responsible for scheduling jobs, and slaves, responsible to execute jobs and
services. They are in general provisioned using [CERN Openstack
Infrastructure](http://openstack.cern.ch) and configured using [CERN Puppet /
Foreman setup](http://cern.ch/config).

Masters belong to the hostgroup `vocmssdt/sdt/mesos/master` while slaves belong
to `vocmssdt/sdt/builder`. The configuration of those hostgroups can be found in
the GIT repository <https://git.cern.ch/web/it-puppet-hostgroup-vocmssdt.git>,
in particular in:

- [/code/manifests/sdt/mesos/master.pp](https://git.cern.ch/web/it-puppet-hostgroup-vocmssdt.git/blob/HEAD:/code/manifests/sdt/mesos/master.pp)  for the master.
- [/code/manifests/sdt/builder.pp](https://git.cern.ch/web/it-puppet-hostgroup-vocmssdt.git/blob/HEAD:/code/manifests/sdt/mesos/master.pp)  for the slaves.

We have in particular three masters, each running on a separate OpenStack
availability zone which work in an High Availability (HA) mode which allows the
ensamble to continue working correctly and scheduling jobs. In particular the
masters run the following services:

- The [**Mesos Master**](http://mesos.apache.org) service: Mesos is used to
  schedule some of the Jenkins jobs automatically on the cluster and to automate
  deployment of some of the services, in particular using the Marathon setup.

- The [**ZooKeeper**](https://zookeeper.apache.org): the backend which keeps
  track of Mesos distributed state, actually providing the HA setup.

- The [**Marathon**](https://mesosphere.github.io/marathon/) service: a simple
  Platform as a Service (PaaS) implemented as a Mesos framework which allows to
  define, launch and monitor long running services on the slaves. It relays on
  Mesos to do the resource management.

# Useful recipes:

### Setting up the OpenStack environment:

First of all make sure you have all the rights to create machines in OpenStack
and to administer them via Puppet. In particular you'll have to have rights for
the "CMS SDT build" OpenStack project. You'll need to go to the CERN OpenStack
portal, select "Current Project > CMS SDT build" in the top bar and then go to
the [Access and
Security](https://openstack.cern.ch/dashboard/project/access_and_security/) tab
and then select again "API access". You can then click "Download OpenStack RC
file" which you'll have to copy in a safe place (say
`~/private/cmssdt-openrc.sh`) on either `lxplus` or `aiadm`. If you do not see
the openstack project or any of the above steps fails, most likely you are
lacking the right permissions and access, in which case, please contact the CMS
VOC (Ivan Glushkov at this point). You'll have to do this step only once.

Now you can log in to `aiadm.cern.ch` and source the OpenStack credentials you just downloaded:

      source ~/private/cmssdt-openrc.sh

you'll be prompted for password which will be put in your shell environment. Make sure you do not cut and paste your environment around.
You can now execute the various OpenStack commands, using the CLI tool called `nova`, while an exhaustive list of all the available options can be optained via `nova help`, for the process of spawning new machines you probably only care about:

- `nova list`: list the machines in the CMS SDT build project.
- `nova image-list`: list of OS images you can use. In
  particular the build nodes should use the latest `SLC6 CERN Server - x86_64`
  ones.
- `nova flavor-list`: list available flavors of virtual machines (i.e. how many
  CPUs, RAM).

Before you can continue to create a slave, make also sure you import the SSH key
required by build machines into your openstack configuration (use the "Access &
Security" tab and use "Import key") and that you call it `cmsbuild`.

### Creating a slave  

Creation of slaves in CERN Foreman setup is described at
<http://cern.ch/config/nodes/createnode.html>. The short recipe for build
machine is:

- Login to `aiadm.cern.ch`.
- Set up your OpenStack environment (once) and source the `~/private/cmssdt-openrc.sh` file, entering the password when prompted.

- To spawn a machine you need to use the `ai-bs-vm` wrapper, which will take
  care of provisioning the machine and putting it in Foreman, so that it will
  receive from it the Puppet configuration:

      MACHINE_NAME=<cmsbuildXX>

      ai-bs-vm -g vocmssdt/sdt/builder \
               -i "SLC6 CERN Server - x86_64 [2015-02-10]" \
               --nova-sshkey cmsbuild \
               --nova-flavor hep2.12 \
               --nova-attach-new-volume vdc=1TB \
               --landb-mainuser cms-service-sdt \
               --landb-responsible cms-service-sdt \
               $MACHINE_NAME

This will spawn a new machine. You can check the boot status either in the
OpenStack GUI or via `nova list`. The `cmsbuild` key used is the ssh key
available from the cmsbuild user AFS account. Of course you should change the
name of the machine (`<cmsbuildXX>` in the example) and use a current image and
flavor. If you have issues about the ssh key, make sure you imported it in your
account (see the Setting up the OpenStack environment) part.

### Deleting a slave

Similarly the documentation to delete a slave is found at:

<http://configdocs.web.cern.ch/configdocs/nodes/deletenode.html>

the recipe for destoying slaves is:

- Login to `aiadm.cern.ch`.
- Setup the environment with `~/private/cmssdt-openrc.sh`
- Delete the machine with `ai-kill-vm <cmsbuildXX>`
- Delete the previously attached volumes.
