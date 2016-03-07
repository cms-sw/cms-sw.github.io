##Workflow for pull requests to CMSSW (Draft)

### Before your pull request


### Initial pull request 
   - [This tutorial](tutorial.html) provides instructions for making a pull request to CMSSW
   - New developments should be always submitted to the development release of CMSSW. The default in the CMSSW repository is always the development release.
   
### Code review
   - Once your pull request is submitted, it is assigned a set of categories (e.g., "reconsturction") based on which packages have been changed.
   - The responsibles for those categories get an automatic email (from cmsbuild) asking them to review the proposed changes. Until their review is complete, your pull request has a label that indicates it is waiting for their signature (e.g., "reconstruction-pending")
   - In addition, your PR will get labels for "tests-pending", "comparisons-pending" and "orp-pending". These are explained in the following steps.
   - Code managers can trigger a set of standard pull request tests by responding to the pull request issue in github with "please test"
   - After a few hours, the results of these tests are available ("tests-approved" label), including some low statistics physics comparisons ("comparisons-available" label). You might find it useful to check these results in case of problems. Sometimes these tests are affected by problems in the underlying integration build or computing infrastructure. If the errors do not appear to be from your pull request, do not worry.
   - Code review can come via comments on the proposed changes or other discussion (typically in your github issue). Once each reviewing group is satisfied, they will sign your pull request ("+1"), and the corresponding label changes from "pending" to "approved" (e.g., "reconstruction-approved")
   - In case of no answers or slow answers from groups, it is useful to follow up either in your github issue, via mail or via the groups regular meeting
   - The last approval is from the release management team ("orp-approved"), after which your pull request will enter the CMSSW repository.

### Check the Integration Build
   - Twice per day, we run a more complete set of tests. The main web page for these results is [here](https://cmssdt.cern.ch/SDT/html/showIB.html). You can check this page a day after your pull request is accepted to check for issues with your pull request. As with the IB tests, there can be existing problems in the integration builds that will not be related to your pull request or other recently accepted pull requests. You can look at how the test results have changed from day to day to help decide if there are problems created by your pull request.
   - 
### Backporting

