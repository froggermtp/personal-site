---
title: How to Build an Alpine Linux Package
date: 2021-05-02
description: An introduction to building Alpine Linux packages
mainImage: alpine-mountain.jpg
smallImage: alpine-mountain-small.jpg
mainImageAltText: A mountain landscape
---

[The Alpine Linux wiki already has a decent explanation about how to build packages](https://wiki.alpinelinux.org/wiki/Creating_an_Alpine_package); however, I wanted throw something together a little more conversational. This writeup should get you building a package quickly. The only requirement to follow along is a working Alpine Linux installation. I'll strongly imply using Docker, cause that's what I've used. Regardless of how your setup, the general steps will be same. There's just less setup with Docker.

## APKBUILD

The main thing we'll need is an APKBUILD file.

For my own adventure, I didn't need to make an APKBUILD file from scratch. So, I'll have less to say about that. Thus, I'm not going to attempt to cover all the details of the APKBUILD file here. [You can glance over the official documentation](https://wiki.alpinelinux.org/wiki/APKBUILD_Reference) and [there are plenty of examples in the official repository.](https://gitlab.alpinelinux.org/alpine/aports/-/tree/master) 

Instead, I'll go over a high level overview and show how to generate a patch file. Patch files allow us to make modifications to the source files, without having those changes live in a repo. This concept is useful if we need to make some specific change to our Alpine build that wouldn't be useful anywhere else--or maybe you can't get the repo owners to make the change for some reason. Regardless, we can still tweak the build or the tests if needed.

[Here's an example of an APKBUILD file.](https://gitlab.alpinelinux.org/alpine/aports/-/blob/3.12-stable/main/brotli/APKBUILD) This one has most of the stuff going on, so it should be useful for learning a thing or two.

```bash
# Contributor: prspkt <prspkt@protonmail.com>
# Maintainer: prspkt <prspkt@protonmail.com>
pkgname=brotli
pkgver=1.0.9
pkgrel=1
pkgdesc="Generic lossless compressor"
url="https://github.com/google/brotli"
arch="all"
license="MIT"
makedepends="cmake python3-dev"
subpackages="$pkgname-doc $pkgname-static $pkgname-dev $pkgname-libs py3-$pkgname:py3"
source="$pkgname-$pkgver.tar.gz::https://github.com/google/brotli/archive/v$pkgver.tar.gz
	optimize-mips-s390x.patch
	build-tool-against-shared-lib.patch
	838.patch
	"

# secfixes:
#   1.0.9-r0:
#     - CVE-2020-8927

prepare() {
	default_prepare
	sed -i 's,/usr/bin/env bash,/bin/sh,' tests/*.sh
}

build() {
	if [ "$CBUILD" != "$CHOST" ]; then
		CMAKE_CROSSOPTS="-DCMAKE_SYSTEM_NAME=Linux -DCMAKE_HOST_SYSTEM_NAME=Linux"
	fi
	cmake  -B build \
		-DCMAKE_BUILD_TYPE=None \
		-DCMAKE_INSTALL_PREFIX=/usr \
		-DCMAKE_INSTALL_LIBDIR=lib \
		-DBUILD_SHARED_LIBS=True \
		-DCMAKE_C_FLAGS="$CFLAGS" \
		$CMAKE_CROSSOPTS
	make -C build
}

check() {
	make -C build test
}

package() {
	make -C build DESTDIR="$pkgdir" install

	local man; for man in docs/*.?; do
		install -D -m644 $man "$pkgdir"/usr/share/man/man${man##*.}/${man##*/}
	done
}

py3() {
	cd "$builddir"
	python3 setup.py install --prefix=/usr --root="$subpkgdir"
}

sha512sums="b8e2df955e8796ac1f022eb4ebad29532cb7e3aa6a4b6aee91dbd2c7d637eee84d9a144d3e878895bb5e62800875c2c01c8f737a1261020c54feacf9f676b5f5  brotli-1.0.9.tar.gz
59e934578ce23b703f8f25f56578f8e9fd1466a9844b6f67b542acd6496df352548e3762697dc3851cfd0f8e1bad170bfdaa3e8a87c901fe81e2f3042e3aee84  optimize-mips-s390x.patch
f4a7653a0f7ef69f059d7f744a48c7731c8e66f977ce2e66cd106f697e82aa1f005923898d216a3d8be143b2dc8db1927c09daedb981818e752640a333d75fbc  build-tool-against-shared-lib.patch
58ef677595f0db80b7d1353e42603cc30ef9b0b9530927f731ee31ac60ad9a3b2aac960a5cd100f8b10e547c9534e1ebf78c53550b52eed6fb3b7fb853317d20  838.patch"
```

You'll need to declare the package name, version, various sorts of dependencies, and the location of the source files. There some functions for starting the build, running the tests, and generating any needed subpackages. A subpackage is basically a way of splitting a single build into multiple packages. A common example may be to split the documentation into its own package, if it's quite large.

As mentioned, in the same directory as the APKBUILD file, you may see some patch files. These are basically diffs shoved into a text file. In fact, that's really all that they are. Assuming you're using git, we can literally use the {% highlightCode %}git diff{% endhighlightCode %} [command](https://git-scm.com/docs/git-diff) here.

```bash
# Using a POSIX shell here
git diff something...somethang > my-reasonably-named-patch-file.patch
```

I'm sure there's several ways to generate these things. But it's only a diff, nothing fancy. [We end up something that looks like this](https://gitlab.alpinelinux.org/alpine/aports/-/blob/3.12-stable/main/brotli/838.patch):

```git
Upstream: Yes
Reason: Fixes #11948
From 092446fafb4bfb81738853b7c7f76b293cd92a80 Mon Sep 17 00:00:00 2001
From: Evgenii Kliuchnikov <eustas.ru@gmail.com>
Date: Wed, 2 Sep 2020 10:49:49 +0200
Subject: [PATCH] Revert "Add runtime linker path to pkg-config files (#740)"

This reverts commit 31754d4ffce14153b5c2addf7a11019ec23f51c1.
---
 scripts/libbrotlicommon.pc.in | 2 +-
 scripts/libbrotlidec.pc.in    | 2 +-
 scripts/libbrotlienc.pc.in    | 2 +-
 3 files changed, 3 insertions(+), 3 deletions(-)

diff --git a/scripts/libbrotlicommon.pc.in b/scripts/libbrotlicommon.pc.in
index 10ca969e..2a8cf7a3 100644
--- a/scripts/libbrotlicommon.pc.in
+++ b/scripts/libbrotlicommon.pc.in
@@ -7,5 +7,5 @@ Name: libbrotlicommon
 URL: https://github.com/google/brotli
 Description: Brotli common dictionary library
 Version: @PACKAGE_VERSION@
-Libs: -L${libdir} -R${libdir} -lbrotlicommon
+Libs: -L${libdir} -lbrotlicommon
 Cflags: -I${includedir}
diff --git a/scripts/libbrotlidec.pc.in b/scripts/libbrotlidec.pc.in
index e7c3124f..6f8ef2e4 100644
--- a/scripts/libbrotlidec.pc.in
+++ b/scripts/libbrotlidec.pc.in
@@ -7,6 +7,6 @@ Name: libbrotlidec
 URL: https://github.com/google/brotli
 Description: Brotli decoder library
 Version: @PACKAGE_VERSION@
-Libs: -L${libdir} -R${libdir} -lbrotlidec
+Libs: -L${libdir} -lbrotlidec
 Requires.private: libbrotlicommon >= 1.0.2
 Cflags: -I${includedir}
diff --git a/scripts/libbrotlienc.pc.in b/scripts/libbrotlienc.pc.in
index 4dd0811b..2098afe2 100644
--- a/scripts/libbrotlienc.pc.in
+++ b/scripts/libbrotlienc.pc.in
@@ -7,6 +7,6 @@ Name: libbrotlienc
 URL: https://github.com/google/brotli
 Description: Brotli encoder library
 Version: @PACKAGE_VERSION@
-Libs: -L${libdir} -R${libdir} -lbrotlienc
+Libs: -L${libdir} -lbrotlienc
 Requires.private: libbrotlicommon >= 1.0.2
 Cflags: -I${includedir}
```

Optionally, you can put a note at the top to tell everyone why the h*ck your using a patch file. The example above did this. Documentation is fun and sometimes helpful? So maybe do the note thing?

## Generate the Checksums

Once we have our APKBUILD file setup, we'll need to generate checksums for the source files.

This process is a simple command: {% highlightCode %}abuild checksum{% endhighlightCode %}, which needs to be run from the same directory as the APKBUILD file. There is no need to download the source files manually as the abuild tool will handle that for us. Executing this via Docker isn't too different. Once again, [using this image](https://github.com/andyshinn/docker-alpine-abuild), we can fire off the command like so:

```bash
docker run --rm -it -v "$PWD":/home/builder/package andyshinn/alpine-abuild:v12 checksum
```

The program will modify your APKBUILD file, if needed. Obviously, if you've already generated a checksum before--and no source files have changed since the last invocation--then there's nothing to update here.

To note, you cannot skip this step. The build will fail later on if the checksums are not up to date with the source files.

## We Need Keys

In Alpine Linux, repositories and packages are signed using asymmetric cryptography. Assuming you want downstream users to be able to seamlessly install packages you've built, you'll need a way to manage keys. The alternative is to use this flag: {% highlightCode %}apk add --allow-untrusted package-name{% endhighlightCode %}. However, for our purposes, I'll assume we need to manage keys.

Luckily, Alpine makes this easy. First, we should set the identity of the packager, which is us (or your company, dog--whoever really). You can do this by either editing your /etc/abuild.conf file, or you can set the PACKAGER environment variable. There is a general format for the digital nametag. It will end up looking something like: {% highlightCode %}PACKAGER="Matthew Parris \<notmyrealemail@website.com\>"{% endhighlightCode %}.

Next, all we to need to do is run this command: {% highlightCode %}abuild-keygen -n{% endhighlightCode %}. Then, the public and private keys will both be generated in the {% highlightCode %}~/.abuild{% endhighlightCode %} directory for the current user. The Docker version isn't much different:

```bash
docker run --rm -it \
    --entrypoint abuild-keygen \
    -v "$PWD":/home/builder/.abuild \
    -e PACKAGER="Matthew Parris <notmyrealemail@website.com>" \
    andyshinn/alpine-abuild:v12 -n
```

The keys will then be placed in your current working directory.

In reality, we're generating RSA 256 bit keys--which you can create manually using openssl. [The abuild-keygen program is only a convenient script wrapping this behavior.](https://wiki.alpinelinux.org/wiki/Abuild_and_Helpers#Creating_keys_manually)

So how do we tell apk to trust our signed packages and repositories? We need to copy our public key into the /etc/apk/keys directory. Make sure you don't change the filename of the key. Now, we should be able to run the command {% highlightCode %}apk add package-name{% endhighlightCode %}, with no {% highlightCode %}--allow-untrusted{% endhighlightCode %} flag.

## Build It!

We have our APKBUILD file setup and our signing key ready. Let's execute the build!

For the build process, you should only need your private key in place. We can manually set the location of our private key with an environment variable PACKAGER_PRIVKEY. This variable will be set to a path like so: {% highlightCode %}PACKAGER_PRIVKEY=/path/to/private/key{% endhighlightCode %}. Like the other environment variables we've seen so far, you can also set this in your /etc/abuild.conf file. The environment variable technique is convenient when using Docker, which we'll set later.

Assuming everything is setup, we are about ready to build. You'll probably want to run the command {% highlightCode %}abuild-apk{% endhighlightCode %} to update the package cache--else abuild may not be able to download the packages. Next, fire off the command {% highlightCode %}abuild -r{% endhighlightCode %}. The abuild program should download the needed packages for the build, start the build, run the tests, and finally package the source code up into one or more apk files.

By default, the apk files will be placed in the ~/packages directory for the current user. This default can be changed by setting the environment variable REPODEST (or by modifying the /etc/abuild.conf file).

Let's go through what this would look like on Docker. You'll end up running a command similar to this:

```bash
docker run --rm -it \
	-e RSA_PRIVATE_KEY="$(cat /path/to/private/key.rsa)" \
	-e RSA_PRIVATE_KEY_NAME="key.rsa" \
	-v "$PWD:/home/builder/package" \
	-v "/where/you/want/to/put/the/packages:/packages" \
	andyshinn/alpine-abuild:v12
```

To note, this Dockerfile does change some of the environment variables around--like REPODEST is set to /packages. Also, make sure you run this from the directory that contains the APKBUILD file (or adjust the bind mount). I recommend looking at the Dockerfile itself and playing around with this. For example, you'll likely want to adjust the bind mounts or the key location.

And that's pretty much it. Anyways, for more detail than what I've given here, [check out the Alpine wiki.](https://wiki.alpinelinux.org/wiki/Category_talk:Developer_Documentation#Building_from_source_and_creating_packages) Thanks for reading.