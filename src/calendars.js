(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa');

  var calendars = {
    /** int eraCal2jd(int iy, int im, int id, double *djm0, double *djm); */
    cal2jd: function(iy, im, id) {

      var djm0Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        djmBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      var status = LIBERFA._eraCal2jd(iy, im, id, djm0Buffer, djmBuffer),
        ret = {
          status: status,
          djm0: LIBERFA.HEAPF64[ djm0Buffer >> 3],
          djm: LIBERFA.HEAPF64[ djmBuffer >> 3]
        };


      LIBERFA._free(djm0Buffer);
      LIBERFA._free(djmBuffer);

      return ret;
    },
    /** double eraEpb(double dj1, double dj2); */
    epb: LIBERFA.cwrap('eraEpb','number',['number','number']),
      /** void eraEpb2jd(double epb, double *djm0, double *djm); */
      epb2jd: function (epb){
    var djm0Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
      djmBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

    var status = LIBERFA._eraEpb2jd(epb, djm0Buffer, djmBuffer),
      ret = {
        status: status,
        djm0: LIBERFA.HEAPF64[ djm0Buffer >> 3],
        djm: LIBERFA.HEAPF64[ djmBuffer >> 3]
      };


    LIBERFA._free(djm0Buffer);
    LIBERFA._free(djmBuffer);

    return ret;
  },
    /** double eraEpj(double dj1, double dj2); */
    epj: LIBERFA.cwrap('eraEpj', 'number', ['number','number']),
      /** void eraEpj2jd(double epj, double *djm0, double *djm); */
      epj2jd: function (epj) {
    var djm0Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
      djmBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

    var status = LIBERFA._eraEpj2jd(epj, djm0Buffer, djmBuffer),
      ret = {
        status: status,
        djm0: LIBERFA.HEAPF64[ djm0Buffer >> 3],
        djm: LIBERFA.HEAPF64[ djmBuffer >> 3]
      };


    LIBERFA._free(djm0Buffer);
    LIBERFA._free(djmBuffer);

    return ret;
  },
    /** int eraJd2cal(double dj1, double dj2, int *iy, int *im, int *id, double *fd); */
    jd2cal: function (dj1, dj2) {
      var iyBuffer = LIBERFA._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
        imBuffer = LIBERFA._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
        idBuffer = LIBERFA._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
        fBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      //we use ccall here so we don't need to mess about with string pointers etc..
      var status = LIBERFA._eraJd2cal(dj1, dj2, iyBuffer, imBuffer, idBuffer, fBuffer),
        ret = {
          year: LIBERFA.HEAP32[iyBuffer>>2],
          month: LIBERFA.HEAP32[imBuffer>>2],
          day: LIBERFA.HEAP32[idBuffer>>2],
          fraction: LIBERFA.HEAPF64[fBuffer>>3],
          status: status
        };

      LIBERFA._free(iyBuffer);
      LIBERFA._free(imBuffer);
      LIBERFA._free(idBuffer);
      LIBERFA._free(fBuffer);

      return ret;
    },
    /** int eraJdcalf(int ndp, double dj1, double dj2, int iymdf[4]); */
    jdcalf: function (ndp, dj1, dj2) {
      var iymdfBuffer = LIBERFA._malloc(4 * Float64Array.BYTES_PER_ELEMENT);

      //we use ccall here so we don't need to mess about with string pointers etc..
      var status = LIBERFA._eraJdcalf(ndp, dj1, dj2, iymdfBuffer),
        ret = {
          year: LIBERFA.HEAP32[(iymdfBuffer>>2) +0],
          month: LIBERFA.HEAP32[(iymdfBuffer>>2) +1],
          day: LIBERFA.HEAP32[(iymdfBuffer>>2) +2],
          fraction: LIBERFA.HEAP32[(iymdfBuffer>>2) +3],
          status: status
        };

      LIBERFA._free(iymdfBuffer);

      return ret;
    }
  };

  module.exports = calendars;

})();