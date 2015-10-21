import re

def readRelValFile (name, zipFile):
  data = ""
  if zipFile:
    data = zipFile.read(name)
  else:        
    refFile = open(name)
    data = "".join(refFile.readlines())
    refFile.close()
  return data

def getRelValsFiles (inPath, searchReg, matchReg):
  from os.path import isdir
  files = []
  zipFile = None
  if isdir(inPath):
    from glob import glob
    for l in glob(inPath+"/"+searchReg):
      m = re.match(matchReg, l)
      if not m: continue
      files.append(l)
  else:
    from zipfile import ZipFile
    zipFile = ZipFile(inPath)
    for l in zipFile.namelist():
      m = re.match(matchReg, l)
      if not m: continue
      files.append(l)
  return (files, zipFile)

