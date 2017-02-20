```
   su - cmsbuild
   cd ~
   mkdir -p ~/.{ssh,globus}
   mkdir private
   scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/.ssh/ .
   scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/private/ .
   scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/.globus/ .
   scp -r techlab-arm64-moonshot-xgene-002.cern.ch:~/.gitconfig .
   sudo su -
   scp -r techlab-arm64-moonshot-xgene-002.cern.ch:/etc/yum.repos.d /etc/
   yum -y install ntp
   scp -r techlab-arm64-moonshot-xgene-002.cern.ch:/etc/ntp.conf /etc/
   systemctl enable ntpd
   systemctl start ntpd
   scp -r cmsbuild@techlab-arm64-thunderx-02:/etc/pki/rpm-gpg/ /etc/pki/
   yum install glibc coreutils bash tcsh zsh perl tcl tk readline openssl ncurses e2fsprogs krb5-libs freetype fontconfig libstdc++ libidn libX11 libXmu libSM libICE libXcursor libXext libXrandr libXft mesa-libGLU mesa-libGL e2fsprogs-libs libXi libXinerama libXrender libXpm gcc-c++ libcom_err libXpm-devel libXft-devel libX11-devel libXext-devel mesa-libGLU mesa-libGLU-devel libGLEW glew perl-Digest-MD5 perl-ExtUtils-MakeMaker patch perl-libwww-perl krb5-libs krb5-devel perl-Data-Dumper perl-WWW-Curl texinfo hostname time perl-Carp perl-Text-ParseWords perl-PathTools perl-ExtUtils-MakeMaker perl-Exporter perl-File-Path perl-Getopt-Long perl-constant perl-File-Temp perl-Socket perl-Time-Local perl-Storable glibc-headers perl-threads perl-Thread-Queue perl-Module-ScanDeps perl-Test-Harness perl-Env perl-Switch perl-ExtUtils-Embed ncurses-libs perl-libs
   yum -y install git subversion bc finger ntp zip unzip voms-clients-cpp python-pip kstart
   yum install java-1.8.0-openjdk
   pip install --upgrade pip
   yum -y install python-devel   
   pip install PyGithub
   yum -y install lcg-CA
   yum -y install perl-LWP-Protocol-https
   yum -y install fetch-crl
   rpm -iUvh http://linuxsoft.cern.ch/cern/slc65/updates/i386/RPMS/CERN-CA-certs-20160421-2.slc6.noarch.rpm
   yum -y install fuse setroubleshoot-server autofs fuse-devel gdb attr cvmfs-config-default
   rpm -iUv http://cvmrepo.web.cern.ch/cvmrepo/yum/cvmfs/EL/7.3/aarch64/cvmfs-2.3.2-1.el7.centos.aarch64.rpm
   #scp -r cmsbuild@techlab-arm64-thunderx-02:/etc/cvmfs /etc/
   cat << EOF > /etc/cvmfs/default.local 
   CVMFS_QUOTA_LIMIT='2000'
   CVMFS_HTTP_PROXY='DIRECT'
   CVMFS_CACHE_BASE='/var/lib/cvmfs'
   CVMFS_FORCE_SIGNING='yes'
   CVMFS_REPOSITORIES='cms-ib.cern.ch,cms.cern.ch,'
   EOF
   cat << EOF > /etc/cvmfs/config.d/cms.cern.ch.local 
   export CMS_LOCAL_SITE=T2_CH_CERN
   EOF
   systemctl start autofs
   cvmfs_config setup
   cvmfs_config chksetup
   cvmfs_config probe
   mkdir -p /build/cmsbuild
   chown -R cmsbuild:zh /build/cmsbuild


```
