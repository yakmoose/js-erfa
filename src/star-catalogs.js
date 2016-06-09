(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa');

  module.exports ={
    //StarCatalogs
    /** void eraFk52h(double r5, double d5, double dr5, double dd5, double px5, double rv5, double *rh, double *dh, double *drh, double *ddh, double *pxh, double *rvh); */
    fk52h: function (r5, d5, dr5, dd5, px5, rv5) {
      var rhBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dhBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        drhBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        ddhBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        pxhBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        rvhBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);



      LIBERFA._eraFk52h(r5, d5, dr5, dd5, px5, rv5, rhBuffer, dhBuffer, drhBuffer, ddhBuffer, pxhBuffer, rvhBuffer);

      var ret = {
        rh: LIBERFA.HEAPF64[ rhBuffer >> 3],
        dh: LIBERFA.HEAPF64[ dhBuffer >> 3],
        drh: LIBERFA.HEAPF64[ drhBuffer >> 3],
        ddh: LIBERFA.HEAPF64[ ddhBuffer >> 3],
        pxh: LIBERFA.HEAPF64[ pxhBuffer >> 3],
        rvh: LIBERFA.HEAPF64[ rvhBuffer >> 3]
      };

      LIBERFA._free(rhBuffer);
      LIBERFA._free(dhBuffer);
      LIBERFA._free(drhBuffer);
      LIBERFA._free(ddhBuffer);
      LIBERFA._free(pxhBuffer);
      LIBERFA._free(rvhBuffer);

      return ret;

    },
    /** void eraFk5hip(double r5h[3][3], double s5h[3]); */
    fk5hip: function () {
      var r5hBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT),
        s5hBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraFk5hip(r5hBuffer, s5hBuffer);

      var r5h = LIBERFA.HEAPF64.subarray((r5hBuffer>>3),(r5hBuffer>>3) + 9),
        s5h = LIBERFA.HEAPF64.subarray((s5hBuffer>>3),(s5hBuffer>>3) + 3),
        ret = {
          r5h: Array.prototype.slice.call(r5h).chunk(3),
          s5h: Array.prototype.slice.call(s5h)
        };

      LIBERFA._free(r5hBuffer);
      LIBERFA._free(s5hBuffer);

      return ret;
    },
    /** void eraFk5hz(double r5, double d5, double date1, double date2, double *rh, double *dh); */
    fk5hz: function (r5, d5, date1, date2) {
      var rhBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dhBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      //we use ccall here so we don't need to mess about with string pointers etc..
      var status = LIBERFA._eraFk5hz(r5, d5, date1, date2, rhBuffer, dhBuffer),
        ret = {
          dh: LIBERFA.HEAPF64[dhBuffer>>3],
          rh: LIBERFA.HEAPF64[rhBuffer>>3]
        };

      LIBERFA._free(rhBuffer);
      LIBERFA._free(dhBuffer);

      return ret;
    },
    /** void eraH2fk5(double rh, double dh, double drh, double ddh, double pxh, double rvh, double *r5, double *d5, double *dr5, double *dd5, double *px5, double *rv5); */
    h2fk5: function (rh, dh, drh, ddh, pxh, rvh) {
      var r5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        d5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dr5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dd5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        px5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        rv5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraH2fk5(rh, dh, drh, ddh, pxh, rvh, r5Buffer, d5Buffer, dr5Buffer, dd5Buffer, px5Buffer, rv5Buffer);

      var ret = {
        r5: LIBERFA.HEAPF64[ r5Buffer >> 3],
        d5: LIBERFA.HEAPF64[ d5Buffer >> 3],
        dr5: LIBERFA.HEAPF64[ dr5Buffer >> 3],
        dd5: LIBERFA.HEAPF64[ dd5Buffer >> 3],
        px5: LIBERFA.HEAPF64[ px5Buffer >> 3],
        rv5: LIBERFA.HEAPF64[ rv5Buffer >> 3]
      };

      LIBERFA._free(r5Buffer);
      LIBERFA._free(d5Buffer);
      LIBERFA._free(dr5Buffer);
      LIBERFA._free(dd5Buffer);
      LIBERFA._free(px5Buffer);
      LIBERFA._free(rv5Buffer);

      return ret;
    },
    /** void eraHfk5z(double rh, double dh, double date1, double date2, double *r5, double *d5, double *dr5, double *dd5); */
    hfk5z: function (rh, dh, date1, date2){

      var r5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        d5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dr5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dd5Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraHfk5z(rh, dh, date1, date2, r5Buffer, d5Buffer, dr5Buffer, dd5Buffer);

      var ret = {
        r5: LIBERFA.HEAPF64[ r5Buffer >> 3],
        d5: LIBERFA.HEAPF64[ d5Buffer >> 3],
        dr5: LIBERFA.HEAPF64[ dr5Buffer >> 3],
        dd5: LIBERFA.HEAPF64[ dd5Buffer >> 3]
      };

      LIBERFA._free(r5Buffer);
      LIBERFA._free(d5Buffer);
      LIBERFA._free(dr5Buffer);
      LIBERFA._free(dd5Buffer);

      return ret;

    },
    /** int eraStarpm(double ra1, double dec1, double pmr1, double pmd1, double px1, double rv1, double ep1a, double ep1b, double ep2a, double ep2b, double *ra2, double *dec2, double *pmr2, double *pmd2, double *px2, double *rv2); */
    starpm: function(ra1, dec1, pmr1, pmd1, px1, rv1, ep1a, ep1b, ep2a, ep2b) {

      var raBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        decBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        pmrBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        pmdBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        pxBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        rvBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);


      var status = LIBERFA._eraStarpm(ra1, dec1, pmr1, pmd1, px1, rv1, ep1a, ep1b, ep2a, ep2b, raBuffer, decBuffer, pmrBuffer, pmdBuffer, pxBuffer, rvBuffer),
        ret = {
          status: status,
          ra: LIBERFA.HEAPF64[ raBuffer >> 3],
          dec: LIBERFA.HEAPF64[ decBuffer >> 3],
          pmr: LIBERFA.HEAPF64[ pmrBuffer >> 3],
          pmd: LIBERFA.HEAPF64[ pmdBuffer >> 3],
          px: LIBERFA.HEAPF64[ pxBuffer >> 3],
          rv: LIBERFA.HEAPF64[ rvBuffer >> 3]
        };

      LIBERFA._free(raBuffer);
      LIBERFA._free(decBuffer);
      LIBERFA._free(pmrBuffer);
      LIBERFA._free(pmdBuffer);
      LIBERFA._free(pxBuffer);
      LIBERFA._free(rvBuffer);

      return ret;
    },
  };

})();