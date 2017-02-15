2  
    3  scp -r cmsbuild02@cern.ch:/etc-puppet.repos.d/* /etc/yum.repos.d/
    4  scp -r cmsbuild02.cern.ch:/etc-puppet.repos.d/* /etc/yum.repos.d/
    5  scp -r cmsbuild02.cern.ch:/etc-puppet.repos.d/ /etc/yum.repos.d/
    6  scp -r cmsbuild02.cern.ch:/etc/puppet.repos.d/ /etc/yum.repos.d/
    7  scp -r cmsbuild02.cern.ch:/etc/yum-puppet.repos.d/ /etc/yum.repos.d/
    8  ls /etc/yum.repos.d/
    9  cd /etc/yum.repos.d/
   10  ls
   11  mv yum-puppet.repos.d/* .
   12  y
   13  ls
   14  rm -rf yum-puppet.repos.d/
   15  mkdir /etc/cvmfs
   16  scp -r cmsbuild02.cern.ch:/etc/cvmfs /etc/cvmfs
   17  ls /etc/cvmfs/
   18  mv cvmfs ~
   19  mv cvmfs ~/
   20  ls
   21  cd
   22  mv /etc/cvmfs/cvmfs .
   23  rm -rf /etc/cvmfs/
   24  scp -r cmsbuild02.cern.ch:/etc/pki/rpm-gpg/* /etc/pki/rpm-gpg/
   25  ls /etc/pki/rpm-gpg/
   26  yum -y install cvmfs cvmfs-config-default
   27  mv cvmfs/* /etc/cvmfs/
   28  rm -rf /etc/cvmfs/*
   29  ls /etc/cvmfs/
   30  cd /etc/cvmfs/
   31  ls
   32  scp -r cmsbuild02.cern.ch:/etc/cvmfs/* .
   33  ls
   34  cvmfs_config setup
   35  cvmfs_config chksteup
   36  cvmfs_config chksetup
   37  cvmfs_config probe
   38  df -h
   39  cd ..
   40  cd
   41  cd /etc/profile.d/
   42  ls
   43  scp -r cmsbuild02.cern.ch:/etc/profile.d/scram.sh .
   44  scp -r cmsbuild02.cern.ch:/etc/profile.d/scram.csh .
   45  ls
   46  chmod +x scram.sh 
   47  chmod +x scram.csh 
   48  ls
   49   yum -y install https://repo.grid.iu.edu/osg/3.3/osg-3.3-el6-release-latest.rpm
   50  yum -y install yum-plugin-priorities
   51  yum -y install osg-wn-client
   52  yum -y install HEP_OSlibs_SL6 CERN-CA-certs git zip
   53  df -h
   54  cd ,,
   55  cd ..
   56  cd
   57  ls
   58  cd /tmp/CMSSW_9_0_0_pre4/x/
   59  ls
   60  top
   61  ls
   62  cat runall-report-step123-.log 
   63  df -h
   64  cvmfs_config probe
   65  df -h
   66  cat runall-report-step123-.log 
   67  cd /tmp/CMSSW_9_0_0_pre4/x
   68  cat runall-report-step123-.log 
   69  top
   70  ls /tmp/CMSSW_9_0_0_pre4/x/
   71  w
   72  top
   73  df -h
   74  cvmfs_config probe
   75  df -h
   76  ls /tmp/CMSSW_9_0_0_pre4/x/
   77  top
   78  ls /tmp/CMSSW_9_0_0_pre4/x/
   79  cvmfs_config killall
   80  df -h
   81  yum -y install CERN-CA-Certs
   82  yum install CERN-CA-certs
   83  yum install gdb
   84  yum install git
   85  yum install PyGitHub
   86  yum install Python-Pip
   87  yum install PyPip
   88  yum search pip
   89  yum install python-pip
   90  pip install --upgrade pip
   91  pip install PyGitHub
   92  yum -y install python-devel
   93  pip install PyGitHub
   94  yum install HEP_OSlibs_SL6
   95  yum install finger screen libXpm-devel libXft-devel krb5-devel subversion telnet readline-devel wget tk-devel tcl-devel
   96  yum install docker
   97* chkconfig docker
   98  yum search docker
   99  yum install docker-io
  100  yum remove docker
  101  yum install docker-io
  102  docker info
  103  yum remove docker-io
  104  yum search docker
  105  yum install docker
  106  docker info
  107  service docker start
  108  rpm -ql docker
  109  rpm -qa docker
  110  yum remove docker
  111  history 
  112  ls
  113  history >install-cmsdev.txt
