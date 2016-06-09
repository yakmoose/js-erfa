(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa'),
    SH = require('./struct-helper'),
    CONSTANTS = require('./constants'),
    HH = require('./heap-helper'),
    writeFloat64Buffer = HH.writeFloat64Buffer,
    readFloat64Buffer = HH.readFloat64Buffer,
    ASTROM = require('./astrom'),
    LDBODY = require('./ldbody');


  module.exports ={
    //GeodeticGeocentric
    /** int eraEform(int n, double *a, double *f); */
    eform: function (n) {
      var aBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        fBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      var status = LIBERFA._eraEform(n, aBuffer, fBuffer),
        ret = {
          status: status,
          a: LIBERFA.HEAPF64[ aBuffer >> 3],
          f: LIBERFA.HEAPF64[ fBuffer >> 3]
        };

      LIBERFA._free(aBuffer);
      LIBERFA._free(fBuffer);

      return ret;
    },
    /** int eraGc2gd(int n, double xyz[3], double *elong, double *phi, double *height); */
    gc2gd: function (n, xyz) {

      var eBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        pBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        hBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        xyzBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(xyzBuffer, xyz);

      var status = LIBERFA._eraGc2gd(n, xyzBuffer, eBuffer, pBuffer, hBuffer),
        ret = {
          status: status,
          e: LIBERFA.HEAPF64[ eBuffer >> 3],
          p: LIBERFA.HEAPF64[ pBuffer >> 3],
          h: LIBERFA.HEAPF64[ hBuffer >> 3]
        };

      LIBERFA._free(eBuffer);
      LIBERFA._free(pBuffer);
      LIBERFA._free(hBuffer);
      LIBERFA._free(xyzBuffer);

      return ret;
    },
    /** int eraGc2gde(double a, double f, double xyz[3], double *elong, double *phi, double *height); */
    gc2gde: function (a, f, xyz) {
      var eBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        pBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        hBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        xyzBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(xyzBuffer, xyz);

      var status = LIBERFA._eraGc2gde(a, f, xyzBuffer, eBuffer, pBuffer, hBuffer),
        ret = {
          status: status,
          e: LIBERFA.HEAPF64[ eBuffer >> 3],
          p: LIBERFA.HEAPF64[ pBuffer >> 3],
          h: LIBERFA.HEAPF64[ hBuffer >> 3]
        };

      LIBERFA._free(eBuffer);
      LIBERFA._free(pBuffer);
      LIBERFA._free(hBuffer);
      LIBERFA._free(xyzBuffer);

      return ret;
    },
    /** int eraGd2gc(int n, double elong, double phi, double height, double xyz[3]); */
    gd2gc: function (n, elong, phi, height) {
      var xyzBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      var status = LIBERFA._eraGd2gc(n, elong, phi, height, xyzBuffer),
        ret = {
          status: status,
          x: LIBERFA.HEAPF64[ (xyzBuffer >> 3) + 0 ],
          y: LIBERFA.HEAPF64[ (xyzBuffer >> 3) + 1],
          z: LIBERFA.HEAPF64[ (xyzBuffer >> 3) +2]
        };

      LIBERFA._free(xyzBuffer);

      return ret;
    },
    /** int eraGd2gce(double a, double f, double elong, double phi, double height, double xyz[3]); */
    gd2gce: function (a, f, elong, phi, height) {
      var xyzBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      var status = LIBERFA._eraGd2gce(a, f, elong, phi, height, xyzBuffer),
        ret = {
          status: status,
          x: LIBERFA.HEAPF64[ (xyzBuffer >> 3) + 0 ],
          y: LIBERFA.HEAPF64[ (xyzBuffer >> 3) + 1],
          z: LIBERFA.HEAPF64[ (xyzBuffer >> 3) +2]
        };

      LIBERFA._free(xyzBuffer);

      return ret;

    },
  };

})();