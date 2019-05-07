# CMS Naming, Coding, And Style Rules

### By the CMS Ofﬂine Software Development Team

## Abstract
This document describes the design, naming, coding, and style rules and recommendations for CMS software written in C++, plus a few guidelines for Python configuration.


## Outline
#### [1 -- Introduction](#1----introduction-1)
#### [2 -- Naming Rules](#2----naming-rules-1)
#### [3 -- Style Rules](#3----style-rules-1)
#### [4 -- Technical Coding Rules](#4----technical-coding-rules-1)
#### [5 -- Documentation Rules](#5----documentation-rules-1)
#### [6 -- Packaging Rules](#6----packaging-rules-1)
#### [7 -- Design and Coding Guidelines](#7----design-and-coding-guidelines-1)

## 1 -- Introduction
This document describes the CMS C++ software naming, coding, style, and documentation rules and recommendations.
All CMS C++ software is expected to comply with the rules. The asterisk (\*) after some rules indicates that there may be exceptional use cases where the rule may be violated with good justiﬁcation. Intentional violations must be documented in the code next to the violation.
Coding rules are meant to prevent serious problems in software function, performance, maintainability, usability, and portability. The Packaging Rules section also has some brief guidelines for Python configuration.

## 2 -- Naming Rules
1. C++ header ﬁles use the sufﬁx .h, e.g. `CaloCluster.h`. (\*)
2. For C++ source ﬁles, the preferred sufﬁx  is .cc, e.g. `CaloCluster.cc`. (\*)
3. For a header file that contains a class, name that ﬁle after the class.
4. Name source ﬁles after the class.
5. A geometry XML file should be named as follows:   
  base/filename/physical_version_key/implementation_version_key/filename.xml  
  E.g.: Geometry/GEMGeometryBuilder/data/GEMSpecs/2019/v1/GEMSpecs.xml  
  A revision to a file that has already been in use and that needs to be preserved requires a new version of the file with an incremented version number ("v2" in the example). On the other hand, an upgrade of the detector would require a new `physical_version_key`. For example, an upgraded GEM might become:  
  Geometry/GEMGeometryBuilder/data /GEMSpecs/2023/v1/GEMSpecs.xml 
6. For class, struct, type, and enumeration names use upper class initials, e.g. `GeometryBuilder`.
7. For namespaces use lower case, e.g. `namespace edm`.
8. Start method names with lowercase, use upper case initials for following words, e.g. `collisionPoint()`.  
  Allowed exception: Implementation of virtual methods inherited from external packages, e.g. `ProcessHits()` method required by Geant4.  
9. Start data member names with lower case. A trailing "\_" is the preferred method to distinguish a data member from the getter method (e.g. `momentum_`).
10. Using "set" for a setter method is preferred, e.g. `setMomentum(double momentum)`.
11. For a getter method, using the value name is preferred, e.g. `momentum()`.
12. Do not use single character names, except for loop indices.
13. Do not use special characters, except for "_" where allowed.
14. Do not use "\_" as ﬁrst character, except for user-defined suffixes (used in user-defined literals). Only use it as the last character for class data member names, not local variable names.
15. Do not use "\_\_".
16. Use clear and explanatory variable names.

## 3 -- Style Rules
1. Do not indent pre-processor directives -- there should be no leading spaces before a directive.  (\*)
2. Never change the language syntax using `#deﬁne`.
3. Do not use spaces between a function, constructor, or method name and its opening parenthesis, e.g. `energy()` rather than `energy ()`. A similar style is encouraged but not required when brace initialization is used, e.g. `energy{13}`.
4. Do not use spaces in front of [] or on either side of -> . For example, `position[i]` instead of `position [i]`.
5. Separate expressions in a `for` statement by including a space after each semicolon.
6. Use the same indentation for comments as for the block the comments refer to.

