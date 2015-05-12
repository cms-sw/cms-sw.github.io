---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
---

## Prerequites:

- Make sure you have the docker client [^docker-setup].
- Make sure you can run docker by adding yourself to the docker UNIX group [^docker-group].
- Register yourself in [Docker Hub][docker-hub].

## Updating docker build image

Sometimes we need to use docker images to build our software, so  that they can deployed on a different OS. In order to do so you need to:

- Clone the `cmssw/cms-docker` repository:

      git clone https://github.com/cms-sw/cms-docker
      cd cms-docker
   
- Create a new directory for the image you want to create, e.g. `slc7-vanilla`:

      mkdir -p slc7-vanilla

- create a basic `Dockerfile` which at least has the following:

      cat << \EOF > slc7-vanilla/Dockerfile
      FROM centos:centos7
          
      ADD RPM-GPG-KEY-cern /etc/pki/rpm-gpg/RPM-GPG-KEY-cern
      ADD HEP_OSlibs.repo /etc/yum.repos.d/HEP_OSlibs.repo
      RUN yum update -y
      EOF

- Add CERN GPG key for the repository:

      cat << \EOF > slc7-vanilla/RPM-GPG-KEY-cern
      -----BEGIN PGP PUBLIC KEY BLOCK-----
      Version: GnuPG v1.2.6 (GNU/Linux)
      
      mQGiBEK/0MURBACv5Rm/jRnrbyocW5t43hrjFxlw/DPLTWiA16apk3P2HQQ8F6cs
      EY/gmNmUf4U8KB6ncxdye/ostSBFJmVYh0YEYUxBSYM6ZFui3teVRxxXqN921jU2
      GbbWGqqlxbDqvBxDEG95pA9oSiFYalVfjxVv0hrcrAHQDW5DL2b8l48kGwCgnxs1
      iO7Z/5KRalKSJqKx70TVIUkD/2YkkHjcwp4Nt1pPlKxLaFp41cnCEGMEZVsNIQuJ
      1SgHyMHKBzMWkD7QHqAeW3Sa9CDAJKoVPHZK99puF8etyUpC/HfmOIF6jwGpfG5A
      S7YbqHX6vitRlQt1b1aq5K83J8Y0+8WmjZmCQY6+y2KHOPP+zHWKe5TJDeqDnN0j
      sZsKA/441IF4JJTPEhvRFsPJO5WKg1zGFbxRPKvgi7+YY6pJ0VFbOMcJVMkvSZ2w
      4QRD+2ets/pRxNhITHfPToMV3lhC8m1Je5fzoSvSixgH/5o9mekWWSW7Uq7U0IWA
      7OD7RraJRrGxy0Tz3G+exA7svv/zn9TW/BaHFlMHoyyDHOYZmIhhBB8RAgAhBQJC
      v+/uFwyAEeb+6rc8Txi4s8pfgZAf4xOTel99AgcAAAoJEF4D/eUdHgNLGCgAmwdu
      KegSOBXpDe061zF8NoN6+OFiAJ9nKo+uC6xBZ9Ey550SmhFCPPA2/rRTQ0VSTiBM
      aW51eCBTdXBwb3J0IChSUE0gc2lnbmluZyBrZXkgZm9yIENFUk4gTGludXggU3Vw
      cG9ydCkgPGxpbnV4LnN1cHBvcnRAY2Vybi5jaD6IWgQTEQIAGgUCQr/QxQULBwMC
      AQMVAgMDFgIBAh4BAheAAAoJEF4D/eUdHgNL/HsAn1ntKwRoSA9L0r8UyF7Zqn3U
      79m1AJ9Y4NsSE/dlFYLfmf0+baoq7b5asIicBBMBAgAGBQJCv9DjAAoJEPy9YCiW
      u335GTwEALjUQ7+cHxi0sifstCLoyRYQSu7Eas0M1UD2ZxSQNBnYsx4rDZJk9TmK
      7QCzR1yRw9aixzZsRlNbed5VPxSzn89PE5m7Sx1bpl89sPgZ4BY95AL2wExyDWRp
      1ON2+ztYeYtT7ZCkmeM+PBzt6RHR/jo3361faBS+qOkmpiiRWf3XiEYEExECAAYF
      AkK/0WAACgkQkB/jE5N6X33DFQCgkvy1ruogu5Ibs5CzGY/ALiSJhyAAn3ygn3p/
      xrNQ8Dy5j4KfgJINoxT4iEYEEBECAAYFAkK/9CcACgkQDIloXtlLxZSiRACdG0kT
      KlB4X4VBocUyxMReO9e5MvsAoIKWgcJYE8AGmRXjfIisCAzPtVX+iEYEExECAAYF
      AkK/8oUACgkQtQgG0wyY/52z1ACgkkxNdhHKbEol3Kwka1tICWHMIwIAn3PWJQR0
      C1MV1+CnT8UupHzxy6J7
      =IUD3
      -----END PGP PUBLIC KEY BLOCK-----
      EOF

- Add the yum configuration for the repository:

      cat << \EOF > slc7-vanilla/HEP_OSlibs.repo
      [cc7-cern]
      name=CERN Centos 7
      baseurl=http://linuxsoft.cern.ch/cern/centos/7/cern/x86_64/
      enabled=1
      gpgcheck=1
      gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-cern
      exclude=
      priority=10
      EOF

- Build the image and upload it. We will build it using `cmssw/slc7-vanilla` as mnemonic tag for it.

      docker build -t cmssw/slc7-vanilla slc7-vanilla

- You can now verify that you did everything right by doing, for example:

      $ docker run -it cmssw/slc7-vanilla cat /etc/redhat-release
      CentOS Linux release 7.1.1503 (Core)

- Push your changes to github:

      git commit -m 'New SLC7 image' slc7-vanilla
      git push

- Push the image itself to dockerhub:

      docker push cmssw/slc7-vanilla

  notice that unless you specify an actual docker repository, using
  `cmssw/slc7-vanilla` means "push to the [official Docker Hub repository for
  the cmssw Organization][docker-cmssw]".

[^docker-setup]: On SLC6, `yum install docker-io`. On CC7, `yum install docker`. On Mac, use [boot2docker](http://boot2docker.io). If you are unable to run docker on your machine, you can use cmsdevXX ones.
[^docker-group]: `usermod -a -G docker <username>`

[docker-cmssw]: https://registry.hub.docker.com/repos/cmssw/
[docker-hub]: https://hub.docker.com/account/signup/
