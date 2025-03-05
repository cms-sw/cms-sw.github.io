# CMSSW Micro-Architecture Support for x86_64

Starting from `CMSSW_14_0_X`, releases are built with support for multiple micro-architectures on `x86_64`. 

**For `CMSSW_14_X`**:
- The default micro-architecture is `x86-64-v2`.
- An additional micro-architecture, `x86-64-v3`, is also available.
- To optimize time and resource usage, `SCRAM` is configured by default to use only `x86-64-v2`. 
- If you need `x86-64-v3` libraries and plugins in `CMSSW`, run:
  ```sh
  scram build enable-multi-targets
  ```
  in your development area. This enables `SCRAM` to build your checked-out packages for both micro-architectures and automatically select the best set of libraries at runtime.

**For `CMSSW_15_0_X` and Later**:
Starting with `CMSSW_15_0_X`, the following changes apply:
- Default Micro-Architecture: `x86-64-v3`
- Additional Micro-Architecture: `x86-64-v2`
- Runtime Environment Selection (`cmsenv`):
  - **Nodes with only `x86-64-v2` support**: The runtime environment will use `x86-64-v2` libraries and plugins.
  - **Nodes with `x86-64-v3` (or higher) support**: The runtime environment will use `x86-64-v3` libraries and plugins.
- Development Area Configuration:
  - **Nodes with only `x86-64-v2` support**: `SCRAM` will enable multi-microarchitecture support. Checked-out packages will be built for both `x86-64-v2` and `x86-64-v3`, with `SCRAM` selecting the best match at runtime.
  - **Nodes with `x86-64-v3` (or higher) support**: `SCRAM` will disable multi-microarchitecture support. Checked-out packages will be built only for `x86-64-v3`, and at runtime, `SCRAM` will use only `x86-64-v3` libraries.
- New Environment Variables Set by `SCRAM` (for `CMSSW_15_0_X` and later):
  - **SCRAM_DEFAULT_MICROARCH**: Specifies the default micro-architecture for the `CMSSW` release (e.g., `x86-64-v3` for `CMSSW_15_0_X`).
  - **SCRAM_MIN_SUPPORTED_MICROARCH**: Defines the minimum required micro-architecture for `CMSSW`.
    - If multi-microarchitecture support is enabled in the development area, this will be set to `x86-64-v2`.
    - Otherwise, it will be set to `x86-64-v3`
