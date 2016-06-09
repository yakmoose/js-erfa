(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa'),
    SH = require('./struct-helper'),
    CONSTANTS = require('./constants'),
    HH = require('./heap-helper'),
    writeFloat64Buffer = HH.writeFloat64Buffer,
    readFloat64Buffer = HH.readFloat64Buffer;

  module.exports = {
    //PrecNutPolar
    /** void eraBi00(double *dpsibi, double *depsbi, double *dra); */
    bi00: function () {
      return {
        /* The frame bias corrections in longitude and obliquity */
        dpsibi:-0.041775  * CONSTANTS.ERFA_DAS2R,
        depsbi: -0.0068192 * CONSTANTS.ERFA_DAS2R,

        /* The ICRS RA of the J2000.0 equinox (Chapront et al., 2002) */
        dra: -0.0146 * CONSTANTS.ERFA_DAS2R
      }
    },
    /** void eraBp00(double date1, double date2, double rb[3][3], double rp[3][3], double rbp[3][3]); */
    bp00: function (date1, date2) {
      var rbBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraBp00(date1, date2, rbBuffer, rpBuffer, rbpBuffer);

      var ret = {
        rb: SH.chunkArray(Array.from(readFloat64Buffer(rbBuffer, 9)),3),
        rp: SH.chunkArray(Array.from(readFloat64Buffer(rpBuffer, 9)),3),
        rbp: SH.chunkArray(Array.from(readFloat64Buffer(rbpBuffer, 9)),3)
      };


      LIBERFA._free(rbBuffer);
      LIBERFA._free(rpBuffer);
      LIBERFA._free(rbpBuffer);

      return ret;

    },
    /** void eraBp06(double date1, double date2, double rb[3][3], double rp[3][3], double rbp[3][3]); */
    bp06: function (date1, date2) {
      var rbBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraBp06(date1, date2, rbBuffer, rpBuffer, rbpBuffer);

      var ret = {
        rb: SH.chunkArray(Array.from(readFloat64Buffer(rbBuffer, 9)),3),
        rp: SH.chunkArray(Array.from(readFloat64Buffer(rpBuffer, 9)),3),
        rbp: SH.chunkArray(Array.from(readFloat64Buffer(rbpBuffer, 9)),3)
      };

      LIBERFA._free(rbBuffer);
      LIBERFA._free(rpBuffer);
      LIBERFA._free(rbpBuffer);

      return ret;
    },
    /** void eraBpn2xy(double rbpn[3][3], double *x, double *y); */
    bpn2xy: function (rbpn) {
      return {
        x: rbpn[2][0],
        y: rbpn[2][1]
      };
    },
    /** void eraC2i00a(double date1, double date2, double rc2i[3][3]); */
    c2i00a: function (date1, date2) {
      var rc2iBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2i00a(date1, date2, rc2iBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2iBuffer, 9)),3);

      LIBERFA._free(rc2iBuffer);

      return ret;
    },
    /** void eraC2i00b(double date1, double date2, double rc2i[3][3]); */
    c2i00b: function (date1, date2) {
      var rc2iBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2i00b(date1, date2, rc2iBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2iBuffer, 9)),3);

      LIBERFA._free(rc2iBuffer);

      return ret;
    },
    /** void eraC2i06a(double date1, double date2, double rc2i[3][3]); */
    c2i06a: function (date1, date2) {
      var rc2iBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2i06a(date1, date2, rc2iBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2iBuffer, 9)),3);

      LIBERFA._free(rc2iBuffer);

      return ret;
    },
    /** void eraC2ibpn(double date1, double date2, double rbpn[3][3], double rc2i[3][3]); */
    c2ibpn: function (date1, date2, rpbn) {

      rpbn = SH.flattenVector(rpbn);

      var rpbnBuffer = LIBERFA._malloc( rpbn.length * Float64Array.BYTES_PER_ELEMENT),
        rc2iBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rpbnBuffer, rpbn);

      LIBERFA._eraC2ibpn(date1, date2, rpbnBuffer, rc2iBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2iBuffer, 9)),3);

      LIBERFA._free(rc2iBuffer);
      LIBERFA._free(rpbnBuffer);

      return ret;
    },
    /** void eraC2ixy(double date1, double date2, double x, double y, double rc2i[3][3]); */
    c2ixy: function (date1, date2, x, y) {

      var rc2iBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2ixy(date1, date2, x, y, rc2iBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2iBuffer, 9)),3);

      LIBERFA._free(rc2iBuffer);

      return ret;
    },
    /** void eraC2ixys(double x, double y, double s, double rc2i[3][3]); */
    c2ixys: function (x, y, s) {

      var rc2iBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2ixy(x, y, s, rc2iBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2iBuffer, 9)),3);

      LIBERFA._free(rc2iBuffer);

      return ret;
    },
    /** void eraC2t00a(double tta, double ttb, double uta, double utb, double xp, double yp, double rc2t[3][3]); */
    c2t00a: function (tta, ttb, uta, utb, xp, yp) {
      var rc2tBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2t00a(tta, ttb, uta, utb, xp, yp, rc2tBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2tBuffer, 9)),3);

      LIBERFA._free(rc2tBuffer);

      return ret;
    },
    /** void eraC2t00b(double tta, double ttb, double uta, double utb, double xp, double yp, double rc2t[3][3]); */
    c2t00b: function (tta, ttb, uta, utb, xp, yp) {
      var rc2tBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2t00b(tta, ttb, uta, utb, xp, yp, rc2tBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2tBuffer, 9)),3);

      LIBERFA._free(rc2tBuffer);

      return ret;
    },
    /** void eraC2t06a(double tta, double ttb, double uta, double utb, double xp, double yp, double rc2t[3][3]); */
    c2t06a: function (tta, ttb, uta, utb, xp, yp) {
      var rc2tBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2t06a(tta, ttb, uta, utb, xp, yp, rc2tBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2tBuffer, 9)),3);

      LIBERFA._free(rc2tBuffer);

      return ret;

    },
    /** void eraC2tcio(double rc2i[3][3], double era, double rpom[3][3], double rc2t[3][3]); */
    c2tcio: function (rc2i, era, rpom) {

      rc2i = SH.flattenVector(rc2i);
      rpom = SH.flattenVector(rpom);

      var rc2iBuffer = LIBERFA._malloc( rc2i.length * Float64Array.BYTES_PER_ELEMENT),
        rpomBuffer = LIBERFA._malloc( rpom.length * Float64Array.BYTES_PER_ELEMENT),
        rc2tBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rc2iBuffer, rc2i);
      writeFloat64Buffer(rpomBuffer, rpom);

      LIBERFA._eraC2tcio(rc2iBuffer, era, rpomBuffer, rc2tBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2tBuffer, 9)),3);

      LIBERFA._free(rc2iBuffer);
      LIBERFA._free(rpomBuffer);
      LIBERFA._free(rc2tBuffer);

      return ret;

    },
    /** void eraC2teqx(double rbpn[3][3], double gst, double rpom[3][3], double rc2t[3][3]); */
    c2teqx: function (rbpn, gst, rpom) {

      rbpn = SH.flattenVector(rbpn);
      rpom = SH.flattenVector(rpom);

      var rbpnBuffer = LIBERFA._malloc( rbpn.length * Float64Array.BYTES_PER_ELEMENT),
        rpomBuffer = LIBERFA._malloc( rpom.length * Float64Array.BYTES_PER_ELEMENT),
        rc2tBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rbpnBuffer, rbpn);
      writeFloat64Buffer(rpomBuffer, rpom);

      LIBERFA._eraC2teqx(rbpnBuffer, gst, rpomBuffer, rc2tBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2tBuffer, 9)),3);

      LIBERFA._free(rbpnBuffer);
      LIBERFA._free(rpomBuffer);
      LIBERFA._free(rc2tBuffer);

      return ret;
    },
    /** void eraC2tpe(double tta, double ttb, double uta, double utb, double dpsi, double deps, double xp, double yp, double rc2t[3][3]); */
    c2tpe: function (tta, ttb, uta, utb, dpsi, deps, xp, yp) {

      var rc2tBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2tpe(tta, ttb, uta, utb, dpsi, deps, xp, yp, rc2tBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2tBuffer, 9)),3);

      LIBERFA._free(rc2tBuffer);

      return ret;

    },
    /** void eraC2txy(double tta, double ttb, double uta, double utb, double x, double y, double xp, double yp, double rc2t[3][3]); */
    c2txy: function (tta, ttb, uta, utb, x, y, xp, yp) {

      var rc2tBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraC2txy(tta, ttb, uta, utb, x, y, xp, yp, rc2tBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rc2tBuffer, 9)),3);

      LIBERFA._free(rc2tBuffer);

      return ret;
    },
    /** double eraEo06a(double date1, double date2); */
    eo06a: LIBERFA.cwrap('eraEo06a', 'number', ['number', 'number']),
    /** double eraEors(double rnpb[3][3], double s); */
    eors: function (rnpb, s) {

      rnpb = SH.flattenVector(rnpb);

      var rnpbBuffer = LIBERFA._malloc( rnpb.length * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(rnpbBuffer, rnpb);

      var ret = LIBERFA._eraEors(rnpbBuffer, s);

      LIBERFA._free(rnpbBuffer);

      return ret;
    },
    /** void eraFw2m(double gamb, double phib, double psi, double eps, double r[3][3]); */
    fw2m: function (gamb, phib, psi, eps) {
      var rBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraFw2m(gamb, phib, psi, eps, rBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rBuffer, 9)),3);

      LIBERFA._free(rBuffer);

      return ret;
    },
    /** void eraFw2xy(double gamb, double phib, double psi, double eps, double *x, double *y); */
    fw2xy: function (gamb, phib, psi, eps) {

      var xBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        yBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraFw2xy(gamb, phib, psi, eps, xBuffer, yBuffer);

      var ret = {
        x: LIBERFA.HEAPF64[xBuffer >> 3],
        y: LIBERFA.HEAPF64[yBuffer >> 3]
      };


      LIBERFA._free(xBuffer);
      LIBERFA._free(yBuffer);

      return ret;
    },
    /** void eraNum00a(double date1, double date2, double rmatn[3][3]); */
    num00a: function (date1, date2) {

      var rmatnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraNum00a(date1, date2, rmatnBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rmatnBuffer, 9)),3);

      LIBERFA._free(rmatnBuffer);

      return ret;

    },
    /** void eraNum00b(double date1, double date2, double rmatn[3][3]); */
    num00b: function (date1, date2) {
      var rmatnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraNum00b(date1, date2, rmatnBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rmatnBuffer, 9)),3);

      LIBERFA._free(rmatnBuffer);

      return ret;
    },
    /** void eraNum06a(double date1, double date2, double rmatn[3][3]); */
    num06a: function (date1, date2) {
      var rmatnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraNum06a(date1, date2, rmatnBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rmatnBuffer, 9)),3);

      LIBERFA._free(rmatnBuffer);

      return ret;
    },
    /** void eraNumat(double epsa, double dpsi, double deps, double rmatn[3][3]); */
    numat: function (epsa, dpsi, deps) {
      var rmatnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraNumat(epsa, dpsi, deps, rmatnBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rmatnBuffer, 9)),3);

      LIBERFA._free(rmatnBuffer);

      return ret;
    },
    /** void eraNut00a(double date1, double date2, double *dpsi, double *deps); */
    nut00a: function (date1, date2) {

      var dpsiBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        depsBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraNut00a(date1, date2, dpsiBuffer, depsBuffer);

      var ret = {
        dpsi: LIBERFA.HEAPF64[dpsiBuffer >> 3],
        deps: LIBERFA.HEAPF64[depsBuffer >> 3]
      };


      LIBERFA._free(dpsiBuffer);
      LIBERFA._free(depsBuffer);

      return ret;

    },
    /** void eraNut00b(double date1, double date2, double *dpsi, double *deps); */
    nut00b: function (date1, date2) {
      var dpsiBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        depsBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraNut00b(date1, date2, dpsiBuffer, depsBuffer);

      var ret = {
        dpsi: LIBERFA.HEAPF64[dpsiBuffer >> 3],
        deps: LIBERFA.HEAPF64[depsBuffer >> 3]
      };

      LIBERFA._free(dpsiBuffer);
      LIBERFA._free(depsBuffer);

      return ret;
    },
    /** void eraNut06a(double date1, double date2, double *dpsi, double *deps); */
    nut06a: function (date1, date2) {
      var dpsiBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        depsBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraNut06a(date1, date2, dpsiBuffer, depsBuffer);

      var ret = {
        dpsi: LIBERFA.HEAPF64[dpsiBuffer >> 3],
        deps: LIBERFA.HEAPF64[depsBuffer >> 3]
      };

      LIBERFA._free(dpsiBuffer);
      LIBERFA._free(depsBuffer);

      return ret;
    },
    /** void eraNut80(double date1, double date2, double *dpsi, double *deps); */
    nut80: function (date1, date2) {
      var dpsiBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        depsBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraNut80(date1, date2, dpsiBuffer, depsBuffer);

      var ret = {
        dpsi: LIBERFA.HEAPF64[dpsiBuffer >> 3],
        deps: LIBERFA.HEAPF64[depsBuffer >> 3]
      };

      LIBERFA._free(dpsiBuffer);
      LIBERFA._free(depsBuffer);

      return ret;
    },
    /** void eraNutm80(double date1, double date2, double rmatn[3][3]); */
    nutm80: function (date1, date2) {
      var rmatnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraNutm80(date1, date2, rmatnBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rmatnBuffer, 9)),3);

      LIBERFA._free(rmatnBuffer);

      return ret;
    },
    /** double eraObl06(double date1, double date2); */
    obl06: LIBERFA.cwrap('eraObl06', 'number', ['number', 'number']),
    /** double eraObl80(double date1, double date2); */
    obl80: LIBERFA.cwrap('eraObl80', 'number', ['number', 'number']),
    /** void eraP06e(double date1, double date2, double *eps0, double *psia, double *oma, double *bpa, double *bqa, double *pia, double *bpia, double *epsa, double *chia, double *za, double *zetaa, double *thetaa, double *pa, double *gam, double *phi, double *psi); */
    p06e: function (date1, date2){

      /* Interval between fundamental date J2000.0 and given date (JC). */
      var t = ((date1 - CONSTANTS.ERFA_DJ00) + date2) / CONSTANTS.ERFA_DJC,

        /* Obliquity at J2000.0. */
        eps0 = 84381.406 * CONSTANTS.ERFA_DAS2R,

        /* Luni-solar precession. */
        psia = ( 5038.481507     +
          (   -1.0790069    +
          (   -0.00114045   +
          (    0.000132851  +
          (   -0.0000000951 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        /* Inclination of mean equator with respect to the J2000.0 ecliptic. */
        oma = eps0 + ( -0.025754     +
          (  0.0512623    +
          ( -0.00772503   +
          ( -0.000000467  +
          (  0.0000003337 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        /* Ecliptic pole x, J2000.0 ecliptic triad. */
        bpa = (  4.199094     +
          (  0.1939873    +
          ( -0.00022466   +
          ( -0.000000912  +
          (  0.0000000120 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        /* Ecliptic pole -y, J2000.0 ecliptic triad. */
        bqa = ( -46.811015     +
          (   0.0510283    +
          (   0.00052413   +
          (  -0.000000646  +
          (  -0.0000000172 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        /* Angle between moving and J2000.0 ecliptics. */
        pia = ( 46.998973     +
          ( -0.0334926    +
          ( -0.00012559   +
          (  0.000000113  +
          ( -0.0000000022 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        /* Longitude of ascending node of the moving ecliptic. */
        bpia = ( 629546.7936      +
          (   -867.95758     +
          (      0.157992    +
          (     -0.0005371   +
          (     -0.00004797  +
          (      0.000000072 )
          * t) * t) * t) * t) * t) * CONSTANTS.ERFA_DAS2R,

        /* Mean obliquity of the ecliptic. */
        epsa = this.obl06(date1, date2),

        /* Planetary precession. */
        chia = ( 10.556403     +
          ( -2.3814292    +
          ( -0.00121197   +
          (  0.000170663  +
          ( -0.0000000560 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        /* Equatorial precession: minus the third of the 323 Euler angles. */
        za = (   -2.650545     +
          ( 2306.077181     +
          (    1.0927348    +
          (    0.01826837   +
          (   -0.000028596  +
          (   -0.0000002904 )
          * t) * t) * t) * t) * t) * CONSTANTS.ERFA_DAS2R,

        /* Equatorial precession: minus the first of the 323 Euler angles. */
        zetaa = (    2.650545     +
          ( 2306.083227     +
          (    0.2988499    +
          (    0.01801828   +
          (   -0.000005971  +
          (   -0.0000003173 )
          * t) * t) * t) * t) * t) * CONSTANTS.ERFA_DAS2R,

        /* Equatorial precession: second of the 323 Euler angles. */
        thetaa = ( 2004.191903     +
          (   -0.4294934    +
          (   -0.04182264   +
          (   -0.000007089  +
          (   -0.0000001274 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        /* General precession. */
        pa = ( 5028.796195     +
          (    1.1054348    +
          (    0.00007964   +
          (   -0.000023857  +
          (    0.0000000383 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        /* Fukushima-Williams angles for precession. */
        gam = ( 10.556403     +
          (  0.4932044    +
          ( -0.00031238   +
          ( -0.000002788  +
          (  0.0000000260 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        phi = eps0 + ( -46.811015     +
          (   0.0511269    +
          (   0.00053289   +
          (  -0.000000440  +
          (  -0.0000000176 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R,

        psi = ( 5038.481507     +
          (    1.5584176    +
          (   -0.00018522   +
          (   -0.000026452  +
          (   -0.0000000148 )
          * t) * t) * t) * t) * t * CONSTANTS.ERFA_DAS2R;

      return {
        eps0: eps0,
        psia: psia,
        oma: oma,
        bpa: bpa,
        bqa: bqa,
        pia: pia,
        bpia: bpia,
        epsa: epsa,
        chia: chia,
        za: za,
        zetaa: zetaa,
        thetaa: thetaa,
        pa: pa,
        gam: gam,
        phi: phi,
        psi: psi
      }
    },
    /** void eraPb06(double date1, double date2, double *bzeta, double *bz, double *btheta); */
    pb06: function (date1, date2) {

      var bzetaBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        bzBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        bthetaBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPb06(date1, date2, bzetaBuffer, bzBuffer, bthetaBuffer);

      var ret = {
        bzeta: LIBERFA.HEAPF64[bzetaBuffer >> 3],
        btheta: LIBERFA.HEAPF64[bthetaBuffer >> 3],
        bz: LIBERFA.HEAPF64[bzBuffer >> 3]
      };

      LIBERFA._free(bzetaBuffer);
      LIBERFA._free(bthetaBuffer);
      LIBERFA._free(bzBuffer);

      return ret;

    },
    /** void eraPfw06(double date1, double date2, double *gamb, double *phib, double *psib, double *epsa); */
    pfw06: function (date1, date2) {

      var gambBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        phibBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        psibBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        epsaBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPfw06(date1, date2, gambBuffer, phibBuffer, psibBuffer, epsaBuffer);

      var ret = {
        gamb: LIBERFA.HEAPF64[gambBuffer >> 3],
        phib: LIBERFA.HEAPF64[phibBuffer >> 3],
        psib: LIBERFA.HEAPF64[psibBuffer >> 3],
        epsa: LIBERFA.HEAPF64[epsaBuffer >> 3]
      };

      LIBERFA._free(gambBuffer);
      LIBERFA._free(phibBuffer);
      LIBERFA._free(psibBuffer);
      LIBERFA._free(epsaBuffer);

      return ret;

    },
    /** void eraPmat00(double date1, double date2, double rbp[3][3]); */
    pmat00: function (date1, date2) {
      var rbpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPmat00(date1, date2, rbpBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rbpBuffer, 9)),3);

      LIBERFA._free(rbpBuffer);

      return ret;
    },
    /** void eraPmat06(double date1, double date2, double rbp[3][3]); */
    pmat06: function (date1, date2) {
      var rbpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPmat06(date1, date2, rbpBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rbpBuffer, 9)),3);

      LIBERFA._free(rbpBuffer);

      return ret;
    },
    /** void eraPmat76(double date1, double date2, double rmatp[3][3]); */
    pmat76: function (date1, date2) {
      var rmatpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPmat76(date1, date2, rmatpBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rmatpBuffer, 9)),3);

      LIBERFA._free(rmatpBuffer);

      return ret;
    },
    /** void eraPn00(double date1, double date2, double dpsi, double deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]); */
    pn00: function (date1, date2, dpsi, deps) {

      var epsaBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        rbBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPn00(date1, date2, dpsi, deps, epsaBuffer, rbBuffer, rpBuffer, rbpBuffer, rnBuffer, rbpnBuffer);


      var ret = {
        epsa: LIBERFA.HEAPF64[epsaBuffer >> 3],
        rb: SH.chunkArray(Array.from(readFloat64Buffer(rbBuffer, 9)),3),
        rp: SH.chunkArray(Array.from(readFloat64Buffer(rpBuffer, 9)),3),
        rbp: SH.chunkArray(Array.from(readFloat64Buffer(rbpBuffer, 9)),3),
        rn: SH.chunkArray(Array.from(readFloat64Buffer(rnBuffer, 9)),3),
        rbpn: SH.chunkArray(Array.from(readFloat64Buffer(rbpnBuffer, 9)),3),
      };

      LIBERFA._free(epsaBuffer);
      LIBERFA._free(rbBuffer);
      LIBERFA._free(rpBuffer);
      LIBERFA._free(rbpBuffer);
      LIBERFA._free(rnBuffer);
      LIBERFA._free(rbpnBuffer);


      return ret;
    },
    /** void eraPn00a(double date1, double date2, double *dpsi, double *deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]); */
    pn00a: function (date1, date2) {

      var dpsiBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        depsBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        epsaBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        rbBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPn00a(date1, date2, dpsiBuffer, depsBuffer, epsaBuffer, rbBuffer, rpBuffer, rbpBuffer, rnBuffer, rbpnBuffer);


      var ret = {
        dpsi: LIBERFA.HEAPF64[dpsiBuffer >> 3],
        deps: LIBERFA.HEAPF64[depsBuffer >> 3],
        epsa: LIBERFA.HEAPF64[epsaBuffer >> 3],
        rb: SH.chunkArray(Array.from(readFloat64Buffer(rbBuffer, 9)),3),
        rp: SH.chunkArray(Array.from(readFloat64Buffer(rpBuffer, 9)),3),
        rbp: SH.chunkArray(Array.from(readFloat64Buffer(rbpBuffer, 9)),3),
        rn: SH.chunkArray(Array.from(readFloat64Buffer(rnBuffer, 9)),3),
        rbpn: SH.chunkArray(Array.from(readFloat64Buffer(rbpnBuffer, 9)),3),
      };

      LIBERFA._free(dpsiBuffer);
      LIBERFA._free(depsBuffer);
      LIBERFA._free(epsaBuffer);
      LIBERFA._free(rbBuffer);
      LIBERFA._free(rpBuffer);
      LIBERFA._free(rbpBuffer);
      LIBERFA._free(rnBuffer);
      LIBERFA._free(rbpnBuffer);

      return ret;

    },
    /** void eraPn00b(double date1, double date2, double *dpsi, double *deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]); */
    pn00b: function (date1, date2) {

      var dpsiBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        depsBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        epsaBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        rbBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPn00b(date1, date2, dpsiBuffer, depsBuffer, epsaBuffer, rbBuffer, rpBuffer, rbpBuffer, rnBuffer, rbpnBuffer);


      var ret = {
        dpsi: LIBERFA.HEAPF64[dpsiBuffer >> 3],
        deps: LIBERFA.HEAPF64[depsBuffer >> 3],
        epsa: LIBERFA.HEAPF64[epsaBuffer >> 3],
        rb: SH.chunkArray(Array.from(readFloat64Buffer(rbBuffer, 9)),3),
        rp: SH.chunkArray(Array.from(readFloat64Buffer(rpBuffer, 9)),3),
        rbp: SH.chunkArray(Array.from(readFloat64Buffer(rbpBuffer, 9)),3),
        rn: SH.chunkArray(Array.from(readFloat64Buffer(rnBuffer, 9)),3),
        rbpn: SH.chunkArray(Array.from(readFloat64Buffer(rbpnBuffer, 9)),3),
      };

      LIBERFA._free(dpsiBuffer);
      LIBERFA._free(depsBuffer);
      LIBERFA._free(epsaBuffer);
      LIBERFA._free(rbBuffer);
      LIBERFA._free(rpBuffer);
      LIBERFA._free(rbpBuffer);
      LIBERFA._free(rnBuffer);
      LIBERFA._free(rbpnBuffer);

      return ret;

    },
    /** void eraPn06(double date1, double date2, double dpsi, double deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]); */
    pn06: function (date1, date2, dpsi, deps) {
      var dpsiBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        depsBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        epsaBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        rbBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPn06(date1, date2, dpsi, deps, epsaBuffer, rbBuffer, rpBuffer, rbpBuffer, rnBuffer, rbpnBuffer);


      var ret = {
        dpsi: LIBERFA.HEAPF64[dpsiBuffer >> 3],
        deps: LIBERFA.HEAPF64[depsBuffer >> 3],
        epsa: LIBERFA.HEAPF64[epsaBuffer >> 3],
        rb: SH.chunkArray(Array.from(readFloat64Buffer(rbBuffer, 9)),3),
        rp: SH.chunkArray(Array.from(readFloat64Buffer(rpBuffer, 9)),3),
        rbp: SH.chunkArray(Array.from(readFloat64Buffer(rbpBuffer, 9)),3),
        rn: SH.chunkArray(Array.from(readFloat64Buffer(rnBuffer, 9)),3),
        rbpn: SH.chunkArray(Array.from(readFloat64Buffer(rbpnBuffer, 9)),3),
      };

      LIBERFA._free(dpsiBuffer);
      LIBERFA._free(depsBuffer);
      LIBERFA._free(epsaBuffer);
      LIBERFA._free(rbBuffer);
      LIBERFA._free(rpBuffer);
      LIBERFA._free(rbpBuffer);
      LIBERFA._free(rnBuffer);
      LIBERFA._free(rbpnBuffer);

      return ret;

    },
    /** void eraPn06a(double date1, double date2, double *dpsi, double *deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]); */
    pn06a: function (date1, date2) {
      var dpsiBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        depsBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        epsaBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        rbBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT),
        rbpnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPn00b(date1, date2, dpsiBuffer, depsBuffer, epsaBuffer, rbBuffer, rpBuffer, rbpBuffer, rnBuffer, rbpnBuffer);


      var ret = {
        dpsi: LIBERFA.HEAPF64[dpsiBuffer >> 3],
        deps: LIBERFA.HEAPF64[depsBuffer >> 3],
        epsa: LIBERFA.HEAPF64[epsaBuffer >> 3],
        rb: SH.chunkArray(Array.from(readFloat64Buffer(rbBuffer, 9)),3),
        rp: SH.chunkArray(Array.from(readFloat64Buffer(rpBuffer, 9)),3),
        rbp: SH.chunkArray(Array.from(readFloat64Buffer(rbpBuffer, 9)),3),
        rn: SH.chunkArray(Array.from(readFloat64Buffer(rnBuffer, 9)),3),
        rbpn: SH.chunkArray(Array.from(readFloat64Buffer(rbpnBuffer, 9)),3),
      };

      LIBERFA._free(dpsiBuffer);
      LIBERFA._free(depsBuffer);
      LIBERFA._free(epsaBuffer);
      LIBERFA._free(rbBuffer);
      LIBERFA._free(rpBuffer);
      LIBERFA._free(rbpBuffer);
      LIBERFA._free(rnBuffer);
      LIBERFA._free(rbpnBuffer);

      return ret;
    },
    /** void eraPnm00a(double date1, double date2, double rbpn[3][3]); */
    pnm00a: function (date1, date2) {
      var rbpnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPnm00a(date1, date2, rbpnBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rbpnBuffer, 9)),3);

      LIBERFA._free(rbpnBuffer);

      return ret;
    },
    /** void eraPnm00b(double date1, double date2, double rbpn[3][3]); */
    pnm00b: function (date1, date2) {
      var rbpnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPnm00b(date1, date2, rbpnBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rbpnBuffer, 9)),3);

      LIBERFA._free(rbpnBuffer);

      return ret;
    },
    /** void eraPnm06a(double date1, double date2, double rnpb[3][3]); */
    pnm06a: function (date1, date2) {
      var rbpnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPnm06a(date1, date2, rbpnBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rbpnBuffer, 9)),3);

      LIBERFA._free(rbpnBuffer);

      return ret;
    },
    /** void eraPnm80(double date1, double date2, double rmatpn[3][3]); */
    pnm80: function (date1, date2) {
      var rmatpnBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPnm80(date1, date2, rmatpnBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rmatpnBuffer, 9)),3);

      LIBERFA._free(rmatpnBuffer);

      return ret;
    },
    /** void eraPom00(double xp, double yp, double sp, double rpom[3][3]); */
    pom00: function (xp, yp, sp) {
      var rpomBuffer = LIBERFA._malloc( 9 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPom00(xp, yp, sp, rpomBuffer);

      var ret = SH.chunkArray(Array.from(readFloat64Buffer(rpomBuffer, 9)),3);

      LIBERFA._free(rpomBuffer);

      return ret;
    },
    /** void eraPr00(double date1, double date2, double *dpsipr, double *depspr); */
    pr00: function (date1, date2) {

      var dpsiprBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        depsprBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraPr00(date1, date2, dpsiprBuffer, depsprBuffer);

      var ret = {
        dpsipr: LIBERFA.HEAPF64[dpsiprBuffer >> 3],
        depspr: LIBERFA.HEAPF64[depsprBuffer >> 3]
      };


      LIBERFA._free(dpsiprBuffer);
      LIBERFA._free(depsprBuffer);

      return ret;

    },
    /** void eraPrec76(double date01, double date02, double date11, double date12, double *zeta, double *z, double *theta); */
    prec76: function (date01, date02, date11, date12) {

      var zetaBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        zBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        thetaBuffer = LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraPrec76(date01, date02, date11, date12, zetaBuffer, zBuffer, thetaBuffer);

      var ret = {
        zeta: LIBERFA.HEAPF64[zetaBuffer >> 3],
        z: LIBERFA.HEAPF64[zBuffer >> 3],
        theta: LIBERFA.HEAPF64[thetaBuffer >> 3]
      };

      LIBERFA._free(zetaBuffer);
      LIBERFA._free(zBuffer);
      LIBERFA._free(thetaBuffer);

      return ret;

    },
    /** double eraS00(double date1, double date2, double x, double y); */
    s00: LIBERFA.cwrap('eraS00', 'number', ['number', 'number', 'number', 'number']),
    /** double eraS00a(double date1, double date2); */
    s00a: LIBERFA.cwrap('eraS00a', 'number', ['number', 'number']),
    /** double eraS00b(double date1, double date2); */
    s00b: LIBERFA.cwrap('eraS00b', 'number', ['number', 'number']),
    /** double eraS06(double date1, double date2, double x, double y); */
    s06: LIBERFA.cwrap('eraS06', 'number', ['number', 'number', 'number', 'number']),
    /** double eraS06a(double date1, double date2); */
    s06a: LIBERFA.cwrap('eraS06a', 'number', ['number', 'number']),
    /** double eraSp00(double date1, double date2); */
    sp00: LIBERFA.cwrap('eraSp00', 'number', ['number', 'number']),
    /** void eraXy06(double date1, double date2, double *x, double *y); */
    xy06: function (date1, date2) {
      var xBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        yBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraXy06(date1, date2, xBuffer, yBuffer);

      var ret = {
        x: LIBERFA.HEAPF64[xBuffer >> 3],
        y: LIBERFA.HEAPF64[yBuffer >> 3]
      };

      LIBERFA._free(xBuffer);
      LIBERFA._free(yBuffer);

      return ret;
    },
    /** void eraXys00a(double date1, double date2, double *x, double *y, double *s); */
    xys00a: function (date1, date2) {
      var xBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        yBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        sBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraXys00a(date1, date2, xBuffer, yBuffer, sBuffer);

      var ret = {
        x: LIBERFA.HEAPF64[xBuffer >> 3],
        y: LIBERFA.HEAPF64[yBuffer >> 3],
        s: LIBERFA.HEAPF64[sBuffer >> 3]
      };

      LIBERFA._free(xBuffer);
      LIBERFA._free(yBuffer);
      LIBERFA._free(sBuffer);

      return ret;
    },
    /** void eraXys00b(double date1, double date2, double *x, double *y, double *s); */
    xys00b: function (date1, date2) {
      var xBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        yBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        sBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraXys00b(date1, date2, xBuffer, yBuffer, sBuffer);

      var ret = {
        x: LIBERFA.HEAPF64[xBuffer >> 3],
        y: LIBERFA.HEAPF64[yBuffer >> 3],
        s: LIBERFA.HEAPF64[sBuffer >> 3]
      };

      LIBERFA._free(xBuffer);
      LIBERFA._free(yBuffer);
      LIBERFA._free(sBuffer);

      return ret;
    },
    /** void eraXys06a(double date1, double date2,  double *x, double *y, double *s); */
    xys06a: function (date1, date2) {
      var xBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        yBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
        sBuffer =  LIBERFA._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);


      LIBERFA._eraXys06a(date1, date2, xBuffer, yBuffer, sBuffer);

      var ret = {
        x: LIBERFA.HEAPF64[xBuffer >> 3],
        y: LIBERFA.HEAPF64[yBuffer >> 3],
        s: LIBERFA.HEAPF64[sBuffer >> 3]
      };

      LIBERFA._free(xBuffer);
      LIBERFA._free(yBuffer);
      LIBERFA._free(sBuffer);

      return ret;
    },
  };


})();