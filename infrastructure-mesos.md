---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
---

### Attaching attributes to a given machine.

Attaching attributes to Mesos slaves can be done by adding a file named as the
attribute in `/etc/mesos-slave/attributes` containing the value of the attribute. E.g.:

    echo true > /etc/mesos-slave/attributes/my-attribute

and restarting the Mesos slave will add the "my-attribute" attribute with value
"true". This can also be done in puppet by doing:

    file {'/etc/mesos-slave/attributes/my-attribute':
      ensure  => present,
      notify  => service ['mesos-slave'],
      owner   => 'root',
      group   => 'root',
      mode    => 0644,
      content => 'true',
    }