## 4 -- Technical Coding Rules
1. Protect each header ﬁle from multiple inclusion with:  
`#ifndef PackageName_SubPackageName_FileName_h`  
`#define PackageName_SubPackageName_FileName_h`  
(body of header file)  
`#endif`  
If necessary to create a unique name, one can add the directory name:  
`PackageName_SubPackageName_Directory_FileName_h`.
2. Each header ﬁle contains one class declaration only. (\*)
3. Header ﬁles must not contain any implementation except for class templates and code to be inlined.
4. Do not inline virtual functions.
5. Do not inline functions which contain control structures which require block scoping.
6. In your own packages, use forward declarations if they are sufﬁcient.
7. Do not forward-declare an entity from another package.
8. Do not use absolute directory names or relative ﬁle paths in `#include` directives.
9. Use `nullptr`, not "0" or "NULL". (\*)
10. Use types like `int`, `uint32_t`, `size_t`, and `ptrdiff_t` consistently and without mixing them.
11. Use the `bool` type for booleans.
12. Copy and move assignment operators should return a reference to `*this`.
13. For a class, definition of any of the following requires definition of all five: destructor, copy constructor, copy assignment operator, move constructor, and move assignment operator. (\*)
14. Do not use function-like macros.
15. Use C++ casts, not C-style casting. (\*)
16. Do not use the ellipsis notation for function arguments, except for variable argument templates.
17. Do not use union types. (\*)
18. If a class has at least one virtual method, it must have a public virtual destructor or (exceptionally) a protected non-virtual destructor.
19. When a derived class function overrides a virtual function, always mark it with `override` or `final`.
20. Pass by value arguments which are not to be modiﬁed and are built-in types or small objects; otherwise pass arguments of class types by reference or, if necessary, by pointer.  
  Allowed exception: If the function algorithm would benefit from using a move of the argument instead of a copy, pass the argument by value.
21. Properly use rvalue references for temporary objects that will be moved.
22. The argument to a copy constructor and to an assignment operator must be a `const` reference, while the argument for a move constructor or move assignment operator must be an rvalue reference. (\*)
23. Do not let `const` member functions change the state of the object. Any special exceptions to this rule must still maintain thread safety. (\*)
24. A function must never return or in any way give access to references or pointers to local variables (stack variables) outside the scope in which they are declared, and a `const` member function must not give non-`const` access to any data directly or indirectly held by the object.
25. Each class may have only one each of public, protected, and private sections, which must be declared in that order. (\*)
26. Keep the ordering of methods in the header ﬁle and in the source ﬁle identical.
27. Provide meaningful argument names in method declarations in the header ﬁle to indicate usage, unless the type fully describes the usage.
28. Try to avoid excessively long lines of code that impair readability.
29. Data members of a class must not be redeﬁned in derived classes since doing so hides the original data member and could create confusion between the original and redefined data members.

## 5 -- Documentation Rules
1. Always  comment  complex,  tricky,  or  non-intuitive  portions of  code.
2. When revising code, be sure to update and revise comments.

## 6 -- Packaging Rules
#### Libraries
1. It is discouraged to have small packages (with couple of cc and header files).
2. Functionality used by multiple packages should go in the `.../src` and `.../interface` directories.
3. Only header files that expose a public interface should go into the `.../interface` directory.  
4. Include only files that are in the current directory, e.g.  
`#include "some_header.h"`  
 or in the `.../interface` directory, e.g  
`#include "Subsystem/Package/interface/some_header.h"`
5. Group code files into packages based upon their matching dependencies. Such dependencies can be on other CMSSW packages or, more importantly, external libraries.
#### Plugins
6. Put plugins (e.g. EDProducers, EDAnalyzers, etc.) into a `Package/Subpackage/plugins/` directory, with its dedicated `BuildFile.xml`.
7. Do not split plugins into header and source files. If you do split them, keep the header files in the `.../plugins` directory.
8. All code used only by the plugins in `../plugins` should also go under `.../plugins`.
 `plugins.cc` and `SealPlugins.cc` or any special files that just define plugins, except for template instantiations, are discouraged. 
