---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: "https://github.com/cms-sw/cmssw" }
 - { name: Feedback, link: "https://github.com/cms-sw/cmssw/issues/new" }
---

# How to Build a CMSSW Release

## Getting prepared and set up

Before starting, make sure the account you are using (your own account, not
cmsbuild) is properly set up for the work. You will need to be able to do the
following:

- Upload to the repository server
- Request an AFS volume
- Install the release

For the upload, you need to get your public ssh key registered. To do so, send
a mail to the SDT team asking for the registration. Either add your public key
to the mail or (preferred) put the public key in your public/ AFS directory and
mention the path in the mail. Once the key is uploaded, you should be able to
`ssh cmsbuild@cmsrep` w/o being prompted for the cmsbuild password (you still may
be prompted for a passphrase, if you have set one for your key).

The key needs to be for ssh protocol 2, the recommended way to create it is
via: `ssh-keygen -t dsa`

You need to be added by the SDT team to the list of people which are allowed to
request AFS volumes, ask for this in the mail as well.

For the installation, you will need the password for the cmsbuild account, add
this request in the mail to the SDT team.


# Tagging a release in GitHub

First of all you need to [create a new release in GitHub](https://github.com/cms-sw/cmssw/releases/new).

# Building the Release

In order to build you first need to login on your favorite build machine and
create a working dir, checkout the appropriate version of CMSDIST and the
corresponding tag for PKGTOOLS. For IBs this information is found in the file
[cms-bot/config.map](https://github.com/cms-sw/cms-bot/blob/master/config.map).


    CMSSW_X_Y_Z=<the-release-you-want-to-build>
    ARCH=<the-architecture-for-your-build>
    # E.g.
    # ARCH=slc5_amd64_gcc462
    # ARCH=slc5_amd64_gcc472
    # ARCH=slc5_amd64_gcc481
    # ARCH=slc6_amd64_gcc481
    # ARCH=osx106_amd64_gcc462
    # ARCH=osx107_amd64_gcc462
    # ARCH=osx108_amd64_gcc481
    case $ARCH in
      osx*) HERE=/build1/${USER} ;;
      *) HERE=/build/${USER} ;;
    esac
    mkdir -p $HERE/$CMSSW_X_Y_Z-build
    cd $HERE/$CMSSW_X_Y_Z-build
    QUEUE=`echo $CMSSW_X_Y_Z | sed -e 's/\(CMSSW_[0-9][0-9]*_[0-9][0-9]*\).*/\1_X/'`
    eval $(curl -k -s https://raw.githubusercontent.com/cms-sw/cms-bot/master/config.map | grep "SCRAM_ARCH=$ARCH;" | grep "RELEASE_QUEUE=$QUEUE;")
    git clone -b $CMSDIST_TAG git@github.com:cms-sw/cmsdist.git CMSDIST
    git clone -b $PKGTOOLS_TAG git@github.com:cms-sw/pkgtools.git PKGTOOLS

Now go into the CMSDIST dir and prepare the cmssw.spec (or cmssw-patch.spec for
patch releases, update commands below if that is the case) and fwlite.spec files
for the new release, check it back in and tag the dir for a build with a private
tag. This can be done with the following steps:

    sh -e PKGTOOLS/scripts/prepare-cmsdist $CMSSW_X_Y_Z $ARCH

Then issue the build command:

    screen -L time PKGTOOLS/cmsBuild --architecture=$ARCH --builders 4 -j 16 build cms-git-tools
    screen -L time PKGTOOLS/cmsBuild --architecture=$ARCH --builders 4 -j 16 build cmssw
    # If you need to build also fwlite rpms:
    # screen -L time PKGTOOLS/cmsBuild --architecture=$ARCH --builders 4 -j 16 build cmssw fwlite
    # If you need to build a patch release:
    # screen -L time PKGTOOLS/cmsBuild --architecture=$ARCH --builders 4 -j 16 build cmssw-patch

once the build starts it will start listing the check sums of all of the
dependent RPMS.

## Check the build

Once the build is done, build the check package

    screen -L time PKGTOOLS/cmsBuild --architecture=$ARCH --builders 1 -j 20 build cmssw-validation

and check inside:

    cat $ARCH/cms/cmssw-validation/1.0.0/test-runTheMatrix/result.log

everything is OK. In particular make sure you have all (and only) the RPMS you
expect to be built. For the purposes of this twiki that should be cmssw (or
cmssw-patch) and fwlite. cmsBuild can be used to build other distributions such
as root but we want those to have been tested in an IB. cmsBuild will trigger
the build of dependent packages if it thinks the repository is not up to date
for all of the cmssw dependencies. If you find more then the cmssw and fwlite
RPM in the above directory then either you got the tag of CMSDIST wrong or there
is some problem in your environment which is triggering cmsBuild to do more then
it should. Once the problem is identified and fixed you'll have to start over.

## Publish the build

### Tag CMSDIST

Tag the external configuration global tags in the area of your build:

    pushd $HERE/$CMSSW_X_Y_Z-build/CMSDIST
      git tag  REL/$CMSSW_X_Y_Z/$ARCH
      git push origin --tags
    popd

### Upload the release to the repository server.

In order to upload the RPMS to their repository simply do:

    screen -L time PKGTOOLS/cmsBuild --architecture=$ARCH --sync-back upload cmssw fwlite

this will check the build area for consistency and upload the RPMs to the
repository server, under your user name, then synchronise the main repository
and update the apt-database.

### Installation at CERN

Go to [Installation instructions](https://twiki.cern.ch/twiki/bin/view/CMSPublic/SDTHowToInstallReleaseInNewAFSArea)
and follow the instructions.

Announced releases are listed in:

<https://cmstags.cern.ch/tc/ReleasesXML>

### Announce the release to CMS

In order to announce a release, first of all create a change log by using the
jenkins job at:

https://cmssdt.cern.ch/jenkins/job/release-produce-changelog

This will hopefully populate the change-log at
`https://github.com/cms-sw/cmssw/releases/<release-name>`

Then you can prototype the announcement email by doing:

    CMSSW_PREVIOUS=<previous-release>
    cat <<EOF > $HERE/$CMSSW_X_Y_Z-build/announcement-email.txt
    Hi all,

    The production release @CMSSW_X_Y_Z@ is now available for the following
    architectures:

    ...

    The release notes of what changed with respect to @CMSSW_PREVIOUS@ can be found at:

    https://github.com/cms-sw/cmssw/releases/@CMSSW_X_Y_Z@

    Cheers,
      ...
    EOF
    CMSSW_X_Y_Z=$CMSSW_X_Y_Z perl -p -i -e "s/\@CMSSW_X_Y_Z\@/$CMSSW_X_Y_Z/" $HERE/$CMSSW_X_Y_Z-build/announcement-email.txt
    CMSSW_PREVIOUS=$CMSSW_PREVIOUS perl -p -i -e "s/\@CMSSW_PREVIOUS\@/$CMSSW_PREVIOUS/" $HERE/$CMSSW_X_Y_Z-build/announcement-email.txt

edit the $HERE/$CMSSW_X_Y_Z-build/announcement-email.txt email, complete it and
then send it with:

    # RELEASETYPE=Development
    # RELEASETYPE=Production
    # RELEASETYPE=Analysis
    [ ! "X$RELEASETYPE" = X ] && mail -s "$RELEASETYPE release $CMSSW_X_Y_Z now available at CERN." hn-cms-relAnnounce@cern.ch < $HERE/$CMSSW_X_Y_Z-build/announcement-email.txt

## Obsolete instructions

Old instructions can be found at:

https://twiki.cern.ch/twiki/bin/view/CMS/SDTHowToBuildCMSSWRelease
