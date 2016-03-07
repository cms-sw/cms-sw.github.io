##Workflow for pull requests to CMSSW (Draft)

### Before your pull request


### Initial pull request 
   - [This tutorial](tutorial.html) provides instructions for making a pull request to CMSSW
   - New developments should be always submitted to the development release of CMSSW. The default in the CMSSW repository is always the development release.
   
### Code review
   - Once your pull request is submitted, it is assigned a set of categories (e.g., "reconsturction") based on which packages have been changed.
   - The responsibles for those categories get an automatic email (from cmsbuild) asking them to review the proposed changes. Until their review is complete, your pull request has a label that indicates it is waiting for their signature (e.g., "reconstruction-pending")
   - Code managers can trigger a set of standard pull request tests by responding to the pull request issue in github with "please test"
   - After a few hours, the results of these tests are available, including some low statistics physics comparisons. 
   - 

### Check the 
### Backporting

