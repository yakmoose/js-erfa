
(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa'),
      HH = require('./heap-helper'),
      _ = require('lodash'),
      writeFloat64Buffer = HH.writeFloat64Buffer,
      readFloat64Buffer = HH.readFloat64Buffer;

  module.exports = {
    //Initialization
    /** void eraIr(double r[3][3]); */
    ir: function () {
      //do this here, instead of lots of crazy calls back and forth into the library
      return [ [1.0, 0.0, 0.0], [0.0, 1.0, 0,0], [0.0, 0.0, 1.0]];
    },
    /** void eraZp(double p[3]); */
    zp: function () {
      //again, we could do this the hardway, but since we are going for
      // some level of immutability, we just disgard what we are supplied with
      // and return the zeroed out array
      return [0, 0, 0];
    },
    /** void eraZpv(double pv[2][3]); */
    zpv: function () {
      //as above, we are only returning a simple vector, do not need to call into
      // the core library
      return [
        this.zp(),
        this.zp()
      ];
    },
    /** void eraZr(double r[3][3]); */
    zr: function () {
      //notes as zp...
      return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    },
    //MatrixOps
    /** void eraRxr(double a[3][3], double b[3][3], double atb[3][3]); */
    rxr: function (a, b) {
      var aBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT),
        bBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT),
        atbBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(aBuffer, _.flatten(a));
      writeFloat64Buffer(bBuffer, _.flatten(b));

      LIBERFA._eraRxr(aBuffer, bBuffer, atbBuffer);

      var atb = SH.chunkArray(Array.from(readFloat64Buffer(atbBuffer, 3*3)), 3);

      LIBERFA._free(aBuffer);
      LIBERFA._free(bBuffer);
      LIBERFA._free(atbBuffer);

      return atb;
    },
    /** void eraTr(double r[3][3], double rt[3][3]); */
    tr: function (r) {

      var rBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT),
        rtBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rBuffer, _.flatten(r));
      LIBERFA._eraTr(rBuffer, rtBuffer);

      var rt = SH.chunkArray(Array.from(readFloat64Buffer(rtBuffer, 3 *3)), 3);

      LIBERFA._free(rBuffer);
      LIBERFA._free(rtBuffer);

      return rt;

    },
    //MatrixVectorProducts
    /** void eraRxp(double r[3][3], double p[3], double rp[3]); */
    rxp: function (r, p) {
      var rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT),
        pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        rpBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rBuffer, _.flatten(r));
      writeFloat64Buffer(pBuffer, p);

      LIBERFA._eraRxp(rBuffer, pBuffer, rpBuffer);

      var ret = readFloat64Buffer(rpBuffer, 3);

      LIBERFA._free(rBuffer);
      LIBERFA._free(pBuffer);
      LIBERFA._free(rpBuffer);

      return ret;

    },
    /** void eraRxpv(double r[3][3], double pv[2][3], double rpv[2][3]); */
    rxpv: function (r, pv) {

      var rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT),
        pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT),
        rpvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rBuffer, _.flatten(r));
      writeFloat64Buffer(pvBuffer, _.flatten(pv));

      LIBERFA._eraRxpv(rBuffer, pvBuffer, rpvBuffer);

      var ret = _.chunk(readFloat64Buffer(rpvBuffer, 6), 3);

      LIBERFA._free(rBuffer);
      LIBERFA._free(pvBuffer);
      LIBERFA._free(rpvBuffer);

      return ret;

    },
    /** void eraTrxp(double r[3][3], double p[3], double trp[3]); */
    trxp: function (r, p) {
      var rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT),
        pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        rpBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rBuffer, _.flatten(r));
      writeFloat64Buffer(pBuffer, p);

      LIBERFA._eraTrxp(rBuffer, pBuffer, rpBuffer);

      var ret = readFloat64Buffer(rpBuffer, 3);

      LIBERFA._free(rBuffer);
      LIBERFA._free(pBuffer);
      LIBERFA._free(rpBuffer);

      return ret;
    },
    /** void eraTrxpv(double r[3][3], double pv[2][3], double trpv[2][3]); */
    trxpv: function (r, pv) {
      var rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT),
        pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT),
        rpvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rBuffer, _.flatten(r));
      writeFloat64Buffer(pvBuffer, _.flatten(pv));

      LIBERFA._eraTrxpv(rBuffer, pvBuffer, rpvBuffer);

      var ret = _.chunk(readFloat64Buffer(rpvBuffer, 6), 3);

      LIBERFA._free(rBuffer);
      LIBERFA._free(pvBuffer);
      LIBERFA._free(rpvBuffer);

      return ret;

    },

  };
})();