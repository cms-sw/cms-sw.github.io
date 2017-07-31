---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
---

# Cluster architecture description:

The CMS build infrastructure consists of nodes,
responsible for scheduling jobs, and slaves, responsible to execute jobs and
services. They are in general provisioned using [CERN Openstack
Infrastructure](http://openstack.cern.ch) and configured using [CERN Puppet /
Foreman setup](http://cern.ch/config).

The build slave nodes belong to `vocmssdt/sdt/builder`. The configuration of those 
hostgroups can be found in the GIT repository <https://git.cern.ch/web/it-puppet-hostgroup-vocmssdt.git>,
in particular in: [/code/manifests/sdt/builder.pp].

# Useful recipes:

### Setting up the OpenStack environment:

First of all make sure you have all the rights to create machines in OpenStack
and to administer them via Puppet. In particular you'll have to have rights for
the "CMS SDT build" OpenStack project. 

The following E-groups membership is required for creating puppetized openstack VMs:

-ai-admins ( to log into aiadm servers )

-cms-git-vocmssdt-admins

After the user/account is enrolled/added in the above e-groups , the account must login
once to CERN foreman web page ( othervise it will have problems registering the vm with foreman).

You'll need to go to the CERN OpenStack
portal, select "Current Project > CMS SDT build" in the top bar and then go to
the [Access and
Security](https://openstack.cern.ch/dashboard/project/access_and_security/) tab
and then select again "API access". You can then click "Download OpenStack RC
file" which you'll have to copy in a safe place (say
`~/private/cmssdt-openrc.sh`) on either `lxplus` or `aiadm`. You'll have to do this step only once.

Before you can continue to create a slave, make also sure you import the SSH key
required by build machines into your openstack configuration (use the "Access &
Security" tab and use "Import key") and that you call it `cmsbuild`.

Public Key:

`ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAzHKZxVdp5tF54BJsEOgkQ6rPbhz2w4RznhPlqIM/kmZCL+HN51ofvQPgRWya9coDuuCy2eH5+yJvAZiKRqUlm2QcdUOUmCFYqQKE8WFQVCTGMyMByOHtkf3b+2LtrktIiPp01ElyqQjvoIE++bAmnwKuf3aaK70nmWhrIAQ6BrNfC0vxnx6OOwQcNIyqNHMmi5i49oEUYnwijqm24kngy/reY+ktG3+8fvuISzDru0RKO9pyrtrNg0O772kHY3/MB7GdIgwnJ/bkAvBLa7LEQS9D0EO9TLeJWy6+0IyP5lO0D0Ovillk+0RsWuj4cS7xNnE+xhe+aohuvCP0cwhYwQ== cmsbuild@lxbuild167.cern.ch`

### Creating an Instance  

Creation of instances in CERN Foreman setup is described at
<http://cern.ch/config/nodes/createnode.html>. 

After the above steps are done , there are two ways to create puppetzied openstack virtual machines.

Method01:

- Login to `aiadm.cern.ch`.
- Set up your OpenStack environment (once) and source the `~/private/cmssdt-openrc.sh` file, entering the password when prompted.

- To spawn a machine you need to use the `ai-bs-vm` wrapper, which will take
  care of provisioning the machine and putting it in Foreman, so that it will
  receive from it the Puppet configuration:

      MACHINE_NAME=<cmsbuildXX>

      ai-bs-vm -g vocmssdt/sdt/builder \
               --foreman-environment cmssdt_test \ 
               -i "SLC6 CERN Server - x86_64 [2015-02-10]" \
               --nova-sshkey cmsbuild \
               --nova-flavor hep2.12 \
               --nova-attach-new-volume vdc=1TB \
               --landb-mainuser cms-service-sdt \
               --landb-responsible cms-service-sdt \
               $MACHINE_NAME
        
Method02:

- Open the cmssdt home page:  <https://cmssdt.cern.ch/SDT/>
- Click on the Jenkins project
- Once logged in to Jenkins , there is a job called create-openstack-vms, that creates puppetized VMs in openstack 
- Click on the Job name and then click on the Build with parameters
- Provide the parameters such as image , flavor , volume size etc , and run the job.
- You can monitor the progress either in openstack UI or openstack command line: openstack server show <machine_name>


The `cmsbuild` key used is the ssh key available from the cmsbuild user AFS account. Of course you should change the
name of the machine (`<cmsbuildXX>` in the example) and use a current image and
flavor. If you have issues about the ssh key, make sure you imported it in your
account (see the Setting up the OpenStack environment) part. Fore more options you can use ai-bs-vm --help.

### Deleting an Instance

Similarly the documentation to delete an instance is found at:

<http://configdocs.web.cern.ch/configdocs/nodes/deletenode.html>

the recipe for destoying slaves is:

- Login to `aiadm.cern.ch`.
- Setup the environment with `~/private/cmssdt-openrc.sh`
- Delete the machine with `ai-kill-vm <cmsbuildXX>`
- Delete the previously attached volumes.
