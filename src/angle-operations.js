(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa');


  var angleToDMSF = function (fn,ndp, angle ) {
      var signBuffer = LIBERFA._malloc(1 * Uint8Array.BYTES_PER_ELEMENT),// one byte for the sign char
        idmsBuffer = LIBERFA._malloc(4 * Int32Array.BYTES_PER_ELEMENT),
        ofs = idmsBuffer>> 2,
        status = LIBERFA[fn](ndp, angle, signBuffer, idmsBuffer),

        //we want to return a sensible structure not just a chunk of memory
        ret =  {
          status: status,
          sign: String.fromCharCode( LIBERFA.HEAP8[signBuffer]),
          degrees: LIBERFA.HEAP32[ ofs + 0 ],
          minutes: LIBERFA.HEAP32[ ofs + 1 ],
          seconds: LIBERFA.HEAP32[ ofs + 2 ],
          fraction: LIBERFA.HEAP32[ ofs + 3 ]
        };

      LIBERFA._free(signBuffer);
      LIBERFA._free(idmsBuffer);

      return ret;
    },
      dmsToAngle = function (fn, s, ideg, iamin, iasec) {
      var radBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        ret,
        rad;

      s = s || "";

      ret = LIBERFA[fn](s.charCodeAt(0), ideg, iamin, iasec, radBuffer);

      rad = LIBERFA.HEAPF64[ radBuffer >> 3];

      LIBERFA._free(radBuffer);

      if (ret != 0) {
        //throw an exception here...
      }

      return rad;
    };

  module.exports = {
    //Angle ops
    /** void eraA2af(int ndp, double angle, char *sign, int idmsf[4]); */
    a2af: function (ndp, angle) {
      return angleToDMSF('_eraA2af', ndp, angle);
    },
    /** void eraA2tf(int ndp, double angle, char *sign, int ihmsf[4]); */
    a2tf: function (ndp, angle) {
      return angleToDMSF('_eraA2tf', ndp, angle);
    },
    /** int eraAf2a(char s, int ideg, int iamin, double asec, double *rad); */
    af2a : function (s, ideg, iamin, iasec) {
      return dmsToAngle('_eraAf2a', s,ideg, iamin, iasec);
    },
    /** double eraAnp(double a); */
    anp: LIBERFA.cwrap('eraAnp','number',['number']),
    /** double eraAnpm(double a); */
    anpm: LIBERFA.cwrap('eraAnpm','number',['number']),
    /** void eraD2tf(int ndp, double days, char *sign, int ihmsf[4]); */
    d2tf: function (ndp, days) {
      var r = angleToDMSF('_eraD2tf', ndp, days);
      r.hours = r.degrees;
      delete r.degrees;
      return r;
    },
    /** int eraTf2a(char s, int ihour, int imin, double sec, double *rad); */
    tf2a: function (s, ihour, imin, sec) {
      return dmsToAngle('_eraTf2a', s, ihour, imin, sec);
    },
    /** int eraTf2d(char s, int ihour, int imin, double sec, double *days); */
    tf2d: function (s, ihour, imin, sec) {
      return dmsToAngle('_eraTf2d', s, ihour, imin, sec);
    },
  };

})();