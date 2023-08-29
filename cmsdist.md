# Building external packages

CMSSW has a dedicated build system that handles external packages.
We provide instructions here to use that build system to add a new external package or update an existing external package.

(Throughout these instructions, the name of the external package is written as `${NAME}`.
This allows executing most commands exactly as written by first calling `export NAME=[name]`,
where `[name]` should be replaced with the actual name of your external package.)

0. Initial notes

    * do *not* have a CMSSW environment activated (i.e. use a clean login session, never call `cmsenv`)
    * use a regular user (non-root/superuser) account
    * typically requires at least a few GB of disk space
    * depending on what's in your login file etc., may need to do:
      ```bash
      unset PYTHONPATH
      ```

1. Get environment variables for CMSSW master branch with production architecture:
    ```bash
    eval $(curl -s https://raw.githubusercontent.com/cms-sw/cms-bot/master/config.map | grep 'RELEASE_BRANCH=master' | grep 'PROD_ARCH=1')
    ```
    If you want to backport a new or updated external to an older release cycle, change `RELEASE_BRANCH=master` accordingly.

2. Make a scratch directory, then clone the following repositories (you probably want to make a fork of cms-sw/cmsdist to store your work in progress):
    ```bash
    git clone -b $PKGTOOLS_TAG git@github.com:cms-sw/pkgtools.git
    git clone -b $CMSDIST_TAG git@github.com:cms-sw/cmsdist.git
    ```

3. Depending on the release cycle, the operating system for the production architecture may be different that the OS that you are currently using.
Therefore, in general, you should use the appropriate CMSSW container via Apptainer, and restore the environment variable settings from step 1
(in case your `~/.bashrc` has overridden the value of `SCRAM_ARCH`):
    ```bash
    APPT_CMD=/cvmfs/cms.cern.ch/common/cmssw-$(echo $SCRAM_ARCH | cut -d_ -f1)
    $APPT_CMD
    eval $(curl -s https://raw.githubusercontent.com/cms-sw/cms-bot/master/config.map | grep 'RELEASE_BRANCH=master' | grep 'PROD_ARCH=1')
    ```

4. Each external package `${NAME}` has files `${NAME}.spec` and `scram-tools.file/tools/${NAME}/${NAME}.xml` in `cmsdist`.
The latter file is the toolfile template. It depends on the former, so building the toolfile will also build the external.
(For complicated externals, these may be split into multiple components/files. The command below can only be called for the packages listed in `scram-tools.file/tools/`; the other components for multi-component packages and their toolfiles will be built automatically.)
To build an external and any new dependencies (existing dependencies will be downloaded as RPMs):
    ```bash
    pkgtools/cmsBuild -i build -a $SCRAM_ARCH -j 8 build ${NAME}-toolfile
    ```
    In some cases, you may need to add the argument `--weekly` (before `build` in the above command) to use a newer repository of existing dependencies.
    If you want to build all tools, change `${NAME}-toolfile` to `cmssw-tool-conf`.

5. Once the external is successfully compiled, you can test it in a CMSSW release like this (reminder: use a separate session for `cmsenv`):
    ```bash
    CMSSW_DEV_VERSION=$(scram -a $SCRAM_ARCH list -c  $RELEASE_QUEUE | tail -1 | awk '{print $2}')
    scram -a $SCRAM_ARCH project ${CMSSW_DEV_VERSION}
    cd ${CMSSW_DEV_VERSION}
    TOOLDIR=$(ls -drt scratch/build/$SCRAM_ARCH/cms/${NAME}-toolfile/*/etc/scram.d/ | tail -1)
    ls $TOOLDIR/*.xml | xargs -n1 scram setup
    cmsenv
    ```
    If any other externals depend on your new external, they will also have been rebuilt, and you should repeat the `TOOLDIR` commands for those externals.
    If you rebuilt all tools, use `TOOLDIR=$(ls -drt scratch/build/${SCRAM_ARCH}/cms/cmssw-tool-conf/*/tools/selected | tail -1)` instead.

6. In case you updated any existing dependencies that are used in CMSSW packages, you'll need to rebuild those packages.
There is a command to checkout all of those packages (like `git cms-checkdeps`, but for external changes):
    ```bash
    scram b checkdeps
    scram b -j 4
    ```

7. Once you have set up your test area, run unit and matrix tests:
    ```bash
    scram b runtests
    runTheMatrix.py -i all --ibeos -s -t 4
    ```

8. Last notes:
    * if you update the .spec file (e.g. to fix a bug), but the actual version of the external software doesn't change, it will append "-cms" to the version number. For a subsequent change, it will append "-cms2", etc.
    * `scram b checkdeps` may not work in older versions of CMSSW. An alternative command is:
      ```bash
      scram b echo_${NAME}_USED_BY | tr ' ' '\n' | grep "self" | cut -d'/' -f2-3 | sort -u > pkgs.txt
      git cms-addpkg -f pkgs.txt
      ```
