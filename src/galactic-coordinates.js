(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa');

  module.exports ={

    //GalacticCoordinates
    /** void eraG2icrs ( double dl, double db, double *dr, double *dd ); */
    g2icrs: function (dl, db) {
      var drBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        ddBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      var status = LIBERFA._eraG2icrs(dl , db, drBuffer, ddBuffer),
        ret = {
          status: status,
          dr: LIBERFA.HEAPF64[ drBuffer >> 3],
          dd: LIBERFA.HEAPF64[ ddBuffer >> 3]
        };


      LIBERFA._free(drBuffer);
      LIBERFA._free(ddBuffer);

      return ret;
    },
    /** void eraIcrs2g ( double dr, double dd, double *dl, double *db ); */
    icrs2g: function (dr, dd) {
      var dlBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dbBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      var status = LIBERFA._eraIcrs2g(dr , dd, dlBuffer, dbBuffer),
        ret = {
          status: status,
          dl: LIBERFA.HEAPF64[ dlBuffer >> 3],
          db: LIBERFA.HEAPF64[ dbBuffer >> 3]
        };


      LIBERFA._free(dlBuffer);
      LIBERFA._free(dbBuffer);

      return ret;
    },
  };

})();