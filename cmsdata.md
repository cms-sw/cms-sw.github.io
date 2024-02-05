# How-to test CMSSW data files

* Testing Data Files:

  *  Begin by [creating](https://twiki.cern.ch/twiki/bin/view/CMSPublic/SWGuideScram) a CMSSW project area.
  *  [Check out](http://cms-sw.github.io/faq.html#how-do-i-checkout-one-or-more-packages) the specific package to which the data files belong.
  *  Place the new or updated data files inside the `<subsystem>/<package>/data` directory.
  *  Run the necessary tests
  *  Notice: FileInPath mechanism/utils can be used to load these data files. One can find many examples for FileInPath in cmssw github or in TWiki: [1](https://twiki.cern.ch/twiki/bin/view/CMSPublic/SWGuideAboutPythonConfigFile) [2](https://twiki.cern.ch/twiki/bin/view/CMSPublic/SWGuideEdmFileInPath).

* Publishing Changes:

    * If the GitHub repository `<subsystem>-<package>` under [cms-data organization](https://github.com/cms-data) already exists:
      *  Proceed with the PR to update the repository with the latest data files.

    * If the repository does not exist:
      *  Open an issue for main [CMSSW repo](https://github.com/cms-sw/cmssw/) with the title: `Create repository <subsystem>/<package>`.
      *  Once the issue is fully signed, the repository will be automatically generated.
