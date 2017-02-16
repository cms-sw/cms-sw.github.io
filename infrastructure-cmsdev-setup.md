
<b>To setup your own SLC6 ( tested on SLC6 - x86_64 [2017-01-24] ) based CMSDEV machine , please follow these instructions:</b>   

After creating/installing slc6 on your virtual/physical machine add some additional repos in `/etc/yum.repos.d/` with the content as shown by the cat command:

    cat <<EOF > /etc/yum.repos.d/carepo.repo 
    [carepo]
    gpgkey=file:///etc/pki/rpm-gpg/GPG-KEY-EUGridPMA-RPM-3
    name=IGTF CA Repository
    baseurl=http://linuxsoft.cern.ch/mirror/repository.egi.eu/sw/production/cas/1/current/
    gpgcheck=1
    enabled=1
    EOF
       
    cat <<EOF > /etc/yum.repos.d/cvmfs.repo 
    [cvmfs]
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CernVM
    name=CVMFS yum repository for el6
    baseurl=http://cern.ch/cvmrepo/yum/cvmfs/EL/6/x86_64
    includepkgs=cvmfs,cvmfs-keys,cvmfs-server,cvmfs-config-default
    gpgcheck=1
    enabled=1
    EOF
      
    cat <<EOF > /etc/yum.repos.d/cvmfs-config.repo 
    [cvmfs-config]
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CernVM
    name=CVMFS config yum repository for el6
    baseurl=http://cern.ch/cvmrepo/yum/cvmfs-config/EL/6/x86_64
    gpgcheck=1
    enabled=1
    EOF
    
Setup GPG keys:

