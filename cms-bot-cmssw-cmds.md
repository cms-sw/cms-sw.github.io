For CMSSW **Pull requests**, following commands in first line of a comment are recognized
- **```+1|approve[d]|sign[ed]|+category```**: L1/L2's to approve it
- **```-1|reject[ed]|-category```**: L1/L2's to reject it
- **```assign <category>[,<category>[,...]]```**: Any L1/L2's to request signatures from other categories
- **```unassign <category>[,<category>[,...]]```**: Any L1/L2's to remove signatures from other categories
- **```hold```**: L1/all L2's/release manager/developers listed <a href="https://github.com/cms-sw/cms-bot/blob/master/categories.py#L11">here</a> to mark it as on hold
- **```unhold```**: L1/user who put this PR on hold
- **```merge```**: L1/release managers to merge this request
- **```urgent```**: L1/L2/requestor to mark it as an urgent request to be merged
- **```backport [of ]#<PR>```**: L1/L2/requestor to mark it as a backport request
- **```type gh-label-name(,gh-label-name,...)```**: L1/L2/requestor to add an extra label for this github Pull Request
  - **```type bug|bugfix|bug-fix```**: To add `bugfix` label
  - **```type [new-]feature|[new-]idea```**: To add `new-feature` lebal
  - **```type doc[umentation]|performance|improvements|performance-improvements```**: To add `documentation` and/or `performance-improvements` label
  - **```type lumi,hgcal,rpc```**: To add extra `lumi`, `hgcal` and `rpc` labels.
- **```type -gh-label-name(,-gh-label-name,...)```**: L1/L2/requestor to remove an already added label for this github Pull Request
- **```code-checks```**: By default cms-bot runs code-checks for all Pull Requests made for master branch. If for any reason code-checks tests are not run then one can force start code-checks using this command.
  - **```code-checks with cms.weekN.PR_hash/tool-conf-version```**: In case an external update is needed to run code-checks (e.g. due to interface changes in header files) then first run PR tests for cmsdist/external which should deploy externals on CVMFS. Then request the code-checks with the newly deployed externals tools configuration e.g. `code-checks with cms.week0_PR_01234567/47.0-cms2` (external tools configuration is available via cmsdist PR summary page).
  - **```code-checks and apply patch```**: This command can be used to run code-checks and apply the needed code-checks changes.
- **Ignoring PR tests results**: Anyone who can trigger tests can issue this command or use test parameters to ignore some of the PR tests results e.g.
  - **```ignore clang-warnings```**: To ignore clang warnings results
  - **```ignore build-warnings```**: To ignore build warnings results
  - **```ignore tests-rejected with (manual-override|ib-failure|external-failure)```**: To ignore test and relval failures:
    - `manual-override`: if the failure is not related to a given PR
    - `ib-failure`: if the failure also happens in IBs
    - `external-failure`: if the failure is caused by external factor
  - **```ignore none```**: Do not ignore any tests results.
- **Enable extra PR tests**: Anyone who can trigger tests can issue this command or use test parameters to enable some extra PR tests e.g.
  - **```enable gpu,threading,profiling,high_stats,nano```**: To run extra GPU, threading relval,profiling tests, high statistic relvals and/or nano tests.
  - **```enable profiling```**: To run Igprof and generate resource graphs
  - **```enable high_stats```**: To run high stats relvals tests
  - **```enable nano```**: To run tests for special nano workflows
  - **```enable none```**: To disable all extra tests
- **Allowing a user to trigger tests**: L1/L2/Release managers can issue this command to give test triggering rights to a user for a specific pull request
  - **```allow @username test rights```**: Allows github user **`username`** to start the tests by using one of the **`please test`** commands.
- **Testing PR**: L1/L2 and developers listed <a href="https://github.com/cms-sw/cms-bot/blob/master/categories.py#L14">here</a> to start jenkins tests using **```[@cmsbuild,] please test [workflow <workflow>[,<workflow>[...]]] with (repository|)#PR[,(repository|)#PR[,...]] [for [CMSSW_QUEUE|SCRAM_ARCH][CMSSW_QUEUE/SCRAM_ARCH]]]```**. Note that test parameters e.g workflows to test, extra pull requests to use etc. could also be provided via **`test parameters`** command. Any extra test parameter provided here will override default **`test parameters`**
  - **```[@cmsbuild,] please test```**: To start tests
  - **```[@cmsbuild,] please test with (repository|)#PR[,(repository|)#PR[,...]]```**: Run tests with extra PRs
  - **```[@cmsbuild,] please test workflow <workflow>[,<workflow>[...]]```**: Run tests with extra runTheMatrix workflows
  - **```[@cmsbuild,] please test workflow <workflow>[,<workflow>[...]] with (repository|)#PR[,(repository|)#PR[,...]]```**: Run tests with extra workflows, cmssw PRs and cmsdist PR
  - **```[@cmsbuild,] please test for CMSSW_11_0_ROOT6_X```**: Run tests using CMSSW_11_0_ROOT6_X IBs.
  - **```[@cmsbuild,] please test for CMSSW_11_0_DEVEL_X/slc7_amd64_gcc900```**: Run tests using CMSSW_11_0_DEVEL_X slc7_amd64_gcc900 IBs.
  - **```[@cmsbuild,] please test for slc7_amd64_gcc820```**: Run tests using slc7_amd64_gcc900 SCRAM_ARCH IBs.
  - **```[@cmsbuild,] please test workflow <workflow>[,<workflow>[...]] with (repository|)#PR[,(repository|)#PR[,...]] for CMSSW_11_0_ROOT6_X```**: Run tests with extra workflows, cmssw PRs and cmsdist PR using CMSSW_11_0_ROOT6_X IBs.
- **PR testing parameters**: Users who can trigger PR tests can also provide extra test parameters by commenting on the pull request. Comment should have the following format
```
test parameters:
[  - ](workflow|relval)(s|)(_gpu|_threading|_high-stats|_nano|_profiling|) = <workflow>[,<workflow>[,...]]
[  - ]pull_request(s|) = (repository|)#PR[,(repository|)#PR[,...]]
[  - ]release = release_cycle|architecture|release_cycle/architecture
[  - ]baseline = self|default         #default: Use production arch IB as baseline; self: use same release/arch for PR tests and baseline
[  - ]enable(_test(s|)|) = none,gpu,threading,profiling,high-stats,nano
[  - ]ignore_test(s|) = build-warnings|build-warnings|none
[  - ]skip_test(s|) = static|header   #skip static check and/or header consistency 
[  - ]full(_cmssw|) = true|false
[  - ]disable_poison = true|false
[  - ]container = cmssw/cc7(:amd64-dYYYYMMDD|)
[  - ]jenkins_node = jenkins-node-label
[  - ](cms-|)addpkg = <cmssw_package>[,<cmssw_package>[,...]]
[  - ](workflow|relval)_opt(ion|)(s|)(_input|_threading|_gpu|_high-stats|_nano|) = <runTheMatrix-extra-options for normal relval or special input/threading/gpu jobs>
```
- **```[@cmsbuild,] please abort[ test]```**: Those who can request the test can ask to abort a running/on going test.
- **```[@cmsbuild,] please close```**: L1/L2/Release managers can issue this command to close a pull requests.
- **```release-note[s]: <multi line message>```**
  - L1/L2/requestor and developers listed <a href="https://github.com/cms-sw/cms-bot/blob/master/categories.py#L12">here</a> to provide release-notes. This command can be issued multiple time.
