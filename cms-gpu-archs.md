# CMSSW GPU Support

By default `scram` will build CMSSW packages for all supported GPUs.
In `CMSSW_15_1_X` this means the following NVIDIA and AMD GPUs architectures:
  - NVIDIA Pascal architecture (`sm_60`: Tesla P100, Tesla P40, Quadro P6000, ...)
  - NVIDIA Volta architecture (`sm_70`: Tesla V100, Quadro GV100)
  - NVIDIA Turing architecture (`sm_75`: Tesla T4, Quadro RTX)
  - NVIDIA Ampere architecture (`sm_80`: A100/A100X, A30/A30X, A40, A10, RTX A series)
  - NVIDIA Lovelace architecture (`sm_89`: L40/L40S, L4, RTX Ada Generation)
  - NVIDIA Hopper (`sm_90`: H100)
  - AMD Radeon Instinct MI100 (`gfx908`/ CDNA 1.0)
  - AMD Radeon Instinct MI200 series (`gfx90a`/ CDNA 2.0: MI200, MI210, MI250, MI250X)
  - AMD Radeon Instinct MI300 series (`gfx942`/ CDNA 3.0: MI300, MI325)
  - AMD Radeon Pro W7800/W7900 (`gfx1100`/ RDNA 3.0)
  - AMD Radeon Pro W7400/W7500/W7600 (`gfx1102`/ RDNA 3.0)
  - AMD Radeon Pro W6800/W6900 (`gfx1030`/ RDNA 2.0)

Compiling the CMSSW GPU-enabled modules for all these GPUs takes some time.
To speed up building in a local CMSSW development area it possible to configure `scram` to restrict support to only one GPU architecture (NVIDIA or AMD), specific GPUs, or disable PU support entirely.


### Enable or disable support for the CUDA back-end in alpaka modules
```bash
scram b enable-cuda
scram b disable-cuda
```

Note: this does not enable or disable CUDA globally, but only for alpaka-based modules.


### Configure SCRAM to build support for a list of NVIDIA GPUs
```bash
scram b enable-cuda:<comma-separated-compute-capabilities>
```
For example:
```bash
scram b enable-cuda:sm_75,sm_89         # NVIDIA Tesla T4, L40S/L4
```

Note: this affects native CUDA modules, and the CUDA back-end of alpaka-based modules.

The `cudaComputeCapabilities` command can be used to list the NVIDIA GPUs present in the current machine and their compute capability (`sm_...`).
For example:
```bash
cudaComputeCapabilities
   0     7.5    Tesla T4
```
indicates that GPU 0 is a Tesla T4 with compute capability 7.5 (`sm_75`).

As a shorthand, it is possible to configure SCRAM to (re)enable CUDA with support for the NVIDIA GPUs present in the system:
```bash
scram b enable-cuda:native
```

The SCRAM configuration for CUDA can be reset to the release default with:
```bash
scram b enable-cuda:reset
```


### Enable or disable support for the ROCm back-end in alpaka modules
```bash
scram b enable-rocm
scram b disable-rocm
```

Note: this does not enable or disable ROCm globally, but only for alpaka-based modules.


### Configure SCRAM to build support for a list of AMD GPUs
```bash
scram b enable-rocm:<comma-separated-gpu-architectures>
```
For example:
```bash
scram b enable-rocm:gfx1100             # Radeon Pro W7800/7900
scram b enable-rocm:gfx942:sramecc+     # Radeon Instinct MI300X
```

Note: this affects native ROCm modules, and the ROCm back-end of alpaka-based modules.

The `rocmComputeCapabilities` command can be used to list the AMD GPUs present in the current machine and their architecture (`gfx...`).
For example:
```bash
rocmComputeCapabilities
   0     gfx1100    AMD Radeon PRO W7800
```
indicates that GPU 0 is a Radeon Pro W7800 with GPU architecture `gfx1100`.

As a shorthand, it is possible to configure SCRAM to (re)enable ROCm with support for the AMD GPUs present in the system:
```bash
scram b enable-rocm:native
```

The SCRAM configuration for ROCm can be reset to the release default with:
```bash
scram b enable-rocm:reset
```

### Configure SCRAM to autodetect present GPUs

```bash
scram b enable-gpus:native
```

Enable or disable the alpaka CUDA or ROCm back-ends depending if any NVIDIA or AMD GPUs are present in the system, and configure SCRAM to build support only for the corresponding compute capabilities or architectures.
