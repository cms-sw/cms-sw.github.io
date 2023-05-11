# Building external packages

CMSSW has a dedicated build system that handles external packages.
We provide instructions here to use that build system to add a new external package or update an existing external package.

(Throughout these instructions, the name of the external package is written as `${NAME}`.
This allows executing most commands exactly as written by first calling `export NAME=[name]`,
where `[name]` should be replaced with the actual name of your external package.)

0. Initial notes

    * do *not* have a CMSSW environment activated
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
    If you want to backport a new or updated external to an older release cycle, change `master` accordingly.

2. Make a scratch directory, then clone the following repositories (you probably want to make a fork of cms-sw/cmsdist to store your work in progress):
    ```bash
    git clone -b $PKGTOOLS_TAG git@github.com:cms-sw/pkgtools.git
    git clone -b $CMSDIST_TAG git@github.com:cms-sw/cmsdist.git
    ```

3. Each external package `${NAME}` has files `${NAME}.spec` and `scram-tools.file/tools/${NAME}/${NAME}.xml` in `cmsdist`.
The latter file is the toolfile template. It depends on the former, so building the toolfile will also build the external.
(For complicated externals, these may be split into multiple components/files.)
To build an external and any new dependencies (existing dependencies will be downloaded as RPMs):
    ```bash
    pkgtools/cmsBuild -i build -a $SCRAM_ARCH -j 8 build ${NAME}-toolfile
    ```

4. Once the external is successfully compiled, you can test it in a CMSSW release like this (reminder: use a separate session for `cmsenv`):
    ```bash
    cp scratch/build/$SCRAM_ARCH/cms/${NAME}-toolfile/[version]/etc/scram.d/${NAME}.xml $CMSSW_BASE/config/toolbox/$SCRAM_ARCH/tools/selected
    scram setup ${NAME}
    ```
    The `[version]` string is randomly generated, so you will need to find it manually.
    If any other externals depend on your new external, they will also have been rebuilt, and you should repeat the above commands for those externals.

5. In case you updated any existing dependencies that are used in CMSSW packages, you'll need to rebuild those packages.
You can checkout all of those packages using (like `git cms-checkdeps`, but for external changes):
    ```bash
    scram b checkdeps
    ```

6. Last notes:
    * if you update the .spec file (e.g. to fix a bug), but the actual version of the external software doesn't change, it will append "-cms" to the version number. For a subsequent change, it will append "-cms2", etc.
    * `scram b checkdeps` may not work in older versions of CMSSW. An alternative command is:
      ```bash
      scram b echo_${NAME}_USED_BY | tr ' ' '\n' | grep "self" | cut -d'/' -f2-3 | sort -u > pkgs.txt
      git cms-addpkg -f pkgs.txt
      ```
