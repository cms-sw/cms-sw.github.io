CMSSW work pages
================

They include:

- Actual documentation.
- Various scripts to import log files sparse in /afs to the git repository. 

Importing log files to the repository.
======================================

A reasonable amount of processed log files, usually in json format, can be
stored in this git repository and hopefully be this will not cause scalability
issues thanks to the fact git is extremely good at compressing similar files.

This allows us to serve integration builds results via [Github
Pages](http://pages.github.com)

In order to populate the data directory:

```
git clone cms-sw.github.com
cd cms-sw.github.com
./process-logs --logdir <path-to-your-toplevel-log-directory>
make -j 20
git commit data -m'Results updated'
git push origin master
```
