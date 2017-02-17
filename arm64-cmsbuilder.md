```
    59  su - cmsbuild
    1	16:41	mkdir -p ~/.{ssh,globus}
     2	16:41	mkdir private
     3	16:42	scp -r techlab-arm64-moonshot-xgene-002.cern.ch:~/.ssh/* .
     4	16:43	scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/.ssh/* .
     5	16:43	scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/.ssh/ .
     6	16:43	mv .ssh/* .
     7	16:43	rm -rf .ssh/
     8	16:45	cd .ssh/
     9	16:45	rm -rf known_hosts
    10	16:46	cd private/
    11	16:46	ssh-copy-id cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch
    12	16:47	scp -r techlab-arm64-moonshot-xgene-002.cern.ch:~/private/ .
    13	16:47	scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/private/ .
    14	16:47	mv private/* .
    15	16:47	rm -rf private/
    16	16:47	cd ..
    17	16:47	cd .globus/
    18	16:48	scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/.globus/ .
    19	16:48	mv .globus/* .
    20	16:48	rm -rf .globus/
    21	16:48	ls
    22	16:48	cd
    23	16:49	scp -r techlab-arm64-moonshot-xgene-002.cern.ch:~/.gitconfig .

   60  scp -r techlab-arm64-moonshot-xgene-002.cern.ch:/etc/yum.repos.d /etc/
   61  ls /etc/yum.repos.d/
   62  yum -y install ntp
   63  systemctl enable ntp
   64  systemctl enable ntpd
   65  systemctl start ntpd
   66  scp -r techlab-arm64-moonshot-xgene-002.cern.ch:/etc/ntp.conf /etc/
   67  cat /etc/ntp.conf 
   68  systemctl restart ntpd
   69  scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:/etc/pki/rpm-gpg /etc/pki/
   70  ls /etc/pki/rpm-gpg/
   71  scp -r cmsbuild@techlab-arm64-thunderx-02:/etc/pki/rpm-gpg /etc/pki/
   72  ls /etc/pki/rpm-gpg/
   73  yum install glibc coreutils bash tcsh zsh perl tcl tk readline openssl ncurses e2fsprogs krb5-libs freetype fontconfig libstdc++ libidn libX11 libXmu libSM libICE libXcursor libXext libXrandr libXft mesa-libGLU mesa-libGL e2fsprogs-libs libXi libXinerama libXrender libXpm gcc-c++ libcom_err libXpm-devel libXft-devel libX11-devel libXext-devel mesa-libGLU mesa-libGLU-devel libGLEW glew perl-Digest-MD5 perl-ExtUtils-MakeMaker patch perl-libwww-perl krb5-libs krb5-devel perl-Data-Dumper perl-WWW-Curl texinfo hostname time perl-Carp perl-Text-ParseWords perl-PathTools perl-ExtUtils-MakeMaker perl-Exporter perl-File-Path perl-Getopt-Long perl-constant perl-File-Temp perl-Socket perl-Time-Local perl-Storable glibc-headers perl-threads perl-Thread-Queue perl-Module-ScanDeps perl-Test-Harness perl-Env perl-Switch perl-ExtUtils-Embed ncurses-libs perl-libs
   74  yum -y install git subversion bc finger ntp zip unzip voms-clients-cpp python-pip kstart
   75  pip install --upgrade pip
   76  pip install PyGithub
   77  yum -y install python-devel
   78  pip install PyGith
   79  pip install PyGithhub
   80  pip install PyGithub
   81  yum -y install lcg-CA
   82  yum -y install perl-LWP-Protocol-https
   83  yum -y install fetch-crl
   84  fetch-crl 
  
   93  rpm -iUvh http://linuxsoft.cern.ch/cern/slc65/updates/i386/RPMS/CERN-CA-certs-20160421-2.slc6.noarch.rpm
  
  100  yum -y install fuse setroubleshoot-server autofs fuse-devel gdb attr cvmfs-config-default
  101  rpm -iUv http://cvmrepo.web.cern.ch/cvmrepo/yum/cvmfs/EL/7.3/aarch64/cvmfs-2.3.2-1.el7.centos.aarch64.rpm
  102  scp -r cmsbuild@techlab-arm64-thunderx-02:/etc/cvmfs /etc/
  103  cat /etc/cvmfs/config.d/cms.cern.ch.local 
  104  systemctl start autofs
  105  cvmfs_config setup
  106  cvmfs_config chksetup
  107  cvmfs_config probe
  108  df -h
  109  mkdir -p /build/cmsbuild
  110  chown -R cmsbuild:zh /build/cmsbuild


```
