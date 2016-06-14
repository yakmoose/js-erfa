(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa'),
      _ = require('lodash'),
      HH = require('./heap-helper'),
      writeFloat64Buffer = HH.writeFloat64Buffer;


  module.exports = {
    //SpaceMotion
    /** int eraPvstar(double pv[2][3], double *ra, double *dec, double *pmr, double *pmd, double *px, double *rv); */
    pvstar: function (pv) {
      var data = _.flatten(pv),
        pvBuffer = LIBERFA._malloc( data.length * Float64Array.BYTES_PER_ELEMENT),
        raBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        decBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        pmrBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        pmdBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        pxBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        rvBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(pvBuffer, data);

      var status = LIBERFA._eraPvstar(pvBuffer, raBuffer, decBuffer, pmrBuffer, pmdBuffer, pxBuffer, rvBuffer),
        ret = {
          status: status,
          ra: LIBERFA.HEAPF64[raBuffer >> 3],
          dec: LIBERFA.HEAPF64[decBuffer >> 3],
          pmr: LIBERFA.HEAPF64[pmrBuffer >> 3],
          pmd: LIBERFA.HEAPF64[pmdBuffer >> 3],
          px: LIBERFA.HEAPF64[pxBuffer >> 3],
          rv: LIBERFA.HEAPF64[rvBuffer >> 3]
        };


      LIBERFA._free(pvBuffer);
      LIBERFA._free(raBuffer);
      LIBERFA._free(decBuffer);
      LIBERFA._free(pmrBuffer);
      LIBERFA._free(pmdBuffer);
      LIBERFA._free(pxBuffer);
      LIBERFA._free(rvBuffer);

      return ret;
    },
    /** int eraStarpv(double ra, double dec, double pmr, double pmd, double px, double rv, double pv[2][3]); */
    starpv: function(ra, dec, pmr, pmd, px, rv) {

      var pvBuffer = LIBERFA._malloc(2 * 3 * Float64Array.BYTES_PER_ELEMENT ),
        status = LIBERFA._eraStarpv(ra, dec, pmr, pmd, px, rv, pvBuffer),
        ret = {
          status: status,

          //going to put this back into an array, as that is how these functions roll.
          pv: [
            [
              LIBERFA.HEAPF64[(pvBuffer >> 3)],
              LIBERFA.HEAPF64[(pvBuffer >> 3) + 1],
              LIBERFA.HEAPF64[(pvBuffer >> 3) + 2]
            ],
            [
              LIBERFA.HEAPF64[(pvBuffer >> 3) + 3],
              LIBERFA.HEAPF64[(pvBuffer >> 3) + 4],
              LIBERFA.HEAPF64[(pvBuffer >> 3) + 5]
            ]
          ]
        };

      LIBERFA._free(pvBuffer);

      return ret;
    },

  };

})();