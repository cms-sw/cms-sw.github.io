---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
---

Managing secrets using CERN puppet infrastructure is well documented at
<http://configdocs.web.cern.ch/configdocs/secrets/README.html> and related
pages.

Secrets get stored in a secure database inside the CERN network and will be
available to the puppet manifest using the `teigi` puppet resource class.

For example if you want to store a secret file `secret.txt` for the hostgroup
`myhostgroup` you can do on the command line:

    tbag set --hg myhostgroup secretname --file secret.txt

This will store the secret in the secure storage. You can then deploy it in
`/some/secret/path` by adding:

```
teigi::secret {"unique_resource_name":
  key => "secretname",
  path => "/some/secret/path/secret.txt" 
  owner => "root",
  group => "root",
  mode  => "0400"
}
```

to your puppet manifest.

Make sure you have proper user, group and permissions set to make sure no one
unexpected can access the secret.
