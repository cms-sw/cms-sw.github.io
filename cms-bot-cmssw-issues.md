For CMSSW **Issues**, following commands in first line of a comment are recognized
- **```+1|approve[d]|sign[ed]|+category```**: L1/L2's to approve it
- **```-1|reject[ed]|-category```**: L1/L2's to reject it
- **```assign <category>[,<category>[,...]]```**: Any L1/L2's to request signatures from other categories
- **```unassign <category>[,<category>[,...]]```**: Any L1/L2's to remove signatures from other categories
- **```hold```**: L1/all L2's/release manager to mark it as on hold
- **```unhold```**: L1/user who put this PR on hold
