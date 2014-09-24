---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
redirect_from:
 - /cmssw/tutorial-proxy.html
---

## Tutorial: how to use git through a proxy

This tuturial will explain how to use git through a proxy, for example if you are
behind a firewall or on a private network.

The examples are valid for connections inside the .cms network at Point 5, but it
should be simple to adapt them to other configurations.


### What kind of proxy

The most common are an HTTP proxy, and a SOCKS5 proxy - for example, one opened with
the ssh -D command, documented in [ssh(1)](http://www.openbsd.org/cgi-bin/man.cgi?query=ssh&sektion=1).


### How to open a SOCKS proxy through an SSH tunnel

The [ssh command](http://www.openssh.com/) distributed with most Unix-like systems
can open a SOCKS proxy on the local machine and forward all connections through the
ssh tunnel.

For example

    ssh -f -N -D 1080 cmsusr.cms

will connect to the host `cmsusr.cms`, open a SOCKS proxy on the local host on
port 1080 (`-D 1080`), and put the process in background after a successful
connection (`-f -N`).


### How to connect to a git repository using the SSH protocol

If the remote has a format like

    git@github.com:cms-sw/cmssw.git
    ssh://git@github.com/cms-sw/cmssw.git

then you are connecting to the git server using the [SSH protocol](http://git-scm.com/book/en/Git-on-the-Server-The-Protocols#The-SSH-Protocol).

In this case, git relis on ssh to handle the connection; in order to connect
through a SOCKS proxy you have to configure ssh itself, setting the `ProxyCommand`
option in your ~/.ssh/config file:

    Host github.com
        User                    git
        ProxyCommand            nc -x localhost:1080 %h %p

For more information, see [ssh_config(5)](http://www.openbsd.org/cgi-bin/man.cgi?query=ssh_config&sektion=5&manpath=OpenBSD+Current&arch=amd64&format=html).


### How to connect to a git repository using the HTTP or HTTPS protocols

If the remote has a format like

    http://github.com/cms-sw/cmssw.git
    https://github.com/cms-sw/cmssw.git

then you are connecting to the git server using the HTTP or HTTPS protocols.
In the old days, this used to be a [dumb protocol](http://git-scm.com/book/en/Git-on-the-Server-The-Protocols#The-HTTP/S-Protocol),
but since git 1.6.6 it uses a [smart protocol](http://git-scm.com/blog/2010/03/04/smart-http.html)
similar to that used by SSH or GIT.

In this case git uses libcurl to handle the connection; the version of git bundled
with CMSSW supports different kinds of proxies: SOCKS4, SOCKS4a, SOCKS5, and HTTP/HTTPS.
In order to connect through any proxy supported by libcurl, you can set the `http.proxy` 
option:

    git config --global http.proxy socks5://localhost:1080

For more information, see the `--proxy` option in [curl(1)](http://curl.haxx.se/docs/manpage.html)
and the `http.proxy` entry in [git-config(1)](https://www.kernel.org/pub/software/scm/git/docs/git-config.html).


### How to connect to a git repository using the GIT protocol

If the remote has a format like

    git://github.com/cms-sw/cmssw.git

then you are connecting to the git server using the [GIT protocol](git-scm.com/book/en/Git-on-the-Server-The-Protocols#The-Git-Protocol).

In this case, it is possible to use a helper command to connect through any kind of proxy.
A simple script is included with CMSSW, to connect through a SOCKS5 proxy: `git-proxy`.
You can configure git to use it with

    git config --global core.gitproxy "git-proxy"
    git config --global socks.proxy "localhost:1080"

For more information, see `git-proxy --help`.
