<b>To setup your own slc6 based cmsdev machine , please follow these instructions:</b>   

After creating/installing slc6 on your virtual/physical machine add some additional repos in `/etc/yum.repos.d/` with the content as shown by the cat command:

    #cat /etc/yum.repos.d/carepo.repo 
     [carepo]
     gpgkey=file:///etc/pki/rpm-gpg/GPG-KEY-EUGridPMA-RPM-3
     name=IGTF CA Repository
     baseurl=http://linuxsoft.cern.ch/mirror/repository.egi.eu/sw/production/cas/1/current/
     gpgcheck=1
     enabled=1
       
     # cat /etc/yum.repos.d/cvmfs.repo 
      [cvmfs]
      gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CernVM
      name=CVMFS yum repository for el6
      baseurl=http://cern.ch/cvmrepo/yum/cvmfs/EL/6/x86_64
      includepkgs=cvmfs,cvmfs-keys,cvmfs-server,cvmfs-config-default
      gpgcheck=1
      enabled=1
      priority=80
      proxy=_none_
      
      #cat /etc/yum.repos.d/cvmfs-config.repo 
       [cvmfs-config]
       gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CernVM
       name=CVMFS config yum repository for el6
       baseurl=http://cern.ch/cvmrepo/yum/cvmfs-config/EL/6/x86_64
       gpgcheck=1
       enabled=0
       priority=80
       proxy=_none
       
Setup GPG keys:
    
     scp -r cmsbuild02.cern.ch:/etc/pki/rpm-gpg/* /etc/pki/rpm-gpg/
     ls /etc/pki/rpm-gpg/


Install and configure CVMFS:

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

Install osg client:

     yum -y install https://repo.grid.iu.edu/osg/3.3/osg-3.3-el6-release-latest.rpm
     yum -y install yum-plugin-priorities
     yum -y install osg-wn-client
     yum -y install HEP_OSlibs_SL6 CERN-CA-certs git zip
     df -h
    
   
     
Install some add on tools:


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
  
