```

  cp -r techlab-arm64-thunderx-02.cern.ch:/etc/pki/rpm-gpg /etc/pki
  393  scp -r cmsbuild@techlab-arm64-thunderx-02.cern.ch:/etc/pki/rpm-gpg /etc/pki
  394  ls /etc/pki/rpm-gpg/
  395  cd /etc/pki/rpm-gpg/
  396  mv rpm-gpg/RPM-GPG-KEY-CernVM .
  397  cd
  398  yum -y install ntp
  399  scp -r cmsbuild@techlab-arm64-thunderx-02.cern.ch:/etc/ntp.com /etc/ntp.conf
  400  scp -r cmsbuild@techlab-arm64-thunderx-02.cern.ch:/etc/ntp.com /etc/
  401  scp -r cmsbuild@techlab-arm64-thunderx-02.cern.ch:/etc/ntp.conf /etc/
  402  cat /etc/ntp.conf 
  403  yum install glibc coreutils bash tcsh zsh perl tcl tk readline openssl ncurses e2fsprogs krb5-libs freetype fontconfig libstdc++ libidn libX11 libXmu libSM libICE libXcursor libXext libXrandr libXft mesa-libGLU mesa-libGL e2fsprogs-libs libXi libXinerama libXrender libXpm gcc-c++ libcom_err libXpm-devel libXft-devel libX11-devel libXext-devel mesa-libGLU mesa-libGLU-devel libGLEW glew perl-Digest-MD5 perl-ExtUtils-MakeMaker patch perl-libwww-perl krb5-libs krb5-devel perl-Data-Dumper perl-WWW-Curl texinfo hostname time perl-Carp perl-Text-ParseWords perl-PathTools perl-ExtUtils-MakeMaker perl-Exporter perl-File-Path perl-Getopt-Long perl-constant perl-File-Temp perl-Socket perl-Time-Local perl-Storable glibc-headers perl-threads perl-Thread-Queue perl-Module-ScanDeps perl-Test-Harness perl-Env perl-Switch perl-ExtUtils-Embed ncurses-libs perl-libs
  404  yum -y install git subversion bc finger
  405  yum -y install zip unzip
  420  yum install java-1.8.0-openjdk kstart python-pip
  421  yum -y install kstart
  422  pip install --upgrade pip
  423  pip install PyGithub
  424  yum -y install lcg-CA
  425  yum -y install perl-LWP-Protocol-https
  426  yum -y install fetch-crl
  427  fetch-crl 
  428  yum -y install CERN-CA-certs
  431  yum -y install fuse setroubleshoot-server autofs
  432   yum -y install fuse-devel gdb attr
  433  yum install cvmfs-config-default
  437  rpm -iUv http://cvmrepo.web.cern.ch/cvmrepo/yum/cvmfs-testing/EL/7/ppc64le/cvmfs-2.3.3-1.el7.centos.ppc64le.rpm
  438  yum install autofs
  439  service autofs start
  440  cvmfs_config setup
  441  cd
  442  cd /etc/cvmfs/
  443  scp -r cmsbuild@techlab-arm64-thunderx-02.cern.ch:/etc/cvmfs/* .
  444  ls
  445  cat config.d/cms.cern.ch.local 
  446  cvmfs_config chksetup
  447  cvmfs_config probe
  448  df -h
  449  mkdir -p /build/cmsbuild
  450  chown -R cmsbuild:zh /build/cmsbuild
  451  cd
  452  ls /build/cmsbuild/
  453  cd /build/cmsbuild/
  454  scp -r cmsbuild@techlab-arm64-thunderx-02.cern.ch:/build/cmsbuild/cmsbuild.keytab .
  455  ls -ld /build/cmsbuild/
  456  yum search kstart
  457  yum install kstart
  458  rpm -iUv ftp://195.220.108.108/linux/fedora-secondary/releases/25/Everything/ppc64le/os/Packages/k/kstart-4.1-8.fc24.ppc64le.rpm
  459  rpm -ql kstart


```
