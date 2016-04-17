What is jsERFA
==============
[![Build Status](https://travis-ci.org/yakmoose/js-erfa.svg?branch=master)](https://travis-ci.org/yakmoose/js-erfa)


This is a Javascript implementation/wrapper of the [liberfa](https://github.com/liberfa/erfa) library. liberfa is a collection of key algorithms for astronomy, and is in turn, based on the [SOFA](http://www.iausofa.org/) library published by the International Astronomical Union (IAU). 

The core ERFA functions have been compiled to javascript using Emscripten and have been wrapped accordingly to hide all the C like pointer behaviours. 

Where functions return multiple results via referenced arguments, they have been wrapped up into simple objects. 


Building
========
A pre-compiled version of liberfa.js had been provided. [Emscripten](http://emscripten.org) is required should you wish to recompile liberfa.js from the upstream source. 

The build_erfa_js.sh script will clone the erfa library into the working directory and compile liberfa.js for you. 

Tests
=====
The tests are based on the supplied upstream tests found in t_erfa_c.c

As the tests only check for basic correctness of the functions, it may not be a good idea to try and fly any spacecraft with this code. 

Licence
=======
This code makes use of liberfa, the license for this is included in LICENCE_ERFA.txt.