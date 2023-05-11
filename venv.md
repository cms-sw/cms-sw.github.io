# Python virtual environment in CMSSW

The CMSSW environment can be extended to act as a Python virtual environment.
Assuming you are already in your CMSSW working area and have called `cmsenv`, execute the following commands:
```bash
scram-venv
cmsenv
```
Subsequently, when returning to the same CMSSW working area, just calling `cmsenv` will automatically activate the virtual environment.

Once the virtual environment is set up, any `pip3` commands will automatically use the directories `$CMSSW_BASE/venv/$SCRAM_ARCH/[bin,include,lib]`.

## Background

The implementation of Python virtual environments in CMSSW is based on the modern Python3 specification given in [PEP 405](https://peps.python.org/pep-0405/#specification).

It relies on the use of `include-system-site-packages` in `pyvenv.cfg` to identify Python packages distributed as part of the base CMSSW release (on cvmfs) as read-only.
This is accomplished via the use of `sitecustomize.py` when Python3 is built for CMSSW.

## Compatibility

`scram-venv` works with any CMSSW version that includes Python3.
Full compatibility starts with `CMSSW_10_2_X`.

### `CMSSW_10_1_X` instructions

`CMSSW_10_1_X` has Python3 but not `pip3`, so some extra steps are required:
```bash
python3 -m ensurepip
python3 -m pip install --upgrade pip
```

Subsequently, the command `python3 -m pip` should be used rather than `pip3`.

## Usage with CRAB

CRAB support is currently under investigation. Please check back later!
