#!/usr/bin/env python3
from sys import argv
from os.path import exists
import re
import json

cache = {"workflows" : {}, "avg" : {}}
for timefile in argv[1:]:
  if not exists(timefile): continue
  with open(timefile) as timeinfo:    
    data = json.load(timeinfo)
    for wf in data:
      if not wf in cache["workflows"]:
        cache["workflows"][wf]=[]
      cache["workflows"][wf].append(data[wf])

for wf in cache["workflows"]:
  a = int(sum(cache["workflows"][wf])/len(cache["workflows"][wf]))
  if not a in cache["avg"]:
    cache["avg"][a]=[]
  cache["avg"][a].append(wf)

print (json.dumps(cache, indent=2, sort_keys=True))
