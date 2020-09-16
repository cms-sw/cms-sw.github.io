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
- **```type bug[[-]fix]```**: L1/L2/requestor to declare it a bugfix
- **```type [new-]feature```**: L1/L2/requestor to declare it a new feature
- **```code-checks```**: By default cms-bot runs code-checks for all Pull Requests made for master branch. If for any reason code-checks tests are not run then one can force start code-checks using this command.
- **Ignoring PR tests results**: L1/L2/Release managers can issue this command or use test parameters to ignore some of the PR tests results e.g.
  - **```ignore clang-warnings```**: To ignore clang warnings results
  - **```ignore build-warnings```**: To ignore build warnings results
  - **```ignore none```**: Do not ignore any tests results.
- **Enable extra PR tests**: L1/L2/Release managers can issue this command or use test parameters to enable some exra PR tests e.g.
  - **```enable gpu```**: To run extra GPU tests
  - **```enable profiling```**: To run Igprof and generate resource graphs
  - **```enable none```**: To disable all extra tests
- **Allowing a user to trigger tests**: L1/L2/Release managers can issue this command to give test triggering rights to a user for a specific pull request
  - **```allow @username test rights```: Allows github user `username` to start the tests by using one of the `please test` commands.
- **Testing PR**: L1/L2 and developers listed <a href="https://github.com/cms-sw/cms-bot/blob/master/categories.py#L14">here</a> to start jenkins tests using ```[@cmsbuild,] please test [workflow <workflow>[,<workflow>[...]]] with (repository|)#PR[,(repository|)#PR[,...]] [for [CMSSW_QUEUE|SCRAM_ARCH][CMSSW_QUEUE/SCRAM_ARCH]]]```. Note that test parameters e.g workflows to test, extra pull requests to use etc. could also be provided via `test parameters` command. Any extra test parameter provided here will override default `test parameters`
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
[  - ]workflow(s|) = <workflow>[,<workflow>[,...]]
[  - ]pull_request(s|) = (repository|)#PR[,(repository|)#PR[,...]]
[  - ]release = release_cycle|architecture|release_cycle/architecture
[  - ]enable_test(s|) = gpu|none
[  - ]ignore_test(s|) = build-warnings|build-warnings|none
[  - ]full(_cmssw|) = true|false
[  - ]container = cmssw/cc7:amd64-dYYYYMMDD
[  - ](cms-|)addpkg = <cmssw_package>[,<cmssw_package>[,...]]
```
- **```[@cmsbuild,] please abort[ test]```**: Those who can request the test can ask to abort a running/on going test.
- **```[@cmsbuild,] please close```**: L1/L2/Release managers can issue this command to close a pull requests.
- **```release-note[s]: <multi line message>```**
  - L1/L2/requestor and developers listed <a href="https://github.com/cms-sw/cms-bot/blob/master/categories.py#L12">here</a> to provide release-notes. This command can be issued multiple time.
