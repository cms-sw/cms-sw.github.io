```

mkdir -p /build/cmsbuild
chown -R cmsbuild:zh /build/cmsbuild

#as root user
scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:/etc/ntp.conf /etc/ntp.conf
scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:/etc/yum.repos.d /etc/yum.repos.d
scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:/etc/pki/rpm-gpg /etc/pki/rpm-gpg

#as cmsbuild user
mkdir -p ~/.{ssh,globus,private}
scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/.ssh ~/.ssh
scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/.gitconfig ~/.gitconfig
scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/.globus ~/.globus
scp -r cmsbuild@techlab-arm64-moonshot-xgene-002.cern.ch:~/private ~/private

yum install glibc coreutils bash tcsh zsh perl tcl tk readline openssl ncurses e2fsprogs krb5-libs freetype fontconfig libstdc++ libidn libX11 libXmu libSM libICE libXcursor libXext libXrandr libXft mesa-libGLU mesa-libGL e2fsprogs-libs libXi libXinerama libXrender libXpm gcc-c++ libcom_err libXpm-devel libXft-devel libX11-devel libXext-devel mesa-libGLU mesa-libGLU-devel libGLEW glew perl-Digest-MD5 perl-ExtUtils-MakeMaker patch perl-libwww-perl krb5-libs krb5-devel perl-Data-Dumper perl-WWW-Curl texinfo hostname time perl-Carp perl-Text-ParseWords perl-PathTools perl-ExtUtils-MakeMaker perl-Exporter perl-File-Path perl-Getopt-Long perl-constant perl-File-Temp perl-Socket perl-Time-Local perl-Storable glibc-headers perl-threads perl-Thread-Queue perl-Module-ScanDeps perl-Test-Harness perl-Env perl-Switch perl-ExtUtils-Embed ncurses-libs perl-libs state=latest update_cache=yes
yum -y install git subversion bc finger ntp
yum -y install zip unzip
systemctl enable ntp
systemctl enable ntpd
systemctl start ntpd
yum install voms-clients-cpp
yum install java-1.8.0-openjdk
yum install kstart
yum -y install python-pip
yum -y install python-devel
pip install --upgrade pip
pip install PyGithub
yum -y install lcg-CA
yum -y install perl-LWP-Protocol-https
yum -y install fetch-crl
fetch-crl 
yum -y install CERN-CA-certs
yum -y install fuse setroubleshoot-server autofs
yum -y install fuse-devel
yum -y install gdb
yum -y install attr

rpm -iUv http://cvmrepo.web.cern.ch/cvmrepo/yum/cvmfs/EL/7.3/aarch64/cvmfs-2.3.2-1.el7.centos.aarch64.rpm

yum install cvmfs cvmfs-config-default
#rpm -iUv http://cvmrepo.web.cern.ch/cvmrepo/yum/cvmfs-config/EL/7.3/x86_64/cvmfs-config-none-1.0-1.noarch.rpm
#rpm -iUv https://ecsft.cern.ch/dist/cvmfs/cvmfs-config/cvmfs-config-default-1.3-1.noarch.rpm
#copy cvmfs confgiuration
scp -r cmsbuild@cmsbuild02.cern.ch:/etc/cvmfs /etc/cvmfs
service autofs start
#set /etc/cvmfs/default.d/cms.cern.ch.local
cvmfs_config setup
service autofs restart
cvmfs_config probe
df -h
ls /cvmfs/cms.cern.ch/SITECONF/local/Jobconfig



```
