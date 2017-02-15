To setup your own slc6 based cmsdev machine , please follow these instructions:   



      scp -r cmsbuild02@cern.ch:/etc-puppet.repos.d/* /etc/yum.repos.d/
      scp -r cmsbuild02.cern.ch:/etc-puppet.repos.d/* /etc/yum.repos.d/
      scp -r cmsbuild02.cern.ch:/etc-puppet.repos.d/ /etc/yum.repos.d/
      scp -r cmsbuild02.cern.ch:/etc/puppet.repos.d/ /etc/yum.repos.d/
      scp -r cmsbuild02.cern.ch:/etc/yum-puppet.repos.d/ /etc/yum.repos.d/
      ls /etc/yum.repos.d/
     cd /etc/yum.repos.d/
     ls
     mv yum-puppet.repos.d/* .
     y
     ls
     rm -rf yum-puppet.repos.d/
     mkdir /etc/cvmfs
     scp -r cmsbuild02.cern.ch:/etc/cvmfs /etc/cvmfs
     ls /etc/cvmfs/
     mv cvmfs ~
    mv cvmfs ~/
     ls
     cd
     mv /etc/cvmfs/cvmfs .
     rm -rf /etc/cvmfs/
     scp -r cmsbuild02.cern.ch:/etc/pki/rpm-gpg/* /etc/pki/rpm-gpg/
     ls /etc/pki/rpm-gpg/
     yum -y install cvmfs cvmfs-config-default
     mv cvmfs/* /etc/cvmfs/
     rm -rf /etc/cvmfs/*
     ls /etc/cvmfs/
     cd /etc/cvmfs/
     ls
     scp -r cmsbuild02.cern.ch:/etc/cvmfs/* .
     ls
     cvmfs_config setup
     cvmfs_config chksteup
     cvmfs_config chksetup
     cvmfs_config probe
     df -h
     cd ..
     cd
     cd /etc/profile.d/
     ls
     scp -r cmsbuild02.cern.ch:/etc/profile.d/scram.sh .
     scp -r cmsbuild02.cern.ch:/etc/profile.d/scram.csh .
     ls
     chmod +x scram.sh 
     chmod +x scram.csh 
     ls
      yum -y install https://repo.grid.iu.edu/osg/3.3/osg-3.3-el6-release-latest.rpm
     yum -y install yum-plugin-priorities
     yum -y install osg-wn-client
     yum -y install HEP_OSlibs_SL6 CERN-CA-certs git zip
     df -h
     cd ,,
     cd ..
     cd
     ls
     cd /tmp/CMSSW_9_0_0_pre4/x/
     ls
     top
     ls
     cat runall-report-step123-.log 
     df -h
     cvmfs_config probe
     df -h
     cat runall-report-step123-.log 
     cd /tmp/CMSSW_9_0_0_pre4/x
     cat runall-report-step123-.log 
     top
     ls /tmp/CMSSW_9_0_0_pre4/x/
     w
    top
     df -h
     cvmfs_config probe
     df -h
     ls /tmp/CMSSW_9_0_0_pre4/x/
     top
     ls /tmp/CMSSW_9_0_0_pre4/x/
     cvmfs_config killall
     df -h
     yum -y install CERN-CA-Certs
     yum install CERN-CA-certs
     yum install gdb
     yum install git
     yum install PyGitHub
     yum install Python-Pip
     yum install PyPip
     yum search pip
     yum install python-pip
     pip install --upgrade pip
     pip install PyGitHub
     yum -y install python-devel
     pip install PyGitHub
     yum install HEP_OSlibs_SL6
     yum install finger screen libXpm-devel libXft-devel krb5-devel subversion telnet readline-devel wget tk-devel tcl-devel
  
