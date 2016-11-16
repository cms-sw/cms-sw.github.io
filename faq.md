---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
redirect_from:
 - /cmssw/faq.html
---
# FAQs

* auto-gen TOC:
{:toc}

# General questions

### Where can I learn about git, github in general?

- Generic git help can be found at <http://git-scm.com/book/>.
- github.com specific help can be found at <https://help.github.com>.
- A 15 minutes, interactive, git tutorial <http://try.github.com/levels/1/challenges/1>
- A nice video tutorial about git <http://www.youtube.com/watch?v=ZDR433b0HJY>
- A nice interactive tutorial about branches in git <http://pcottle.github.io/learnGitBranching/>
- Even more FAQs <https://git.wiki.kernel.org/index.php/Git_FAQ>

### How do I subscribe to github?

In order to develop CMSSW you will need a github account.

* In case you don't have one already, simply go to:

  [https://github.com/join]()

  and follow the instructions to create a new account. Make sure you use a
  username people can recognize you easily or to specify your real name.

* In case you already have an account you can simply use "the Sign in" dialog and
put your username and password.

  [https://github.com/login]()

Once you are done you should also setup your personal information:

    git config --global user.name <First Name> <Last Name>
    git config --global user.email <Your-Email-Address>
    git config --global user.github <Your-Just-Created-GitHub-Account>

Keep also in mind that git uses `$VISUAL` not `$CVS_EDITOR` for edit commit
messages, so you might want to adapt your shall profile as well.

Finally, make sure you [register in github your ssh
key](https://help.github.com/articles/generating-ssh-keys).

# Working with CMSSW on github

### How do I checkout one or more packages?

If you are in a CMSSW area (remember to do `cmsenv`) you can simply use:

    git cms-addpkg <package-name>

or

    git cms-addpkg -f <file-with-a-list-of-packages>

once you have developments you can checkout dependent packages by doing.

    git cms-checkdeps

[To learn more about git cms-addpkg click here](git-cms-addpkg.html).

You can also find a complete tutorial [here](tutorial.html).


### How do I develop a new feature using git?

Please have a look at the [full blown tutorial about proposing new
changes in CMSSW](tutorial.html).

### How do I check the status of my pull request(s).

Go to the [Pull request](https://github.com/cms-sw/cmssw/issues) to have an
overview of the status of all the pull requests. Click on a given pull request
to have the whole discussion about the pull request approval process.

### How do I make sure my topic branch is updated with the latest developments?

Simply merge the release branch into your topic branch:

    git checkout new-feature
    git fetch official-cmssw
    git merge official-cmssw/CMSSW_6_2_X

or in one command:

    git pull official-cmssw CMSSW_6_2_X

assuming you are on the `new-feature` branch already.

For more information about merging branching read
[here](http://git-scm.com/book/en/Git-Branching-Basic-Branching-and-Merging).

You can also have a look at the CMS git tutorial found [here](tutorial).

### How do I synchronise my personal repository with the official one ?

In general you shouldn't need to do it, but if you really want to, you can do
it from any CMSSW working area:

    git fetch --all
    git push my-cmssw remotes/official-cmssw/CMSSW_7_2_X:refs/heads/CMSSW_7_2_X

You need to repeat the last command for each branch (CMSSW_7_1_X, CMSSW_7_2_X, etc.)
that you want to synchronise.

### What about UserCode?

Please have a look at the [UserCode FAQ](usercode-faq).

### I used to do X in CVS how do I do the same in git?

Please have a look at the [Rosetta Stone](rosetta.html) page which has a few
conversions from CVS-speak to git-speak. Keep in mind that due to different
designs not all the things which you do in one are possible in the other.

### How do I tag a single package?

Tagging a single package is not possible with git, when you tag something
you'll always tag the full repository, tags are only aliases to commits.
However tags are cheap, so we can afford to tag a single integration build.

### How can I limit the diff between two tags to one single package?

You can do it by specifying a path at the end of the git command:

    git diff TAG1..TAG2 -- <some-path>

### How do you delete a branch in git?

In order to delete a branch from your repository you can do:

    git push my-cmssw --delete <branch-name>

or you can use the [web based github interface described
here](https://github.com/blog/1377-create-and-delete-branches).

### Will you migrate all the release tags we used to have for `CMSSW`?

Yes, all release (`CMSSW_X_Y_Z`) tags currently in CVS will be available in
git.

### Will you migrate all the per package tags?

No. Per package tags will not be migrated. You can however have a look at the
[Dealing with CVS History page](cvs-interaction.html) to see how you can get
old tags which were not in any release. This will also be useful to import
packages which did not end up in any release.

### What is the policy for tagging?

No tags other than "release tags" will be allowed inside the _official-cmssw_
repository, so there is not a particular need for a convention for tags.

In the git model, changes are proposed via private branches
which are made into Pull Requests. Given a Pull Request gets automatically
assigned a unique ID (like for tagsets), we will not have a particular
convention, treating them as private tags in the CVS model.

The only recommendation so far has been use "use a somewhat descriptive names of the actual content".

### Is it possible to display a graphical view of my branches?

For a text based output, you can use either:

    git show-branch <branch-1> <branch-2> ... <branch-n>

or

    git log --graph --abbrev-commit <branch-1> <branch-2> ... <branch-n>

Moreover there are a number of graphical GUIs including
gitk (Linux, Mac, Windows, included in git) or [SourceTree](http://www.sourcetreeapp.com)
(Mac, Windows).

### How can I do showtags?

`showtags` is _CVS_ centric in the sense in git we have no per package tags
anymore.

To replace it, you can get the modified files with raw git commands by doing:

     git diff --name-only $CMSSW_VERSION

(of course, drop --name-only if you want the full diff).

A slightly more elaborate way of getting the modified packages is:

     git diff --name-only $CMSSW_VERSION | cut -f1,2 -d/ | sort -u

However in git what makes more sense is to find out the topic branches which
are on top of some base release. You can get these of with:

     git log --graph --merges --oneline $CMSSW_VERSION..

For example:

     git log --graph --oneline --merges CMSSW_7_0_X_2013-07-17-0200..

gives:

     * ef036dd Merge pull request #119 from ktf/remove-broken-file
     * ec831ca Merge pull request #103 from xiezhen/CMSSW_7_0_X
     * d057e80 Merge pull request #97 from inugent/ValidationforMcM53X
     * 085470d Merge pull request #89 from ianna/mf-geometry-payload
     * 1b87cbc Merge pull request #94 from inugent/TauolappandTauSpinner
     * 4ecd70d Merge pull request #124 from gartung/fix-for-llvm-3.3

which shows the importance of good naming for the branches.

If you drop `--merges` you can also get the single commits that people had in
one branch:

     git log --graph --oneline CMSSW_7_0_X_2013-07-17-0200..

will give you:

     *   ef036dd Merge pull request #119 from ktf/remove-broken-file
     |\
     | * 1219f84 Remove completely broken file.
     *   ec831ca Merge pull request #103 from xiezhen/CMSSW_7_0_X
     |\
     | * 0696b0b add testline
     | * 3ae6ab3 added
     | * c2fe08f align with V04-02-08 and fix head report
     | * de3794e align with V04-02-08 and fix head report
     | * e1f8dc2 align with V04-02-08 and fix head report
     | * bac83ea align with V04-02-08
     | * 8cfd791 align with V04-02-08
     | * fd3c705 align with V04-02-08
     | * d7c1596 adopt to schema change
     *   d057e80 Merge pull request #97 from inugent/ValidationforMcM53X
     |\
     | * f6bd948 Updating to cvs head-V00-02-30
     *   085470d Merge pull request #89 from ianna/mf-geometry-payload
     |\
     | * 16f2ebf Use standard geometry file record for magnetic field payload.
     | * 62db3c5 Add Magnetic Field geometry readers from DB payload.
     | * f1fd7e6 Magnetic field payload producers including job configurations.
     | * 0f4acaa Magnetic field payload producers including job configurations.
     | * 526b4f1 Remove GEM from Extended scenario.
     | * bea321c Scripts, configurations and metadata to produce Extended 2019 scenario payloads including GEM.
     | * 87e94e5 Add GEM reco geometry record.
     *   1b87cbc Merge pull request #94 from inugent/TauolappandTauSpinner
     |\
     | * b8cc783 Delete TauSpinnerCMS.cc.~1.2.~
     | * ce66597 adding Tauola 1.1.3 with TauSpinner interface
     | * ec56829 adding Tauola 1.1.3 with TauSpinner interface
     | * 865866a adding Tauola 1.1.3 with TauSpinner interface
     * 4ecd70d Merge pull request #124 from gartung/fix-for-llvm-3.3
     * 2b11a9d fix for api changes in llvm 3.3

which once again shows the importance of good comments.

### How to I retract my own pull request?

Simply close it using the standard GitHub GUI when looking at it.

* Go to the Pull Request page, either by clinking on the list on GitHub.
* Scroll down to the bottom of the discussion related to your pull request.
* Click on "Close"

### How do I receive notifications about pull requests for a given package / subsystem?

Please make a Pull Request to [https://github.com/cms-sw/cms-bot](https://github.com/cms-sw/cms-bot) repository with changes in either

* [https://github.com/cms-sw/cms-bot/blob/master/watchers.yaml](https://github.com/cms-sw/cms-bot/blob/master/watchers.yaml) to get notifications for packages/subsystems OR
* [https://github.com/cms-sw/cms-bot/blob/master/category-watchers.yaml](https://github.com/cms-sw/cms-bot/blob/master/category-watchers.yaml) to get notifications for all packages of a category

### Do you have a nice tutorial on how to develop CMSSW on git?

Yes, please have a look at the [CMSSW git tutorial pages](tutorial.html).

For those of you with CERN access there is also a couple of presentations about git / github in CMS you might find useful:

- https://indico.cern.ch/event/286056/session/1/contribution/3/material/slides/0.pdf

### How do I access the old CVS repository to check what was really there?

The old CVS repository is available *READ-ONLY* by setting:

    export CVSROOT=":ext:<cern-user-account>@lxplus.cern.ch:/afs/cern.ch/work/c/cmsbuild/public/cvs/CMSSW"
    export CVS_RSH=ssh
    # setenv CVSROOT ":ext:<cern-user-account>@lxplus.cern.ch:/afs/cern.ch/work/c/cmsbuild/public/cvs/CMSSW"
    # setenv CVS_RSH ssh

where of course `<cern-user-account>` needs to be substituted with your CERN
account login. Notice that starting on the 15th of October this will be the
only way to access it.

Moreover, if you want to simply browse the old repository via web, you can point your browser to:

<http://cvs.web.cern.ch/cvs/cgi-bin/viewcvs.cgi>

### How do I ask a question?

If you have more questions about git and CMSSW on git, please use [this
form][new-faq-form].

### How do I contribute to these pages?

The documentation you are reading uses [GitHub Pages](http://pages.github.com)
to publish web pages. To contribute to it you need to:

- Register to github.
- Fork the cms-sw.github.io repository under your account ([click here to do
  it](https://github.com/cms-sw/cms-sw.github.io/fork)).
- Edit the documentation and push it to your repository:

      <edit-some-documentation>
      git commit <my-changed-files>
      git push

- Create a "pull request" for you changes by going
  [here](https://github.com/cms-sw/cms-sw.github.io/pull/new/master).

Alternatively, you can edit the pages directly with the github.com web editor:

- go to https://github.com/cms-sw/cms-sw.github.io
- find for the page you want to modify
- use the Edit button to automatically fork the repository and open the editor
- once you are done, use the "Propose file change" button to automatically make
  a branch and ceate a pull request


This will trigger a discussion (and most likely immediate approval) of your
documentation changes.

# Advanced usage

### How do I checkout the full CMSSW repository locally?

To checkout the full CMSSW repository locally you can do:

    git clone cmssw-main src

in your SCRAM work area.  Notice this will require a github account (see
[here]() for the relevant FAQ). Alternatively you can do:

    git clone cmssw-main-ro src

for read only access. If you want to checkout a given tag, you need to
specify it via the `-b` flag, e.g.:

    git clone cmssw-main src -b CMSSW_6_1_0

See [here][git-clone-repo] for more detailed information on `git clone`
command.

[git-clone-repo]: http://git-scm.com/book/en/Git-Basics-Getting-a-Git-Repository#Cloning-an-Existing-Repository

### How do I browse / search the code?

The source code for the official CMSSW repository can be found in the main
github page for CMSSW: <https://github.com/cms-sw/cmssw>.

Branches and tags are available by clicking on the "branches" combo box in the
top left part of the page:

![branches-dialog](images/branches-dialog.png)

The source-code of the official CMSSW can be searched by using
https://github.com/cms-sw/cmssw/search .

If you prefer using the command line interface, you can do the same by using
`git grep` command inside `CMSSW/src` area:

    git grep <reg-expr>

e.g.:

    git grep Plugin.*

which will give you:

    Alignment/CSA06AlignmentAlgorithm/BuildFile:<use name=FWCore/PluginManager>
    Alignment/CommonAlignmentAlgorithm/BuildFile.xml:<use   name="FWCore/PluginManager"/>
    Alignment/CommonAlignmentAlgorithm/interface/AlignmentAlgorithmPluginFactory.h:#include "FWCore/PluginManager/interface/PluginFactory.h"
    Alignment/CommonAlignmentAlgorithm/interface/IntegratedCalibrationPluginFactory.h:#include "FWCore/PluginManager/interface/PluginFactory.h"
    Alignment/CommonAlignmentMonitor/BuildFile.xml:<use   name="FWCore/PluginManager"/>
    Alignment/CommonAlignmentMonitor/interface/AlignmentMonitorPluginFactory.h:#include "FWCore/PluginManager/interface/PluginFactory.h"
    Alignment/CommonAlignmentMonitor/plugins/AlignmentMonitorTemplate.cc:// #include "PluginManager/ModuleDef.h"
    Alignment/CommonAlignmentMonitor/plugins/AlignmentStats.cc:#include "FWCore/PluginManager/interface/ModuleDef.h"
    Alignment/CommonAlignmentMonitor/plugins/BuildFile.xml:<use   name="FWCore/PluginManager"/>
    ...

for more information about `git grep` click [here](http://git-scm.com/docs/git-grep).

### How do I tell who is responsible for a given change?

Let's say you want to find out who is responsible for a given
change in `FWCore/Framework/BuildFile.xml`. If you are happy with using
the web based GUI you can simply browse to the given file ([click
here](https://github.com/cms-sw/cmssw/blob/master/FWCore/Framework/BuildFile.xml)
for this particular example).

Then click on the "Blame" button (again [click
here](https://github.com/cms-sw/cmssw/blame/master/FWCore/Framework/BuildFile.xml)
for the particular example).

![blame button](images/blame-button.png)

You can get the full information about a given change
(including which files changed in the same commit) by clicking on the
specific commit-id (the hash in the left column, [for example
bd2fd326](https://github.com/cms-sw/cmssw/commit/bd2fd32657121cda0cc132a98b3b0d68773788b8)).

Alternatively if you prefer doing it from the command line, you can use the
`git blame` command to find out for each line which `commit-id` is responsible
for a given change.

    > git blame FWCore/Framework/BuildFile.xml

which returns:

    f4330d28 (wmtan 2010-02-18 23:10:32 +0000  1) <use   name="DataFormats/Common"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000  2) <use   name="DataFormats/Provenance"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000  3) <use   name="FWCore/Common"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000  4) <use   name="FWCore/MessageLogger"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000  5) <use   name="FWCore/ParameterSet"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000  6) <use   name="FWCore/PluginManager"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000  7) <use   name="FWCore/PythonParameterSet"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000  8) <use   name="FWCore/ServiceRegistry"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000  9) <use   name="FWCore/Utilities"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000 10) <use   name="FWCore/Version"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000 11) <use   name="boost"/>
    bd2fd326 (wmtan 2013-01-30 23:21:16 +0000 12) <use   name="rootcintex"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000 13) <use   name="rootcore"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000 14) <export>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000 15)   <lib   name="1"/>
    f4330d28 (wmtan 2010-02-18 23:10:32 +0000 16) </export>

Let's say we are interested in line 12, i.e. `<use   name="rootcintex"/>`.
The first column gives us the `commit-id` (`bd2fd326` in this case). To find out everything
about that commit you can use the `git show` command:

    git show bd2fd326

which returns:

    commit bd2fd32657121cda0cc132a98b3b0d68773788b8
    Author: wmtan <>
    Date:   Wed Jan 30 23:21:16 2013 +0000

        With Reflex usage partially removed, EventProcessor needs CINT dictionaries

    diff --git a/FWCore/Framework/BuildFile.xml b/FWCore/Framework/BuildFile.xml
    index a5cae15..52e584d 100644
    --- a/FWCore/Framework/BuildFile.xml
    +++ b/FWCore/Framework/BuildFile.xml
    @@ -9,6 +9,7 @@
    <use   name="FWCore/Utilities"/>
    <use   name="FWCore/Version"/>
    <use   name="boost"/>
    +<use   name="rootcintex"/>
    <use   name="rootcore"/>
    <export>
    <lib   name="1"/>
    diff --git a/FWCore/Framework/src/EventProcessor.cc b/FWCore/Framework/src/EventProcessor.cc
    index a8fe6c3..fbe4bc3 100644
    --- a/FWCore/Framework/src/EventProcessor.cc
    +++ b/FWCore/Framework/src/EventProcessor.cc
    @@ -83,6 +83,9 @@
    #include <sched.h>
    #endif

    +//Needed for introspection
    +#include "Cintex/Cintex.h"
    +
    namespace edm {

    namespace event_processor {
    @@ -585,6 +588,8 @@ namespace edm {
                            serviceregistry::ServiceLegacy iLegacy) {

        //std::cerr << processDesc->dump() << std::endl;
    +
    +    ROOT::Cintex::Cintex::Enable();

        boost::shared_ptr<ParameterSet> parameterSet = processDesc->getProcessPSet();
        //std::cerr << parameterSet->dump() << std::endl;

### How can I find out who is developing in a given package?

If you are interested in the general developers for a given package, the best
option is probably to use `git log -- <subsytem>/<package>` in the toplevel
directory and have a look at recent developments. A slightly fancier way of
doing it is via:

    git log --pretty="%an" --since 1y -- <subsytem>/<package> | sort -u

which will print only the authors ( `--pretty="%an"` ) who have committed something in
the given `<subsytem>/<package>` in the last year ( `--since 1y` ).

### Downloading from github is painfully slow, how can I improve the situation?

If you have a local mirror of CMSSW repository at your site / university you
can use it by setting the `CMSSW_MIRROR` environment variable. E.g.:

    export CMSSW_MIRROR=https://:@git.cern.ch/kerberos/CMSSW.git
    # setenv CMSSW_MIRROR https://:@git.cern.ch/kerberos/CMSSW.git

for CERN.

`git cms-addpkg` will then use it to fetch most of the data, and then switch to the
official repository for fetching the missing parts.

If you happen to have a local copy of the reposiry on the machine you are working
on you can speed up things even further by having:

    export CMSSW_GIT_REFERENCE=<repository-path>

in particular people working on lxplus can use:

    export CMSSW_GIT_REFERENCE=/afs/cern.ch/cms/git-cmssw-mirror/cmssw.git

or in case you have CVMFS available you can set it to:

    export CMSSW_GIT_REFERENCE=/cvmfs/cms.cern.ch/cmssw.git.daily

### How do I setup a local mirror?

Git allows you to mirror a repository by doing:

    CMSSW_GIT_REFERENCE=<some-path>
    git clone --mirror --bare https://github.com/cms-sw/cmssw.git $CMSSW_GIT_REFERENCE

Done that you can update the mirror via:

    cd $CMSSW_GIT_REFERENCE
    git remote update

### How do I collapse multiple commits into one?

A very common pattern when developing a feature with git is to commit very
often, to keep track of even small set of changes and once one is happy with
the feature branch to go back, collapse all the minor changes and write a nice
commit message.


Let's assume for example you have a very long commit history for a topic branch
`my-topic`.

    * 00b32e7 - Sat, 6 Apr 2013 11:07:19 +0200 (10 minutes ago) (HEAD, my-topic)
    |           A typo.  Giulio Eulisse
    * 6ed6e45 - Sat, 6 Apr 2013 11:06:49 +0200 (11 minutes ago)
    |           Some documentation added.  Giulio Eulisse
    * 74f8fd0 - Sat, 6 Apr 2013 11:06:34 +0200 (11 minutes ago)
    |           Some more bug fixes.  Giulio Eulisse
    * 39165d9 - Sat, 6 Apr 2013 11:06:00 +0200 (12 minutes ago)
    |           Some bugfix.  Giulio Eulisse
    * 3a775f1 - Sat, 6 Apr 2013 11:05:21 +0200 (12 minutes ago)
                Initial commit for topic.  Giulio Eulisse

once you are completely happy with your topic branch, you might not
particularly care about all the intermediate steps, and you might want to
squash all of them into one. This is done by using the `git reset` command: it
will rever you back to a given commit, but it will keep your changes in the
working tree, ready to be committed. E.g.:

    git reset --soft 3a775f1

will reset the commit index to the "Initial commit for topic." but it will
leave all code changes ready to be committed. You can then amend the initial commit
with all the changes you previously did by simply doing:

    git commit --amend

which will prompt for an updated message and will results in one single commit:

    * f7400d3 - Sat, 6 Apr 2013 11:05:21 +0200 (19 minutes ago) (HEAD, master)
                Some Feature added and tested.  Giulio Eulisse

For more information about how to rewrite history, you can have a look at the
[git guide](http://git-scm.com/book/en/Git-Tools-Rewriting-History). In
particular once you are familiar with the concept you might want to look at
[`git rebase
--interactive`](http://git-scm.com/book/en/Git-Tools-Rewriting-History#Changing-Multiple-Commit-Messages) which provides
more flexibility when you want to do more that simply merge a set of commits
into one.

### How do I pick up a commit from a branch and apply it to another branch?

Have a look at the `git-cherry-pick` command. E.g.:

    git cherry-pick <hash-of-commit-on-another-branch>

will take `<hash-of-commit-on-another-branch>` and apply it on the current
branch. Notice that the new commit will have a different hash, because the
history is different.

### I need to checkout a file from the old CVS HEAD / a release tag, how can I do it?

The _CVS HEAD_ at the time of the migration is available in the git branch
`imported-CVS-HEAD`. You can checkout files from the by simply fetching that
branch in your local workarea and then using git checkout for it.

For example lets assume you want to checkout the _HEAD_ of
`PhysicsTools/Configuration/test/SUSY_pattuple_cfg.py` in CMSSW_5_3_11, where
it was never released. First you need to set up the area and fetch the branch:

    scram project CMSSW_5_3_11
    cd CMSSW_5_3_11/src
    cmsenv

this needs to be done only once per workarea. Then you do:

    git cms-addpkg PhysicsTools/Configuration
    git fetch official-cmssw imported-CVS-HEAD:imported-CVS-HEAD
    git checkout imported-CVS-HEAD -- PhysicsTools/Configuration/test/SUSY_pattuple_cfg.py

Notice the `git cms-addpkg` is needed to bring in the package (i.e. make the
sparse checkout). Finally notice you can use the same recipe to checkout files
in different release tags (e.g. CMSSW_5_3_11).


### I made a mess and I do not know what I've currently checked out!

It can happen that due to wrong manipulations of the history, merging or
rebasing, one finds itself with the current branch ref pointing to something
unexpected. In order to view the history of the actions done, one can use the

    git reflog

command which will print out the various steps of the HEAD. E.g:

    7225357 HEAD@{0}: commit: Align header.
    a59e3bd HEAD@{1}: rebase -i (finish): returning to refs/heads/gh-pages
    a59e3bd HEAD@{2}: rebase -i (pick): Typos.
    fbb9019 HEAD@{3}: rebase -i (pick): Nicer tables.
    83a21a1 HEAD@{4}: rebase -i (pick): Migration postponed.
    5acef5f HEAD@{5}: rebase -i (squash): Move Rosetta stone in a glorified page.
    9911088 HEAD@{6}: rebase -i (squash): updating HEAD
    d3f80cb HEAD@{7}: checkout: moving from gh-pages to d3f80cb
    f48873e HEAD@{8}: commit: Move rosetta.
    ff1e4b0 HEAD@{9}: rebase -i (finish): returning to refs/heads/gh-pages

One can then use `git reset --hard <some-hash>` to revert back to some point in
history.

To learn more about git reflog you can look at [its man
page](https://www.kernel.org/pub/software/scm/git/docs/git-reflog.html) or the
[Pro Git](http://git-scm.com/book/ch6-1.html#RefLog-Shortnames) section about
it.

### How can I prevent automatic forward porting of a pull request?

CMS uses a cronjob to automate the forward porting of pull requests. For
examples changes which get applied to `CMSSW_7_0_X` get automatically forward
ported to `CMSSW_7_1_X` and from there they then get to `CMSSW_7_2_X`, etc. The
forward porting is smart enough to make sure that if there is any conflicting
changes in a newer version, the forward port of the conflicting part will not
happen. However sometimes its desiderable to avoid the forward port completely,
simply because a given bug-fix / new feature might apply on an old release and
not a new one. In order to avoid this one needs to prepare an additional pull
request which will stop the propagation in a given release.

Let's say we have locally a branch `my-non-forwardable-feature` which I only
want in `CMSSW_7_0_X` and not in `CMSSW_7_1_X`. First of all I need to move from
my development branch to `CMSSW_7_1_X`:

    git fetch official-cmssw
    git reset --hard official-cmssw/CMSSW_7_1_X

then I need to merge the unwanted feature there, using the `-s ours` option,
which will tell git to ignore any change and consider our current branch (hence
the name of the option) as the one from which all the changes will be taken,
regardless of the merge being successful or not.

    git merge -s ours my-non-forwardable-feature

Finally I need to push my branch, and open a pull request in `CMSSW_7_1_X`. Such
a pull request will say that thre are 0 changes compared to the current
CMSSW_7_1_X. Once such a Pull Request is merged, we can happily merge the one
which was done for `CMSSW_7_0_X` which will then be ignored by the subsequent
automatic forward port.

### How do I ask a question?

If you have more questions about git and CMSSW on git, please use [this
form][new-faq-form].

[new-faq-form]: https://github.com/cms-sw/cmssw/issues/new


