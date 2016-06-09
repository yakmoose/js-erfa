(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa');

  module.exports = {
    //ephemerides
    /** int eraEpv00(double date1, double date2, double pvh[2][3], double pvb[2][3]); */
    epv00: function (date1, date2) {

      var pvhBuffer = LIBERFA._malloc(2 * 3 * Float64Array.BYTES_PER_ELEMENT),
        pvbBuffer = LIBERFA._malloc(2 * 3 * Float64Array.BYTES_PER_ELEMENT);

      var status = LIBERFA._eraEpv00(date1, date2, pvhBuffer, pvbBuffer),
        ret = {
          status: status,
          //we leave these as arrays, as that is how the comeout/go in
          pvh: [
            [
              LIBERFA.HEAPF64[(pvhBuffer >> 3) + 0],
              LIBERFA.HEAPF64[(pvhBuffer >> 3) + 1],
              LIBERFA.HEAPF64[(pvhBuffer >> 3) + 2]
            ],
            [
              LIBERFA.HEAPF64[(pvhBuffer >> 3) + 3],
              LIBERFA.HEAPF64[(pvhBuffer >> 3) + 4],
              LIBERFA.HEAPF64[(pvhBuffer >> 3) + 5]
            ]
          ],
          pvb: [
            [
              LIBERFA.HEAPF64[(pvbBuffer >> 3) + 0],
              LIBERFA.HEAPF64[(pvbBuffer >> 3) + 1],
              LIBERFA.HEAPF64[(pvbBuffer >> 3) + 2]
            ],
            [
              LIBERFA.HEAPF64[(pvbBuffer >> 3) + 3],
              LIBERFA.HEAPF64[(pvbBuffer >> 3) + 4],
              LIBERFA.HEAPF64[(pvbBuffer >> 3) + 5]
            ]
          ]

        };

      LIBERFA._free(pvhBuffer);
      LIBERFA._free(pvbBuffer);

      return ret;
    }
    ,
    /** int eraPlan94(double date1, double date2, int np, double pv[2][3]); */
    plan94: function (date1, date2, np) {
      var pvBuffer = LIBERFA._malloc(2 * 3 * Float64Array.BYTES_PER_ELEMENT);
      var status = LIBERFA._eraPlan94(date1, date2, np, pvBuffer),
        ret = {
          status: status,
          x: LIBERFA.HEAPF64[(pvBuffer >> 3) + 0],
          y: LIBERFA.HEAPF64[(pvBuffer >> 3) + 1],
          z: LIBERFA.HEAPF64[(pvBuffer >> 3) + 2],

          vx: LIBERFA.HEAPF64[(pvBuffer >> 3) + 3],
          vy: LIBERFA.HEAPF64[(pvBuffer >> 3) + 4],
          vz: LIBERFA.HEAPF64[(pvBuffer >> 3) + 5]
        };

      LIBERFA._free(pvBuffer);

      return ret;
    }
  };

})();