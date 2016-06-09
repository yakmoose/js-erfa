
(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa'),
    HH = require('./heap-helper'),
    SH = require('./struct-helper'),
    writeFloat64Buffer = HH.writeFloat64Buffer,
    readFloat64Buffer = HH.readFloat64Buffer,
    SH = require('./struct-helper');

  module.exports = {
    //SphericalCartesian
    /** void eraC2s(double p[3], double *theta, double *phi); */
    c2s: function (p) {
      var pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        thetaBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        phiBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(pBuffer, SH.flattenVector(p));

      LIBERFA._eraC2s(pBuffer, thetaBuffer, phiBuffer);

      var ret = {
        theta: LIBERFA.HEAPF64[thetaBuffer >> 3],
        phi: LIBERFA.HEAPF64[phiBuffer >> 3]
      };

      LIBERFA._free(pBuffer);
      LIBERFA._free(thetaBuffer);
      LIBERFA._free(phiBuffer);

      return ret;
    },
    /** void eraP2s(double p[3], double *theta, double *phi, double *r); */
    p2s: function (p) {

      var pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        thetaBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        phiBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        rBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(pBuffer, SH.flattenVector(p));

      LIBERFA._eraP2s(pBuffer, thetaBuffer, phiBuffer, rBuffer);

      var ret = {
        theta: LIBERFA.HEAPF64[thetaBuffer >> 3],
        phi: LIBERFA.HEAPF64[phiBuffer >> 3],
        r: LIBERFA.HEAPF64[rBuffer >> 3]
      };

      LIBERFA._free(pBuffer);
      LIBERFA._free(thetaBuffer);
      LIBERFA._free(phiBuffer);
      LIBERFA._free(rBuffer);

      return ret;
    },
    /** void eraPv2s(double pv[2][3], double *theta, double *phi, double *r, double *td, double *pd, double *rd); */
    pv2s: function (p) {
      var pvBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        thetaBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        phiBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        rBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        tdBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        pdBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        rdBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(pvBuffer, SH.flattenVector(p));

      LIBERFA._eraPv2s(pvBuffer, thetaBuffer, phiBuffer, rBuffer, tdBuffer, pdBuffer, rdBuffer);

      var ret = {
        theta: LIBERFA.HEAPF64[thetaBuffer >> 3],
        phi: LIBERFA.HEAPF64[phiBuffer >> 3],
        r: LIBERFA.HEAPF64[rBuffer >> 3],
        td: LIBERFA.HEAPF64[tdBuffer >> 3],
        pd: LIBERFA.HEAPF64[pdBuffer >> 3],
        rd: LIBERFA.HEAPF64[rdBuffer >> 3]
      };

      LIBERFA._free(pvBuffer);
      LIBERFA._free(thetaBuffer);
      LIBERFA._free(phiBuffer);
      LIBERFA._free(rBuffer);
      LIBERFA._free(tdBuffer);
      LIBERFA._free(pdBuffer);
      LIBERFA._free(rdBuffer);

      return ret;
    },
    /** void eraS2c(double theta, double phi, double c[3]); */
    s2c: function (theta, phi) {

      var cBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraS2c(theta, phi, cBuffer);

      var ret = readFloat64Buffer(cBuffer, 3);

      LIBERFA._free(cBuffer);

      return ret;
    },
    /** void eraS2p(double theta, double phi, double r, double p[3]); */
    s2p: function (theta, phi, r) {
      var pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraS2p(theta, phi, r, pBuffer);

      var ret = readFloat64Buffer(pBuffer, 3);

      LIBERFA._free(pBuffer);

      return ret;
    },
    /** void eraS2pv(double theta, double phi, double r, double td, double pd, double rd, double pv[2][3]); */
    s2pv: function (theta, phi, r, td, pd, rd) {
      var pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraS2pv(theta, phi, r, td, pd, rd, pvBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(pvBuffer, 6)), 3);

      LIBERFA._free(pvBuffer);

      return ret;
    },
  };
})();