(function () {
  "use strict";

  var _ = require('lodash');

/* wrapper for the struct eraASTROM defined in erfam.h */
/** Star-independent astrometry parameters */
  var ASTROM = function (raw) {

    if (!raw) {
      raw = _.times(ASTROM.STRUCT_SIZE, _.constant(0));
    }

    /** PM time interval (SSB, Julian years) */
    this.pmt = raw[0];
    /** SSB to observer (vector, au) */
    this.eb = [
      raw[1],
      raw[2],
      raw[3]
    ];
    /** Sun to observer (unit vector) */
    this.eh =[
      raw[4],
      raw[5],
      raw[6]
    ];
    /** distance from Sun to observer (au) */
    this.em = raw[7];
    /* barycentric observer velocity (vector, c) */
    this.v = [
      raw[8],
      raw[9],
      raw[10]
    ];
    /** sqrt(1-|v|^2): reciprocal of Lorenz factor */
    this.bm1 = raw[11];
    /** bias-precession-nutation matrix */
    this.bpn = [
      [
        raw[12],
        raw[13],
        raw[14]
      ],
      [
        raw[15],
        raw[16],
        raw[17]
      ],
      [
        raw[18],
        raw[19],
        raw[20]
      ]
    ];
    /** longitude + s' + dERA(DUT) (radians) */
    this.along = raw[21];
    /** geodetic latitude (radians) */
    this.phi  = raw[22];
    /** polar motion xp wrt local meridian (radians) */
    this.xpl  = raw[23];
    /** polar motion yp wrt local meridian (radians) */
    this.ypl  = raw[24];
    /** sine of geodetic latitude */
    this.sphi  = raw[25];
    /** cosine of geodetic latitude */
    this.cphi  = raw[26];
    /** magnitude of diurnal aberration vector */
    this.diurab = raw[27];
    /** "local" Earth rotation angle (radians) */
    this.eral  = raw[28];
    /** refraction constant A (radians) */
    this.refa = raw[29];
    /** refraction constant B (radians) */
    this.refb = raw[30];
  };


  ASTROM.prototype.toArray = function () {
    var propsOrder = [
      'pmt',//0
      'eb',//1
      'eh',//2
      'em',//3
      'v',//4
      'bm1',//5
      'bpn',//6
      'along',//7
      'phi',//8
      'xpl',//9
      'ypl',//10
      'sphi',//11
      'cphi',//12
      'diurab',//13
      'eral',//14
      'refa',//15
      'refb'//16
    ];

    var a = [];
    propsOrder.forEach(function (item) {
      if (_.isArray(this[item])) {
        a = a.concat(_.flatten(this[item]));
      } else {
        a.push(this[item]);
      }
    }.bind(this));



    return a;
  };

  ASTROM.STRUCT_SIZE = 31;


  module.exports = ASTROM;

})();