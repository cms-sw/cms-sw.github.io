---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
---
# CMSSW Multi microarch releases

`CMSSW_14_0_X` and above releases are build for multiple micro-architectures support for `x86_64`.
`CMSSW_14_0, CMSSW_14_1 and CMSSW_14_2` use `x86-64-v2` as default micro-architecture while `x86-64-v3` is provided as an additional micro-architectures. In order to save time and resources, by default `SCRAM` is configured to used only `x86-64-v2`. But if you need to use `x86-64-v3` set of librairies/plugins of cmssw then you can run `scram build enable-multi-targets` in your developer area. This will allow scram to build your checked out packages for both micro-archs and automatiically select the best set of libraries at runtime.

Starting with CMSSW_15_0_X, we have the follow changes

- The default micro-architecture is `x86-64-v3`
- Additional micro-architecture is `x86-64-v2`
- Setting runtime environment in `CMSSW` release (e.g. running `cmsenv` directly from the release path) will automatically select the best micro-architecture e.g.
  - **Nodes with x86-64-v2 only support**: Runtime env will be set to use `x86-64-v2` set of libraries/plugins
  - **Nodes with x86-64-v3 and above support**:  Runtime env will be set to use `x86-64-v3` set of libraries/plugisn
- Creating developer area will also automatically enable/disable multi-microarchitecture support e.g.
  - **Nodes with x86-64-v2 only support**: `SCRAM` will create developer area with multi-microarchitecture support enabled. Any checked out packages will be build for both micro-architectures. At runtime `SCRAM` will selected the best matching micro-architecture
  - **Nodes with x86-64-v3 and above support**: `SCRAM` will create developer area with multi-microarchitecture support disabled. Any checked out packages will only be built for default (`x86-64-v3`) micro-architecture. At runtime `SCRAM` will only use default (`x86-64-v3`) micro-architecture libraries.
- `SCRAM` will also set following environment variables for `CMSSW_15_0` and above
  - **SCRAM_DEFAULT_MICROARCH**: Default micro-arch used for cmssw release e.g. for `CMSSW_15_0_X` it will be `x86-64-v3`
  - **SCRAM_MIN_SUPPORTED_MICROARCH**: Least required micro-arch to run cmssw e.g , for `CMSSW_15_0`, is developer area has multi-microarchitecture support enabled then `SCRAM_MIN_SUPPORTED_MICROARCH` will be set to `x86-64-v2` otherwise it will be `x86-64-v3`

[CMSDIST]: https://github.com/cms-sw/cmsdist
[PKGTOOLS]: https://github.com/cms-sw/pkgtools
[CMSSW]: https://github.com/cms-sw/cmssw
