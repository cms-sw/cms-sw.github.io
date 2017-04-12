---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
redirect_from:
 - /cmssw/resolve-conflicts.html
---

## Tutorial: resolve conflicts & port features

One of the greatest advantages of _git_ is that it is much smarter at handling
conflicts between different contribution to the same repository. In particular
it automatically handles the case of two parallel developments, both changing
the same package in orthogonal manner. As smart as it can be, however,
git does not know about the mass of the Higgs or how to resolve conflicts where two
people modified the same line in different ways. This latter case is however
automatically detected by GitHub, which will point out that your changes cannot
be merged automatically.

This tutorial will show you how to resolve the latter problem.

### Before you start.

Please make sure you are registered with GitHub and that you have provided them
a ssh public key to access your private repository. For more information see
the [FAQ](faq.html).

We will also assume that there is a non mergeable branch called
`Unmergeable8025` in the repository of the user `kpedro88`.

### Create a CMSSW area

First, let's create an area for the latest / greatest CMSSW available:
```
scram project CMSSW_8_0_26
cd CMSSW_8_0_26/src
cmsenv
```

### Try to merge the unmergeable branch

We then try to merge in our working area the unmergeable branch, via:
````
git cms-merge-topic kpedro88:Unmergeable8025
```
  
this will fail with a message like:
```
Auto-merging Configuration/StandardSequences/python/Mixing.py
CONFLICT (content): Merge conflict in Configuration/StandardSequences/python/Mixing.py
Automatic merge failed; fix conflicts and then commit the result.
Unable to merge branch Unmergeable8025 from repository kpedro88.
```

which means that the file `Configuration/StandardSequences/python/Mixing.py`
has changed in conflicting ways in the branch `kpedro88:Unmergeable8025` and the
the release `CMSSW_8_0_26`.

### Viewing the conflicting changes.

The conflicting changes can be viewed by using the `git diff` command:
```
git diff
diff --cc Configuration/StandardSequences/python/Mixing.py
index 6c3a015,280f8e9..0000000
--- a/Configuration/StandardSequences/python/Mixing.py
+++ b/Configuration/StandardSequences/python/Mixing.py
@@@ -111,7 -111,7 +111,11 @@@ addMixingScenario("2015_25ns_FallMC_mat
  addMixingScenario("2016_25ns_SpringMC_PUScenarioV1_PoissonOOTPU",{'file': 'SimGeneral.MixingModule.mix_2016_25ns_SpringMC_PUScenarioV1_PoissonOOTPU_cfi'})
  addMixingScenario("2016_25ns_Moriond17MC_PoissonOOTPU",{'file': 'SimGeneral.MixingModule.mix_2016_25ns_Moriond17MC_PoissonOOTPU_cfi'})
  addMixingScenario("mix_2016_PoissonOOTPU_HighPUTrains_Fill5412",{'file': 'SimGeneral.MixingModule.mix_2016_PoissonOOTPU_HighPUTrains_Fill5412_cfi'})
++<<<<<<< HEAD
 +addMixingScenario("mix_2016_PoissonOOTPU_HighPUIsolated_Fill5412",{'file': 'SimGeneral.MixingModule.mix_2016_PoissonOOTPU_HighPUIsolated_Fill5412_cfi'})
++=======
+ addMixingScenario("AVE_200_BX_25ns_minOOT",{'file': 'SimGeneral.MixingModule.mix_POISSON_average_cfi','BX':25, 'B': (-3,1), 'N': 200})
++>>>>>>> kpedro88/Unmergeable8025
  addMixingScenario("ProdStep2",{'file': 'SimGeneral.MixingModule.mixProdStep2_cfi'})
  addMixingScenario("fromDB",{'file': 'SimGeneral.MixingModule.mix_fromDB_cfi'})
```

As expected the file which has problems is
`Configuration/StandardSequences/python/Mixing.py`.
Conflicts are marked using [merge conflict markers](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/),
(the same way they were on CVS), via the `<<<<<<<` and `>>>>>>>` delimiters, and the
`=======` separator. The version on top (marked with `HEAD`) is the one which is
available in our work area. The version on the bottom (marked with
`kpedro88/Unmergeable8025`) is the one which belong to the topic branch we are
trying to merge. In this particular case, we want to keep both new lines. 
Therefore we do it via our preferred editor
(`nano` used here for simplicity).
```
nano Configuration/StandardSequences/python/Mixing.py
<remove the conflict>
```

Once we have done it, we can do _diff_ again to see the changes:
```
/StandardSequences/python/Mixing.py
index 6c3a015,280f8e9..0000000
--- a/Configuration/StandardSequences/python/Mixing.py
+++ b/Configuration/StandardSequences/python/Mixing.py
@@@ -111,7 -111,7 +111,8 @@@ addMixingScenario("2015_25ns_FallMC_mat
  addMixingScenario("2016_25ns_SpringMC_PUScenarioV1_PoissonOOTPU",{'file': 'SimGeneral.MixingModule.mix_2016_25ns_SpringMC_PUScenarioV1_PoissonOOTPU_cfi'})
  addMixingScenario("2016_25ns_Moriond17MC_PoissonOOTPU",{'file': 'SimGeneral.MixingModule.mix_2016_25ns_Moriond17MC_PoissonOOTPU_cfi'})
  addMixingScenario("mix_2016_PoissonOOTPU_HighPUTrains_Fill5412",{'file': 'SimGeneral.MixingModule.mix_2016_PoissonOOTPU_HighPUTrains_Fill5412_cfi'})
 +addMixingScenario("mix_2016_PoissonOOTPU_HighPUIsolated_Fill5412",{'file': 'SimGeneral.MixingModule.mix_2016_PoissonOOTPU_HighPUIsolated_Fill5412_cfi'})
+ addMixingScenario("AVE_200_BX_25ns_minOOT",{'file': 'SimGeneral.MixingModule.mix_POISSON_average_cfi','BX':25, 'B': (-3,1), 'N': 200})
  addMixingScenario("ProdStep2",{'file': 'SimGeneral.MixingModule.mixProdStep2_cfi'})
  addMixingScenario("fromDB",{'file': 'SimGeneral.MixingModule.mix_fromDB_cfi'})
```

We can now commit our changes:
```
git add Configuration/StandardSequences/python/Mixing.py
git commit
```

This will ask you to provide a comment for the conflict you just solved:
```
Merged Unmergeable8025 from repository kpedro88

Conflicts:
    Configuration/StandardSequences/python/Mixing.py
#
# It looks like you may be committing a merge.
# If this is not correct, please remove the file
#   .git/MERGE_HEAD
# and try again.
```

In general it's fine to leave it as it is.

Your branch is now updated and the conflicts are solved. You can push your
changes to `my-cmssw` and update your pull request:

    git push my-cmssw HEAD:Unmergeable8025

This will tell git to push the current HEAD of the branch you are on (i.e. the
one containing the merge) to the remote `tutorial-unmergeable` branch.

### Rewriting history and cleaning up your changes

What you have read so far is fine and you can stop reading here if the idea of
rewriting history scares you off.

While completely correct the above mentioned procedure has the disadvantage
that an extra commit will show the fact that you had to update your branch to
keep up with an evolving release, possibly modified by someone else. You can
see this by doing `git log`:
```
commit bf1db282e598bafd65987a2370adde59b954de97
Merge: 353b35a a1fa41b
Author: Kevin Pedro <kpedro88@gmail.com>
Date:   Wed Apr 12 11:59:32 2017 -0500

    Merged Unmergeable8025 from repository kpedro88
    
    Conflicts:
        Configuration/StandardSequences/python/Mixing.py

commit a1fa41b86570ee5420ccd083316b4ccd1ec2fd46
Author: Kevin Pedro <kpedro88@gmail.com>
Date:   Tue Apr 11 17:34:15 2017 -0500

    add new PU scenario
```

Sometimes this is not desirable, because it scatters your changes around. It
is however possible to rewrite history, and improve the look of it. This is done
via the rebase command:

    > git rebase CMSSW_7_0_X_2013-07-11-1400

where `CMSSW_7_0_X_2013-07-11-1400` is the release you would like to align to.
This will still fail with something like:

    First, rewinding head to replay your work on top of it...
    Applying: Make BranchDescription not mutable
    Using index info to reconstruct a base tree...
    M       FWCore/TFWLiteSelector/src/TFWLiteSelectorBasic.cc
    M       IOPool/Streamer/src/StreamerInputSource.cc
    Falling back to patching base and 3-way merge...
    Auto-merging IOPool/Streamer/src/StreamerInputSource.cc
    Auto-merging FWCore/TFWLiteSelector/src/TFWLiteSelectorBasic.cc
    CONFLICT (content): Merge conflict in FWCore/TFWLiteSelector/src/TFWLiteSelectorBasic.cc
    Failed to merge in the changes.
    Patch failed at 0001 Make BranchDescription not mutable
    The copy of the patch that failed is found in:
       /build/ge/CMSSW_7_0_X_2013-07-11-1400/src/.git/rebase-apply/patch

    When you have resolved this problem, run "git rebase --continue".
    If you prefer to skip this patch, run "git rebase --skip" instead.
    To check out the original branch and stop rebasing, run "git rebase --abort".

you can then check the difference using `git diff`, fix them using your
favourite editor and stage them with:

    git add FWCore/TFWLiteSelector/src/TFWLiteSelectorBasic.cc

and then tell git to continue to the next commit:

    git rebase --continue

This will then get rid of the "merge commit" and your history will look much
more linear. You can now push the branch again using `git push`.

### The dangers of rewriting history

While there is nothing inherently bad about rewriting commit history, in
particular if it is for the sake of improving documentation and clarity of the
commit messages, it can cause havok if someone has been working on top of the
now changed head. For this reason it is reccomended that if you find yourself
using `git rebase` you also push your rewritten history to a different branch,
and create a new pull request, so that the rewritten history is easily
identified as such and people who depend on your changes do not have headaches.

### More advanced options

If you have multiple commits you can even rearrange those by using
the `git rebase --interactive` option.

### The above is all great stuff but I need a quick recipe!

So, here it is: you have pushed your changes onto your branch and made a pull
request! Great - but then the integration team tells you that your pull request
no longer merges. This happens if others have made changes at those code lines
also affected by your changes

So here is the recipe to UPDATE your pull request:

Make a new developer area (eg, based on the most recent IB), e.g.:

    cmsrel CMSSW_7_0_X_2013-12-06-0200
    cd CMSSW_7_0_X_2013-12-06-0200/src
    cmsenv

Update to the HEAD of the CMSSW release series, here `CMSSW_7_0_X`:

    git cms-merge-topic CMSSW_7_0_X

Checkout your old branch (from the pull request which does not merge),
 for example:

    git checkout -b <my-development-branch>

Run the merging of the pull request yourself, such as:

    git cms-merge-topic <pull-request-id>

Look for conflicts:

    git diff

Fix them:

    emacs ...
    emacs ...

Commit them back to the old branch:

    git commit -a -m "Fix conflicts." 

Push the branch:

    git push my-cmssw HEAD:<my-development-branch>

(beware: must add "HEAD:" in the above)

This updates your pull request!

Now wait for the "+1" to arrive.

### Cherry-picking commits for a clean history

Some people have had issues with the above procedure, where extra commits already merged into CMSSW appear in the branch for the pull request.  If this happens to you, the instructions below may help you in cleaning up the history. 

If you need to apply your changes on top of a different point in time (different release, different branch, different ib, whatever), the most basic way is the following.  First list the commits you want to apply, for example with 

    git log --oneline $CMSSW_RELEASE

Then reset your area to the new starting point.  To use a new branch:

    git checkout -b new_starting_point

Or to re-use the current branch (note that this will overwrite your local history in this branch!):

    git reset --hard new_starting_point

Then cherry-pick your commits on top of the new starting point

    git cherry-pick hash1 hash2 hash3 ...

If you expect to run into any conflict, do the cherry-picking one commit at a time, and fix the conflicts as you go.  If you apply them all in one go, git should stop and prompt you to fix things along the way.

If you do not expect conflicts, and/or prefer a more automated way, you can rebase instead of cherry-picking: start from the point where you have done your development, and do:

    git rebase new_starting_point

Sometimes git gets confused while rebasing, and pulls in a lot more code in your local area than cherry-pick. This may not affect the commit history anyway, it will just make rebuilding slower.

Finally, if you need to force git to overwrite a remote branch when pushing, you can us the -f option or prepend a plus to the local branch name.  BE CAREFUL as this will completely replace the remote branch!

    git push -f my-cmssw local_branch:remote_branch

or

    git push my-cmssw +local_branch:remote_branch