#### Tests
9. Unit tests to test the functionalities of your Library and/or Plugins should go under `.../test`.
10. Add test library/plugins in `.../test/BuildFile.xml` for the common functionality used only by your unit tests.
11. For unit tests which simply run `cmsRun your-cfg` (to test your plugin), please use `<test name="..." command="cmsRun …"/>` in your `.../test/BuildFile.xml`.
12. Unit tests should return a non-zero value from their main to indicate test failure. Successful tests should print nothing or a very small amount to the log file. Tests should not require a human to read their output to determine if they succeed or fail.
#### Python
13. A `_cfi` file should contain only the definition of one module, and possible Modifier ("era") customizations on it. The module label should be the same as the `_cfi` file name.
14. The `_cfi` file should be left to be generated automatically with the `fillDescriptions()`. When Modifier customizations are needed, the auto-generated label should have e.g. "Default" postfix and be imported+cloned to the desired name.
15. A module/Task/Sequence/Path with a given name should be defined in exactly one `_cfi` or `_cff` file.
16. All Modifier customizations on a module/Task/Sequence/Path should be applied on the same file that defines the module/Task/Sequence/Path.
17. When one customizes an existing parameter in `clone()`, `Modifier.toModify()`, or in assignment, explicit types on the right hand side should be avoided.
#### Data files
18. To keep the repository size under control, we discourage adding any data files under `.../data`.
19. Please use the [cms-data externals GitHub repositories](https://github.com/cms-data/) to add/change any data file.
#### Binaries and scripts
19. Public executables/binaries should go under `.../bin`.
20. It is discouraged to generate plugins from `.../bin`.
21. Additional libraries used only by multiple executables of your `.../bin` should also go under `.../bin`.
22. Any utilities which should be available publicly (i.e. in the PATH) should go under `.../bin` and use the `INSTALL_SCRIPTS` flag in `.../bin/BuildFile.xml`.
23. The `.../scripts` directory is reserved for scripts that need to be available in the PATH. Configuration and data files should go into appropriate directories, like `.../data`.

## 7 -- Design and Coding Guidelines
These guidelines are a brief summary of highlights from the [C++ Core Guidelines](https://github.com/isocpp/CppCoreGuidelines) by Bjarne Stroustrup et al. The links for each guideline provide explanations and justifications.

1. Do not use mutable global data ([no globals](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#i2-avoid-non-const-global-variables)).
2. Ensure code is thread-safe. Avoid non-constant shared data, like static variables ([thread safety](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#i2-avoid-non-const-global-variables)).
3. Class data members that store a class invariant should be private ([invariant data members](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#c9-minimize-exposure-of-members)).  
4. A collection of data values that can take any value should be a struct, not a class, and those data members should be public without getters and setters. ([struct not class](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#c131-avoid-trivial-getters-and-setters)).
5. Make `const` all methods, data members, variables, and pointer or reference parameters that do not need to be non-const. Use `constexpr` for all constant values that can be evaluated at compile time ([const](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#con-constants-and-immutability)).
6. Do not use magic numbers. Deﬁne constants using `enum class` or `constexpr`, never `#deﬁne` ([enums](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#enum1-prefer-enumerations-over-macros)).
7. For ownership of dynamic memory, don’t use bare pointers but rather smart pointers: `std::unique_ptr, std::shared_ptr`, and `std::weak_ptr` and their constructors `std::make_unique<T>()` and `std::make_shared<T>()` ([smart pointers](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#r3-a-raw-pointer-a-t-is-non-owning)).
8. Avoid inlining unless you are sure you have a relevant performance problem ([inlining](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#f5-if-a-function-is-very-small-and-time-critical-declare-it-inline)).
9. Use `string` or `string_view`, not `char *` ([string](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#slstr1-use-stdstring-to-own-character-sequences)).
10. Avoid use of C-style arrays in favor of STL containers ([std::array](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#slcon1-prefer-using-stl-array-or-vector-instead-of-a-c-array)).
11. In general, do not catch exceptions -- leave them to the Framework (see [Exception Guidelines](https://twiki.cern.ch/twiki/bin/view/CMSPublic/SWGuideEdmExceptionUse#Exception%20Handling)).
12. Do not use the singleton pattern; use framework services ([no singletons](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#i3-avoid-singletons)).
13. Encapsulate algorithms and collaborating classes in namespaces ([namespaces](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#c5-place-helper-functions-in-the-same-namespace-as-the-class-they-support)).
14. Design functions that are short and simple and that perform a single, coherent, logical  task ([logical task](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#f2-a-function-should-perform-a-single-logical-operation), [short functions](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#f3-keep-functions-short-and-simple)).
15. Do not duplicate code. If procedural code is needed in two or more places, create a function for the task and call it where needed. ([functions](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#f1-package-meaningful-operations-as-carefully-named-functions), [encapsulate](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#p11-encapsulate-messy-constructs-rather-than-spreading-through-the-code))
16. Do not use goto ([no goto](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#es76-avoid-goto)).


