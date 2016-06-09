
(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa'),
      HH = require('./heap-helper'),
      SH = require('./struct-helper'),
      writeFloat64Buffer = HH.writeFloat64Buffer,
      readFloat64Buffer = HH.readFloat64Buffer,
      SH = require('./struct-helper');

  module.exports = {
    //RotationVectors
    /** void eraRm2v(double r[3][3], double w[3]); */
    rm2v: function (r) {
      var rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT),
        wBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rBuffer, SH.flattenVector(r));

      LIBERFA._eraRm2v(rBuffer, wBuffer);

      var ret = readFloat64Buffer(wBuffer, 6);

      LIBERFA._free(rBuffer);
      LIBERFA._free(wBuffer);

      return ret;
    },
    /** void eraRv2m(double w[3], double r[3][3]); */
    rv2m: function (w) {
      var wBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(wBuffer, SH.flattenVector(w));

      LIBERFA._eraRv2m(wBuffer, rBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rBuffer, 9)), 3);

      LIBERFA._free(wBuffer);
      LIBERFA._free(rBuffer);

      return ret;
    },
    //SeparationAndAngle
    /** double eraPap(double a[3], double b[3]); */
    pap: function (a, b) {
      var aBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        bBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(aBuffer, SH.flattenVector(a));
      writeFloat64Buffer(bBuffer, SH.flattenVector(b));

      var ret = LIBERFA._eraPap(aBuffer, bBuffer);

      LIBERFA._free(aBuffer);
      LIBERFA._free(bBuffer);

      return ret;
    },
    /** double eraPas(double al, double ap, double bl, double bp);*/
    //pas: function (al, ap, bl, bp) {},
    pas: LIBERFA.cwrap('eraPas', 'number', ['number','number','number','number']),
    /** double eraSepp(double a[3], double b[3]);*/
    sepp: function (a, b) {
      var aBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        bBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(aBuffer, SH.flattenVector(a));
      writeFloat64Buffer(bBuffer, SH.flattenVector(b));

      var ret = LIBERFA._eraSepp(aBuffer, bBuffer);

      LIBERFA._free(aBuffer);
      LIBERFA._free(bBuffer);

      return ret;
    },
    /** double eraSeps(double al, double ap, double bl, double bp);*/
    //seps: function (al, ap, bl, bp) {}
    seps: LIBERFA.cwrap('eraSeps', 'number', ['number','number','number','number']),
  };
})();