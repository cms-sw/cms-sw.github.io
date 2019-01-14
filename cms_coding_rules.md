# CMS Naming, Coding, And Style Rules

### By the CMS Ofﬂine Software Development Team

## Abstract
This document describes the naming, coding, and style rules, as well as design, coding and style recommendations for CMS software written in C++.


## Outline
#### [Introduction](https://github.com/cms-sw/cms-sw.github.io/new/code#1-introduction)
#### Naming Rules
#### Style Rules
#### Technical Coding Rules
#### Documentation Rules
#### Packaging Rules
#### Design and Coding Guidelines

## 1 -- Introduction
This document describes the CMS C++ software naming, coding, style and documentation rules and recommendations.
All CMS C++ software is expected to comply with the rules. The asterisk (*) after some rules indicates that there may be exceptional use cases where the rule may be violated with good justiﬁcation.
Coding rules are meant to prevent serious problems in software function, performance, maintainability, usability, and portability. 

## 2 -- Naming Rules
1. C++ header ﬁles use the sufﬁx .h, e.g. ```CaloCluster.h``` (*)
2. For C++ source ﬁles, the preferred sufﬁx  is .cc, e.g. CaloCluster.cc, though there are existing files using .cpp and .cxx suffixes. (*)
3. For a header file that contains a class, name that ﬁle after the class.
4. Name source ﬁles after the class.
5. For class, struct, type and enumeration names use upper class initials, e.g. GeometryBuilder.
6. For namespaces use lower case, e.g. namespace edm.
7. Start method names with lowercase, use upper case initials for following words, e.g. collisionPoint() (allowed exception: implementation of virtual methods inherited from external packages e.g. ProcessHits() method required by Geant4).
8. Start data member names with lower case. A trailing “_” is the preferred method to distinguish a data member from the getter method (e.g. momentum_).
9. Using “set” for a setter method is preferred, e.g. setMomentum(double m).
10. For a getter method, using the value name is preferred, e.g. momentum().
11. Do not use single character names, except for loop indices.
12. Do not use special characters, except for “_” where allowed.
13. Do not use “_” as ﬁrst character. Only use it as the last character for class data member names, not local variable names.
14. Do not use “__”.
15. Use clear and explanatory variable names.