```
    cat <<EOF > /etc/pki/rpm-gpg/RPM-GPG-KEY-CernVM 
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v2.0.14 (GNU/Linux)

mQGiBEuGP6YRBADV89cbF4uoEX89Q8uxOklIDVJhOJAFKZ33LSdzHv3iObnjo5w4
wbb8FiSir4oWgarAco4u0kR1yKjHJ33oVB2xmPOzW3NWoHI7aPF7tCgo7FY9hNoC
4NEkNycvbfSoCScsv2yY5qz2q2sY1LWGZGbUXjBvKbmASe9sJFKJV7NsmwCg76W/
aMazleHyDtooD8tk3ZWvpKcD/Rg51Oad+ZLc7h45wDMHpaDvOBeGoyp+k7JgQd87
HfXiJtg/Q6zyTwrV3vCQvMpw3GRjRkZBcPgRWb6rUk68dL8fa2cTxhISX5/DIQzc
mmuDa0EgCGGAKUZ4bHqaexFFnp/B+VKBPvJuxLa0cBDd6eewxNwtHJ90EaMeBzGd
6zU2BADO9YbXiEMqRkfVLnuvD5G31/WJZvffXCxspnSfg923DbILWa4vNW9MLMsK
IVHvyVr0mZF8xdyQNVPUX3/4uahKM4hwuFqdbyjuLGEIF3U73aIJ0+YDep/+I6yU
JGHnxy8Ex+a1XIhJ1hSI7+oalSdt+w/pE3+2MQyUfSDPSXVA3LQ+Q2VyblZNIEFk
bWluaXN0cmF0b3IgKGN2bWFkbWluKSA8Y2VybnZtLmFkbWluaXN0cmF0b3JAY2Vy
bi5jaD6IZAQTEQIAJAIbAwYLCQgHAwIDFQIDAxYCAQIeAQIXgAUCT18LigUJBbn/
ZAAKCRAjDTidiuRc5/BFAKCb13G8yxG75r3s63mHo5l9PNUKGwCfZpSlZrhBsVZ4
2DsKfLG1VQ+X8HW5Ag0ES4Y/qBAIAL3sWKXQKpbIOpwX+mNX2IV2XxNBM3KYjYOE
ii66i9apPo3BA39a9Wm9vh1kYIHTkh9Qqb8w53hc4ANkVT+cYzxXythGBjWoLtwC
zKCPrIb7RQJRc956Ot0q4qmlcUEGi5zefSIoJZR5jyR7rZS+1PNJYI05xY2+Eah1
u9UxrlzBH5DCsvUqTNK12WrPIibmLo8u+yIDJjwgh9O5YITC+et/g47NLfZdiAGP
LEjvJFRi7Ju+8ywO32dSVBPJQDktr5BC950DKZHA9n+sJ63iF3lP/aCTECpxxUqX
VVqioobwg5ytl60hw9I9sfwBP6z9PR90RcyT1l4giiBz9LV+KpcAAwUIAKeAxArG
aJxzWziKs7D8TTuE50Nw+S3RGhVzwSKy7183Z11iOEMqbm2/zwp65wFkntCKmLKD
nGsTgFNpstIyFwJmj34Axp7N3KGqXnTI+SIQd6VmzQ1phxfCOw8IGueOR6YI7S1G
YWt7DoseZKz4EWdvXCOkQAhbxq/HT2c3ihxsuxrErxz7QtNaYOFXiuLj3mYH9XaM
eEe8Pkl+yyRTvyUNlMIu/i79qf+QUlsi10nCUm88cSXQiKWOJ4GiUoT+jD7pN4oh
dALRVl0tl/EyPTw+asG3lQhPZ+solvJXp+i7KF7nwnyXDB63WNH15S1pQLMnqCuG
CFyegf6jnOJU0AqITwQYEQIADwIbDAUCT18MOQUJBboAEQAKCRAjDTidiuRc53P2
AJ9e1y70yIKwx6YmpDnwqWSE07Q6lACdEnem0DbLg9t+gkX/98driCP9Ifg=
=S7Dt
-----END PGP PUBLIC KEY BLOCK-----
EOF

              
    cat <<EOF > /etc/pki/rpm-gpg/GPG-KEY-EUGridPMA-RPM-3 
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v1.2.1 (GNU/Linux)

mQGiBELTiyYRBAD8goP2vWdf46e/stZvzgkBgJIFTMkHqZOpLqlCKTRGf4VHUASh
hdaktDtPx44fVO4E3zmugc7FP6xz/Hj3SqrUKt98vzF1EMb3i4UMCOBif+jM6VFS
N5N3gDEukNpP2h46LkNPbRPgAEeUmUZy4kTyB9xC/VA7d1sFx6sJZpCHiwCg7DNX
bj4Wuk5b+FyyCOg9++xabokEAJwt4+iyDX3uYZrkzh9hOXgrbBiyGrorAz3jOpqM
4L9+OKs5q9UsBwVXs5Zjei/irgxNjHNZCPo/V4f7o2CHxa88rn4GvstftSK6Oeey
8PaV3vdb5C5SRSbRgvxoUOo6eGVBpv8bVpKm//tNkTboHVsEAKQ1rYzx/m89aCZj
VCw5A/0c3E0rH4ZCeNg7yvta9ur3U7n/aFhzbU3wFLhcIndrPaufz5Sy/SYhOaS9
RgH36GbsmOq6JskdtSpBLq0768BUmrjcosgWl3REpMAZc4vvtb55WRYsrNSrqmXZ
/jHLjQkFHFdObIEcvxl+yIIwUxybMkvdxPZxnpGjF2gg6AoP7rQ5RVVHcmlkUE1B
IERpc3RyaWJ1dGlvbiBTaWduaW5nIEtleSAzIDxpbmZvQGV1Z3JpZHBtYS5vcmc+
iFkEExECABkFAkLTiyYECwcDAgMVAgMDFgIBAh4BAheAAAoJEMMtmcg827xx5PQA
oON2EH0dqfwNjGr1GlGyt1o5bWkzAJ0Y4QOPWaCIJFABoluX5nifjKWV9w==
=qXx1
-----END PGP PUBLIC KEY BLOCK-----
EOF
```


Install and configure CVMFS:

     yum -y install cvmfs cvmfs-config-default
     
     cat <<EOF > /etc/cvmfs/default.local
     CVMFS_REPOSITORIES=cms.cern.ch,grid.cern.ch,cms-ib.cern.ch
     CVMFS_HTTP_PROXY='DIRECT'
     EOF
  
    # cvmfs_config chksetup
    # cvmfs_config probe
    
    
    cat <<EOF > /etc/profile.d/scram.sh 
    source /cvmfs/cms.cern.ch/cmsset_default.sh
    EOF
    
    cat <<EOF > /etc/profile.d/scram.csh 
    source /cvmfs/cms.cern.ch/cmsset_default.csh
    EOF
     

Install osg client and other stuff:

     yum -y install https://repo.grid.iu.edu/osg/3.3/osg-3.3-el6-release-latest.rpm
     yum -y install yum-plugin-priorities
     yum -y install osg-wn-client
     yum -y install HEP_OSlibs_SL6 CERN-CA-certs git zip
     df -h
    
   
     
Install some add on tools:


     yum install gdb
     yum install git
     yum install python-pip
     pip install --upgrade pip
     
     yum install finger screen libXpm-devel libXft-devel krb5-devel subversion telnet readline-devel wget tk-devel tcl-devel
  

For testing , please create a release area by doing `scam project <CMSSW_9_0_0_pre4>` and then `cd` into that directory , run `cmsenv` and `voms-proxy-init` , followed by `runTheMatrix.py -i all -s`
