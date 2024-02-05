# How-to test CMSSW data files

* Testing Data Files:

  *  Begin by creating a CMSSW project area.
  *  Check out the specific package to which the data files belong.
  *  Place the new or updated data files inside the `<subsystem>/<package>/data` directory.
  *  Run the necessary tests. Files in `<subsystem>/<package>/data` can be used as if they were checked out from cms-data repository.

* Publishing Changes:

    * If the GitHub repository `cms-data/<subsystem>-<package>` already exists:
      *  Proceed with the PR to update the repository with the latest data files.

    * If the repository does not exist:
      *  Open an issue for main [CMSSW repo](https://github.com/cms-sw/cmssw/) with the title: `Create repository <subsystem>/<package> in cms-data`.
      *  Once the issue gains approval and is fully signed, the repository will be automatically generated.
