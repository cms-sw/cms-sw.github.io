```

  scp -r cmsbuild@techlab-arm64-thunderx-02.cern.ch:/etc/pki/rpm-gpg /etc/pki
  cd /etc/pki/rpm-gpg/
  mv rpm-gpg/RPM-GPG-KEY-CernVM .
  yum -y install ntp
  scp -r cmsbuild@techlab-arm64-thunderx-02.cern.ch:/etc/ntp.conf /etc/
  yum install glibc coreutils bash tcsh zsh perl tcl tk readline openssl ncurses e2fsprogs krb5-libs freetype fontconfig libstdc++ libidn libX11 libXmu libSM libICE libXcursor libXext libXrandr libXft mesa-libGLU mesa-libGL e2fsprogs-libs libXi libXinerama libXrender libXpm gcc-c++ libcom_err libXpm-devel libXft-devel libX11-devel libXext-devel mesa-libGLU mesa-libGLU-devel libGLEW glew perl-Digest-MD5 perl-ExtUtils-MakeMaker patch perl-libwww-perl krb5-libs krb5-devel perl-Data-Dumper perl-WWW-Curl texinfo hostname time perl-Carp perl-Text-ParseWords perl-PathTools perl-ExtUtils-MakeMaker perl-Exporter perl-File-Path perl-Getopt-Long perl-constant perl-File-Temp perl-Socket perl-Time-Local perl-Storable glibc-headers perl-threads perl-Thread-Queue perl-Module-ScanDeps perl-Test-Harness perl-Env perl-Switch perl-ExtUtils-Embed ncurses-libs perl-libs
  yum -y install git subversion bc finger
  yum -y install zip unzip
  yum install java-1.8.0-openjdk python-pip python-devel
  rpm -iUv ftp://195.220.108.108/linux/fedora-secondary/releases/25/Everything/ppc64le/os/Packages/k/kstart-4.1-8.fc24.ppc64le.rpm
  pip install --upgrade pip
  pip install PyGithub
  yum -y install lcg-CA
  yum -y install perl-LWP-Protocol-https
  yum -y install fetch-crl
  fetch-crl 
  yum -y install CERN-CA-certs
  yum -y install fuse setroubleshoot-server autofs
  yum -y install fuse-devel gdb attr
  yum install cvmfs-config-default
  rpm -iUv http://cvmrepo.web.cern.ch/cvmrepo/yum/cvmfs-testing/EL/7/ppc64le/cvmfs-2.3.3-1.el7.centos.ppc64le.rpm
  yum install autofs
  service autofs start
  cvmfs_config setup
  scp -r cmsbuild@techlab-arm64-thunderx-02.cern.ch:/etc/cvmfs/* .
  cat config.d/cms.cern.ch.local 
  cvmfs_config chksetup
  cvmfs_config probe
  mkdir -p /build/cmsbuild
  chown -R cmsbuild:zh /build/cmsbuild
  
```
