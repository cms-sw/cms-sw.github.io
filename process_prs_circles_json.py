#!/usr/bin/env python
from optparse import OptionParser
from glob import glob
from json import load
import json

COLOR_OF_STATE = {
  "pending": "#f89406",
  "approved": "#468847",
  "rejected": "#d9534f",
  "started": "#f89406",
  "hold": "#f89406",
}
LEVEL_OF_STATE = {
  "rejected": "1",
  "pending": "2", 
  "started": "2",
  "hold": "2",
  "approved": "3",
}

BLACKLISTED_CATEGORIES = ["pending", "code-checks", "orp", "tests", "comparison"]
WHITELISTED_STATES = [ "rejected",  "pending", "started", "hold", "approved"]

def getLabelsValidParts(labels):
  allParts = [x.rsplit("-", 1) for x in labels if "-" in x]
  filteredParts = [x for x in allParts if x[1] in WHITELISTED_STATES]
  return [x for x in filteredParts if x[0] not in BLACKLISTED_CATEGORIES]

if __name__ == "__main__":
  parser = OptionParser(usage="% og")
  parser.add_option("-p", "--prs", dest="prs_dir", help="Directory with Pull requests stats", type=str, default=None)
  parser.add_option("-g", "--org_prs", dest="org_prs_dir", help="Path to organisation pull request directory", type=str, default=None)
  opts, args = parser.parse_args()

  json_path_list = []
  prs = {}
  if opts.prs_dir:
    for p in opts.prs_dir.split(','):
      json_path_list.append(p + "/*/*.json")
  if opts.org_prs_dir:    
    for p in opts.org_prs_dir.split(','):
      json_path_list.append(p + "/*/*/*.json")
  
  json_list = []
  for i in json_path_list:
    for p in glob(i):
      json_list.append(p)
  temp_rezult_json = {}
  for pr_json in json_list:
    issue = load(open(pr_json))
    isClosed = ('closed_at' in issue and issue['closed_at']) and 1 or 0
    if isClosed : continue
    if not 'number' in issue: continue
    labels = issue['labels']
    if ('milestone' in issue and issue['milestone']):
      milestone = issue['milestone']
    else:
      milestone = "-"
    repository = '/'.join(pr_json.split('/')[-4:-2])  # prints org/repo, ex. cms-sw/cmssw
    labes_with_status = getLabelsValidParts(labels)
    prs = {
      'createdAt': int(issue['created_at']),
      # 'closedAt': ('closed_at' in issue and issue['closed_at']) and int(issue['closed_at']) or "NA",
      'label': str(issue['number']),
      # 'updateAt': int(issue['updated_at']),
      # 'number of comments': issue['comments'],
      # 'isClosed': isClosed,
      'repository': repository,
      # 'categories': [ x[0] for x in labes_with_status],
      'url': 'https://github.com/' + repository + '/pull/' + str(issue['number']),
      'urlRepo': 'https://github.com/' + repository
    }
    for l_w_s in labes_with_status:
      cat =  l_w_s[0]
      status = l_w_s[1]
      if cat not in temp_rezult_json:
        temp_rezult_json[cat] = {}
      if repository not in temp_rezult_json[cat]:
        temp_rezult_json[cat][repository] = []
      prs_copy = prs.copy()
      prs_copy['color'] = COLOR_OF_STATE[status]
      prs_copy['status_level'] = LEVEL_OF_STATE[status]
      temp_rezult_json[cat][repository].append(prs_copy)
    
  rezult_json = {'label': 'CMSSW', 'groups':[]}
  for (key, repos_w_PRs_dict) in temp_rezult_json.items():
    cat_obj = {'label': key, 'groups':[]}
    for (repo_key, prs_list) in repos_w_PRs_dict.items():
      repo_obj = {
        'label': repo_key.split('/')[0],
        'groups': sorted(sorted(prs_list, key=lambda pr: pr['label']), key=lambda pr: pr['status_level']),
        'weight': len(prs_list),
        'url': prs_list[0]['urlRepo']
      }
      cat_obj['groups'].append(repo_obj)

    size_l = [ x['weight'] for x in cat_obj['groups']]
    cat_obj['weight'] = sum(size_l)
    rezult_json['groups'].append(cat_obj)
    rezult_json['groups'].append({ "gap": True , "weight": 0.1})  # this creates a gap in cricles between top level groups

  print(json.dumps(rezult_json, indent=4))

