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
   chmod g+w /build
   USER=cmsbld
   useradd -U -m -s /bin/bash -d /home/$USER $USER
   mkdir /build/$USER
   chown -R $USER:$USER /build/$USER
   su - $USER
   cd ~
   rm -rf .ssh && mkdir .ssh
   echo "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAzHKZxVdp5tF54BJsEOgkQ6rPbhz2w4RznhPlqIM/kmZCL+HN51ofvQPgRWya9coDuuCy2eH5+yJvAZiKRqUlm2QcdUOUmCFYqQKE8WFQVCTGMyMByOHtkf3b+2LtrktIiPp01ElyqQjvoIE++bAmnwKuf3aaK70nmWhrIAQ6BrNfC0vxnx6OOwQcNIyqNHMmi5i49oEUYnwijqm24kngy/reY+ktG3+8fvuISzDru0RKO9pyrtrNg0O772kHY3/MB7GdIgwnJ/bkAvBLa7LEQS9D0EO9TLeJWy6+0IyP5lO0D0Ovillk+0RsWuj4cS7xNnE+xhe+aohuvCP0cwhYwQ== cmsbuild@lxbuild167.cern.ch" > .ssh/authorized_keys  
  
```
