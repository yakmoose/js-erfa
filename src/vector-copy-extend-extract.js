
(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa');
  module.exports = {
    //CopyExtendExtract
    /** void eraCp(double p[3], double c[3]); */
    cp: function(p) {
      return p.slice();
    },
    /** void eraCpv(double pv[2][3], double c[2][3]); */
    cpv: function (pv) {
      return this.cp(pv);
    },
    /** void eraCr(double r[3][3], double c[3][3]); */
    cr: function (r) {
      return this.cp(r);
    },
    /** void eraP2pv(double p[3], double pv[2][3]); */
    p2pv : function (p)
    {
      return [
        this.cp(p),
        this.zp()
      ]
    },
    /** void eraPv2p(double pv[2][3], double p[3]); */
    pv2p: function (pv) {
      return this.cp(pv[0]);
    },
  };
})();