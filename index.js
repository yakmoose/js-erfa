(function () {
    "use strict";

    if (!Object.assign || !Map || !Float64Array.prototype.fill) {
        var s = require("es6-shim");

        // yeah, this is not shimmed in... and we kinda need it...
        if (!Float64Array.prototype.fill) {
            Float64Array.prototype.fill = s.Array.prototype.fill;
        }
    }

    var LIBERFA = require('./lib/liberfa'),
        SH = require('./src/struct-helper'),
        CONSTANTS = require('./src/constants'),
        calendar = require('./src/calendars'),
        astrometry = require('./src/astrometry'),
        fundamentalArguments = require('./src/fundamental-arguments'),
        ephemerides = require('./src/ephemerides'),
        HH = require('./src/heap-helper'),
        ASTROM = require('./src/astrom'),
        LDBODY = require('./src/ldbody');

    //simple wrappers that handle various heap/pointer shenanigans
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
        },
        /**
         * helper to simplfy buffers / pointers when converting between time scales
         * @param t1
         * @param t2
         * @param fn
         * @param symbol
         * @returns {{}}
         */
        timeScaleConvert = function (t1, t2, fn, symbol) {
            var t1Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                t2Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA[fn](t1, t2, t1Buffer, t2Buffer),
                ret = {};

            ret[ symbol + '1'] = LIBERFA.HEAPF64[t1Buffer >> 3];
            ret[ symbol + '2'] = LIBERFA.HEAPF64[t2Buffer >> 3];
            ret['status'] = status;

            LIBERFA._free(t1Buffer);
            LIBERFA._free(t2Buffer);

            return ret;
        },
        /** helper to simplfy buffers / pointers when converting between timecales with and additional correction factor */
        timeScaleConvertWithFactor = function (t1, t2, d, fn, symbol) {
            var t1Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                t2Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA[fn](t1, t2, d, t1Buffer, t2Buffer),
                ret = {};

            ret[ symbol + '1'] = LIBERFA.HEAPF64[t1Buffer >> 3];
            ret[ symbol + '2'] = LIBERFA.HEAPF64[t2Buffer >> 3];
            ret['status'] = status;

            LIBERFA._free(t1Buffer);
            LIBERFA._free(t2Buffer);

            return ret;
        },

        /** helper to wrap rotations */
        rxyz = function (angle, axis, matrix) {
            var matrixBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT);
            
            writeFloat64Buffer(matrixBuffer, SH.flattenVector(matrix));
            
            LIBERFA['_eraR' + axis](angle,  matrixBuffer);
            
            var retMatrix = readFloat64Buffer(matrixBuffer, 3 * 3);

            LIBERFA._free(matrixBuffer);

            return SH.chunkArray(Array.from(retMatrix), 3);
        };

    var writeFloat64Buffer = HH.writeFloat64Buffer,
        readFloat64Buffer = HH.readFloat64Buffer;

    var erfa = {
        _Module : LIBERFA,
        ASTROM : ASTROM,
        LDBODY: LDBODY,
        CONSTANTS: CONSTANTS,

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


        //Rotation and Time
        /** double eraEra00(double dj1, double dj2); */
        era00: LIBERFA.cwrap('eraEra00','number',['number','number']),
        /** double eraGmst06(double uta, double utb, double tta, double ttb); */
        gmst06: LIBERFA.cwrap('eraGmst06','number', ['number', 'number', 'number', 'number']),
        /**  double eraGmst00(double uta, double utb, double tta, double ttb); */
        gmst00: LIBERFA.cwrap('eraGmst00', 'number', ['number', 'number', 'number', 'number']),
        /** double eraGmst82(double dj1, double dj2); */
        gmst82: LIBERFA.cwrap('eraGmst82', 'number', ['number', 'number']),
        /** double eraGst06(double uta, double utb, double tta, double ttb, double rnpb[3][3]); */
        gst06: function (uta, utb, tta, ttb, rnpb) {

            var data = SH.flattenVector(rnpb),
                buffer = LIBERFA._malloc( data.length * Float64Array.BYTES_PER_ELEMENT),
                result;

            writeFloat64Buffer(buffer, data);

            result = LIBERFA._eraGst06(uta, utb, tta, ttb, buffer);
            LIBERFA._free(buffer);

            return result;

        },
        /** double eraGst00a(double uta, double utb, double tta, double ttb); */
        gst00a: LIBERFA.cwrap('eraGst00a', 'number', ['number', 'number', 'number', 'number']),
        /** double eraGst00b(double uta, double utb); */
        gst00b: LIBERFA.cwrap('eraGst00b', 'number', ['number', 'number']),
        /** double eraEe00a(double date1, double date2); */
        ee00a: LIBERFA.cwrap('eraEe00a', 'number', ['number', 'number']),
        /** double eraEe00b(double date1, double date2); */
        ee00b: LIBERFA.cwrap('eraEe00b', 'number', ['number', 'number']),
        /** double eraEe00(double date1, double date2, double epsa, double dpsi); */
        ee00: LIBERFA.cwrap('eraEe00', 'number', ['number', 'number', 'number', 'number']),
        /** double eraEect00(double date1, double date2); */
        eect00: LIBERFA.cwrap('eraEect00', 'number', ['number', 'number']),
        /** double eraEe06a(double date1, double date2); */
        ee06a: LIBERFA.cwrap('eraEe06a', 'number', ['number', 'number']),
        /** double eraEqeq94(double date1, double date2); */
        eqeq94: LIBERFA.cwrap('eraEqeq94', 'number', ['number', 'number']),
        /** double eraGst06a(double uta, double utb, double tta, double ttb); */
        gst06a: LIBERFA.cwrap('eraGst06a', 'number', ['number', 'number', 'number', 'number']),
        /** double eraGst94(double uta, double utb); */
        gst94: LIBERFA.cwrap('eraGst94', 'number', ['number', 'number']),

        //SpaceMotion
        /** int eraPvstar(double pv[2][3], double *ra, double *dec, double *pmr, double *pmd, double *px, double *rv); */
        pvstar: function (pv) {
            var data = SH.flattenVector(pv),
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

        //GeodeticGeocentric
        /** int eraEform(int n, double *a, double *f); */
        eform: function (n) {
            var aBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                fBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA._eraEform(n, aBuffer, fBuffer),
                ret = {
                    status: status,
                    a: LIBERFA.HEAPF64[ aBuffer >> 3],
                    f: LIBERFA.HEAPF64[ fBuffer >> 3]
                };

            LIBERFA._free(aBuffer);
            LIBERFA._free(fBuffer);

            return ret;
        },
        /** int eraGc2gd(int n, double xyz[3], double *elong, double *phi, double *height); */
        gc2gd: function (n, xyz) {

            var eBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                pBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                hBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                xyzBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(xyzBuffer, xyz);

            var status = LIBERFA._eraGc2gd(n, xyzBuffer, eBuffer, pBuffer, hBuffer),
                ret = {
                    status: status,
                    e: LIBERFA.HEAPF64[ eBuffer >> 3],
                    p: LIBERFA.HEAPF64[ pBuffer >> 3],
                    h: LIBERFA.HEAPF64[ hBuffer >> 3]
                };

            LIBERFA._free(eBuffer);
            LIBERFA._free(pBuffer);
            LIBERFA._free(hBuffer);
            LIBERFA._free(xyzBuffer);

            return ret;
        },
        /** int eraGc2gde(double a, double f, double xyz[3], double *elong, double *phi, double *height); */
        gc2gde: function (a, f, xyz) {
            var eBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                pBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                hBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                xyzBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(xyzBuffer, xyz);

            var status = LIBERFA._eraGc2gde(a, f, xyzBuffer, eBuffer, pBuffer, hBuffer),
                ret = {
                    status: status,
                    e: LIBERFA.HEAPF64[ eBuffer >> 3],
                    p: LIBERFA.HEAPF64[ pBuffer >> 3],
                    h: LIBERFA.HEAPF64[ hBuffer >> 3]
                };

            LIBERFA._free(eBuffer);
            LIBERFA._free(pBuffer);
            LIBERFA._free(hBuffer);
            LIBERFA._free(xyzBuffer);

            return ret;
        },
        /** int eraGd2gc(int n, double elong, double phi, double height, double xyz[3]); */
        gd2gc: function (n, elong, phi, height) {
            var xyzBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA._eraGd2gc(n, elong, phi, height, xyzBuffer),
                ret = {
                    status: status,
                    x: LIBERFA.HEAPF64[ (xyzBuffer >> 3) + 0 ],
                    y: LIBERFA.HEAPF64[ (xyzBuffer >> 3) + 1],
                    z: LIBERFA.HEAPF64[ (xyzBuffer >> 3) +2]
                };

            LIBERFA._free(xyzBuffer);

            return ret;
        },
        /** int eraGd2gce(double a, double f, double elong, double phi, double height, double xyz[3]); */
        gd2gce: function (a, f, elong, phi, height) {
            var xyzBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA._eraGd2gce(a, f, elong, phi, height, xyzBuffer),
                ret = {
                    status: status,
                    x: LIBERFA.HEAPF64[ (xyzBuffer >> 3) + 0 ],
                    y: LIBERFA.HEAPF64[ (xyzBuffer >> 3) + 1],
                    z: LIBERFA.HEAPF64[ (xyzBuffer >> 3) +2]
                };

            LIBERFA._free(xyzBuffer);

            return ret;

        },


        //Timescales
        /** int eraD2dtf(const char *scale, int ndp, double d1, double d2, int *iy, int *im, int *id, int ihmsf[4]); */
        d2dtf: function (scale, ndp, d1, d2 /*, int *iy, int *im, int *id, int ihmsf[4]*/) {

            var iyBuffer = LIBERFA._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                imBuffer = LIBERFA._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                idBuffer = LIBERFA._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                ihmsfBuffer = LIBERFA._malloc(4 * Int32Array.BYTES_PER_ELEMENT);

            //we use ccall here so we don't need to mess about with string pointers etc..
            var status = LIBERFA.ccall(
                    'eraD2dtf',
                    'number',
                    ['string','number','number','number','number','number','number','number'],
                    [scale, ndp, d1, d2, iyBuffer, imBuffer, idBuffer, ihmsfBuffer]
                ),
                ret = {
                    year: LIBERFA.HEAP32[iyBuffer>>2],
                    month: LIBERFA.HEAP32[imBuffer>>2],
                    day: LIBERFA.HEAP32[idBuffer>>2],
                    hour: LIBERFA.HEAP32[(ihmsfBuffer>>2) +0],
                    minute: LIBERFA.HEAP32[(ihmsfBuffer>>2) +1],
                    second: LIBERFA.HEAP32[(ihmsfBuffer>>2) +2],
                    fraction: LIBERFA.HEAP32[(ihmsfBuffer>>2) +3],
                    status: status
                };

            LIBERFA._free(iyBuffer);
            LIBERFA._free(imBuffer);
            LIBERFA._free(idBuffer);
            LIBERFA._free(ihmsfBuffer);

            return ret;

        },
        /** int eraDat(int iy, int im, int id, double fd, double *deltat); */
        dat: function (iy, im, id, fd) {

            var deltaBuffer = LIBERFA._malloc(4 * Float64Array.BYTES_PER_ELEMENT);

            var ret = LIBERFA._eraDat(iy, im, id, fd, deltaBuffer);

            //TODO: put this in an structure
            //if (ret != 0){
            //    //how to handle non normal results??
            //}

            ret = LIBERFA.HEAPF64[ deltaBuffer >> 3];

            LIBERFA._free(deltaBuffer);

            return ret;
        },
        /** double eraDtdb(double date1, double date2, double ut, double elong, double u, double v); */
        dtdb: LIBERFA.cwrap('eraDtdb', 'number', ['number','number','number','number','number','number']),
        /** int eraDtf2d(const char *scale, int iy, int im, int id, int ihr, int imn, double sec, double *d1, double *d2); */
        dtf2d : function (scale, iy, im, id, ihr, imn, sec) {
            var u1Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                u2Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            //we use ccall here so we don't need to mess about with string pointers etc..
            var status = LIBERFA.ccall(
                    'eraDtf2d',
                    'number',
                    ['string','number','number','number','number','number','number','number','number'],
                    [scale, iy, im, id, ihr, imn, sec, u1Buffer, u2Buffer]
                ),
                ret = {
                    u1: LIBERFA.HEAPF64[u1Buffer >> 3],
                    u2: LIBERFA.HEAPF64[u2Buffer >> 3],
                    status: status
                };

            LIBERFA._free(u1Buffer);
            LIBERFA._free(u2Buffer);

            return ret;

        },
        /** int eraTaitt(double tai1, double tai2, double *tt1, double *tt2); */
        taitt : function (tai1, tai2) {
            return timeScaleConvert(tai1, tai2, '_eraTaitt', 'tt');
        },
        /** int eraTaiut1(double tai1, double tai2, double dta, double *ut11, double *ut12); */
        taiut1: function (tai1, tai2, dta){
            return timeScaleConvertWithFactor(tai1, tai2, dta, '_eraTaiut1', 'ut1' );
        },
        /** int eraTaiutc(double tai1, double tai2, double *utc1, double *utc2); */
        taiutc: function (tai1, tai2) {
            return timeScaleConvert(tai1, tai2, '_eraTaiutc', 'utc');
        },
        /** int eraTcbtdb(double tcb1, double tcb2, double *tdb1, double *tdb2); */
        tcbtdb: function (tcb1, tcb2) {
            return timeScaleConvert(tcb1, tcb2,'_eraTcbtdb', 'tdb');
        },
        /** int eraTcgtt(double tcg1, double tcg2, double *tt1, double *tt2); */
        tcgtt: function (tcg1, tcg2) {
            return timeScaleConvert(tcg1, tcg2, '_eraTcgtt', 'tt');
        },
        /** int eraTdbtcb(double tdb1, double tdb2, double *tcb1, double *tcb2); */
        tdbtcb: function ( tdb1, tdb2) {
            return timeScaleConvert(tdb1, tdb2, '_eraTdbtcb', 'tcb');
        },
        /** int eraTdbtt(double tdb1, double tdb2, double dtr, double *tt1, double *tt2); */
        tdbtt: function (tdb1, tdb2, dtr) {
            return timeScaleConvertWithFactor(tdb1, tdb2, dtr, '_eraTdbtt', 'tt' );
        },
        /** int eraTttai(double tt1, double tt2, double *tai1, double *tai2); */
        tttai : function (tt1, tt2) {
            return timeScaleConvert(tt1, tt2, '_eraTttai','tai');
        },
        /** int eraTttcg(double tt1, double tt2, double *tcg1, double *tcg2); */
        tttcg: function (tt1, tt2){
            return timeScaleConvert(tt1, tt2,'_eraTttcg','tcg');
        },
        /** int eraTttdb(double tt1, double tt2, double dtr, double *tdb1, double *tdb2); */
        tttdb : function (tt1, tt2, dtr) {
            return timeScaleConvertWithFactor(tt1, tt2, dtr,'_eraTttdb','tdb');
        },
        /** int eraTtut1(double tt1, double tt2, double dt, double *ut11, double *ut12); */
        ttut1 : function (tt1, tt2, dt) {
            return timeScaleConvertWithFactor(tt1, tt2, dt,'_eraTtut1','ut1');
        },
        /** int eraUt1tai(double ut11, double ut12, double dta, double *tai1, double *tai2); */
        ut1tai : function ( ut11, ut12, dta) {
            return timeScaleConvertWithFactor(ut11, ut12, dta, '_eraUt1tai','tai');
        },
        /** int eraUt1tt(double ut11, double ut12, double dt, double *tt1, double *tt2); */
        ut1tt : function (ut11, ut12, dt) {
            return timeScaleConvertWithFactor(ut11, ut12, dt, '_eraUt1tt','tt');
        },
        /** int eraUt1utc(double ut11, double ut12, double dut1, double *utc1, double *utc2); */
        ut1utc : function (ut11, ut12, dut1) {
            return timeScaleConvertWithFactor(ut11, ut12, dut1, '_eraUt1utc', 'utc');
        },
        /** int eraUtctai(double utc1, double utc2, double *tai1, double *tai2); */
        utctai : function(utc1, utc2){
            return timeScaleConvert(utc1, utc2, '_eraUtctai','tai')
        },
        /** int eraUtcut1(double utc1, double utc2, double dut1, double *ut11, double *ut12); */
        utcut1 : function (utc1, utc2, dut1) {
            return timeScaleConvertWithFactor(utc1, utc2, dut1,'_eraUtcut1','ut1');
        },

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

        //BuildRotations
        /** void eraRx(double phi, double r[3][3]); */
        rx: function (phi, r) {
            return rxyz(phi, 'x', r);
        },
        /** void eraRy(double theta, double r[3][3]); */
        ry: function (theta, r) {
            return rxyz(theta, 'y', r);
        },

        /** void eraRz(double psi, double r[3][3]);*/
        rz: function (psi, r) {
            return rxyz(psi, 'z', r);
        },

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
        
        //Initialization
        /** void eraIr(double r[3][3]); */
        ir: function () {
            //do this here, instead of lots of crazy calls back and forth into the library
            return [ [1.0, 0.0, 0.0], [0.0, 1.0, 0,0], [0.0, 0.0, 1.0]];
        },
        /** void eraZp(double p[3]); */
        zp: function () {
            //again, we could do this the hardway, but since we are going for
            // some level of immutability, we just disgard what we are supplied with
            // and return the zeroed out array
            return [0, 0, 0];
        },
        /** void eraZpv(double pv[2][3]); */
        zpv: function () {
            //as above, we are only returning a simple vector, do not need to call into
            // the core library
            return [
                this.zp(),
                this.zp()
            ];
        },
        /** void eraZr(double r[3][3]); */
        zr: function () {
            //notes as zp...
            return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        },
        //MatrixOps
        /** void eraRxr(double a[3][3], double b[3][3], double atb[3][3]); */
        rxr: function (a, b) {
            var aBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT),
                bBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT),
                atbBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(aBuffer, SH.flattenVector(a));
            writeFloat64Buffer(bBuffer, SH.flattenVector(b));

            LIBERFA._eraRxr(aBuffer, bBuffer, atbBuffer);

            var atb = SH.chunkArray(Array.from(readFloat64Buffer(atbBuffer, 3*3)), 3);

            LIBERFA._free(aBuffer);
            LIBERFA._free(bBuffer);
            LIBERFA._free(atbBuffer);

            return atb;
        },
        /** void eraTr(double r[3][3], double rt[3][3]); */
        tr: function (r) {

            var rBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT),
                rtBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(rBuffer, SH.flattenVector(r));
            LIBERFA._eraTr(rBuffer, rtBuffer);

            var rt = SH.chunkArray(Array.from(readFloat64Buffer(rtBuffer, 3 *3)), 3);

            LIBERFA._free(rBuffer);
            LIBERFA._free(rtBuffer);

            return rt;

        },
        //MatrixVectorProducts
        /** void eraRxp(double r[3][3], double p[3], double rp[3]); */
        rxp: function (r, p) {
            var rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT),
                pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
                rpBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(rBuffer, SH.flattenVector(r));
            writeFloat64Buffer(pBuffer, p);

            LIBERFA._eraRxp(rBuffer, pBuffer, rpBuffer);

            var ret = readFloat64Buffer(rpBuffer, 3);

            LIBERFA._free(rBuffer);
            LIBERFA._free(pBuffer);
            LIBERFA._free(rpBuffer);

            return ret;

        },
        /** void eraRxpv(double r[3][3], double pv[2][3], double rpv[2][3]); */
        rxpv: function (r, pv) {

            var rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT),
                pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT),
                rpvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(rBuffer, SH.flattenVector(r));
            writeFloat64Buffer(pvBuffer, SH.flattenVector(pv));

            LIBERFA._eraRxpv(rBuffer, pvBuffer, rpvBuffer);

            var ret = SH.chunkArray(Array.from(readFloat64Buffer(rpvBuffer, 6)), 3);

            LIBERFA._free(rBuffer);
            LIBERFA._free(pvBuffer);
            LIBERFA._free(rpvBuffer);

            return ret;

        },
        /** void eraTrxp(double r[3][3], double p[3], double trp[3]); */
        trxp: function (r, p) {
            var rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT),
                pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
                rpBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(rBuffer, SH.flattenVector(r));
            writeFloat64Buffer(pBuffer, p);

            LIBERFA._eraTrxp(rBuffer, pBuffer, rpBuffer);

            var ret = readFloat64Buffer(rpBuffer, 3);

            LIBERFA._free(rBuffer);
            LIBERFA._free(pBuffer);
            LIBERFA._free(rpBuffer);

            return ret;
        },
        /** void eraTrxpv(double r[3][3], double pv[2][3], double trpv[2][3]); */
        trxpv: function (r, pv) {
            var rBuffer = LIBERFA._malloc(9 * Float64Array.BYTES_PER_ELEMENT),
                pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT),
                rpvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(rBuffer, SH.flattenVector(r));
            writeFloat64Buffer(pvBuffer, SH.flattenVector(pv));

            LIBERFA._eraTrxpv(rBuffer, pvBuffer, rpvBuffer);

            var ret = SH.chunkArray(Array.from(readFloat64Buffer(rpvBuffer, 6)), 3);

            LIBERFA._free(rBuffer);
            LIBERFA._free(pvBuffer);
            LIBERFA._free(rpvBuffer);

            return ret;

        },

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

        //SphericalCartesian
        /** void eraC2s(double p[3], double *theta, double *phi); */
        c2s: function (p) {
          var pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
              thetaBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
              phiBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

          writeFloat64Buffer(pBuffer, SH.flattenVector(p));

          LIBERFA._eraC2s(pBuffer, thetaBuffer, phiBuffer);

          var ret = {
            theta: LIBERFA.HEAPF64[thetaBuffer >> 3],
            phi: LIBERFA.HEAPF64[phiBuffer >> 3]
          };

          LIBERFA._free(pBuffer);
          LIBERFA._free(thetaBuffer);
          LIBERFA._free(phiBuffer);

          return ret;
        },
        /** void eraP2s(double p[3], double *theta, double *phi, double *r); */
        p2s: function (p) {

          var pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
            thetaBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
            phiBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
            rBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

          writeFloat64Buffer(pBuffer, SH.flattenVector(p));

          LIBERFA._eraP2s(pBuffer, thetaBuffer, phiBuffer, rBuffer);

          var ret = {
            theta: LIBERFA.HEAPF64[thetaBuffer >> 3],
            phi: LIBERFA.HEAPF64[phiBuffer >> 3],
            r: LIBERFA.HEAPF64[rBuffer >> 3]
          };

          LIBERFA._free(pBuffer);
          LIBERFA._free(thetaBuffer);
          LIBERFA._free(phiBuffer);
          LIBERFA._free(rBuffer);

          return ret;
        },
        /** void eraPv2s(double pv[2][3], double *theta, double *phi, double *r, double *td, double *pd, double *rd); */
        pv2s: function (p) {
          var pvBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
            thetaBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
            phiBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
            rBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
            tdBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
            pdBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
            rdBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

          writeFloat64Buffer(pvBuffer, SH.flattenVector(p));

          LIBERFA._eraPv2s(pvBuffer, thetaBuffer, phiBuffer, rBuffer, tdBuffer, pdBuffer, rdBuffer);

          var ret = {
            theta: LIBERFA.HEAPF64[thetaBuffer >> 3],
            phi: LIBERFA.HEAPF64[phiBuffer >> 3],
            r: LIBERFA.HEAPF64[rBuffer >> 3],
            td: LIBERFA.HEAPF64[tdBuffer >> 3],
            pd: LIBERFA.HEAPF64[pdBuffer >> 3],
            rd: LIBERFA.HEAPF64[rdBuffer >> 3]
          };

          LIBERFA._free(pvBuffer);
          LIBERFA._free(thetaBuffer);
          LIBERFA._free(phiBuffer);
          LIBERFA._free(rBuffer);
          LIBERFA._free(tdBuffer);
          LIBERFA._free(pdBuffer);
          LIBERFA._free(rdBuffer);

          return ret;
        },
        /** void eraS2c(double theta, double phi, double c[3]); */
        s2c: function (theta, phi) {

          var cBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);


          LIBERFA._eraS2c(theta, phi, cBuffer);

          var ret = readFloat64Buffer(cBuffer, 3);

          LIBERFA._free(cBuffer);

          return ret;
        },
        /** void eraS2p(double theta, double phi, double r, double p[3]); */
        s2p: function (theta, phi, r) {
          var pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);


          LIBERFA._eraS2p(theta, phi, r, pBuffer);

          var ret = readFloat64Buffer(pBuffer, 3);

          LIBERFA._free(pBuffer);

          return ret;
        },
        /** void eraS2pv(double theta, double phi, double r, double td, double pd, double rd, double pv[2][3]); */
        s2pv: function (theta, phi, r, td, pd, rd) {
          var pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);


          LIBERFA._eraS2pv(theta, phi, r, td, pd, rd, pvBuffer);

          var ret = SH.chunkArray(Array.from(readFloat64Buffer(pvBuffer, 6)), 3);

          LIBERFA._free(pvBuffer);

          return ret;
        },

        //VectorOps
        /** double eraPdp(double a[3], double b[3]); */
        pdp: function (a, b) {
            var w  = a[0] * b[0]
              + a[1] * b[1]
              + a[2] * b[2];

            return w;
        },
        /** double eraPm(double p[3]); */
        pm: function (p) {
            return Math.sqrt(p[0]*p[0] + p[1]*p[1] + p[2]*p[2]);
        },
        /** void eraPmp(double a[3], double b[3], double amb[3]); */
        pmp: function (a, b) {
            return [
                a[0] - b[0],
                a[1] - b[1],
                a[2] - b[2]
            ];
        },
        /** void eraPn(double p[3], double *r, double u[3]); */
        pn: function pn(p) {

            var pBuffer = LIBERFA._malloc(p.length * Float64Array.BYTES_PER_ELEMENT),
                rBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                uBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pBuffer, p);

            LIBERFA._eraPn(pBuffer, rBuffer, uBuffer);

            var ret = {
                r: LIBERFA.HEAPF64[rBuffer >> 3],
                u: readFloat64Buffer(uBuffer, 3)
            };

            LIBERFA._free(pBuffer);
            LIBERFA._free(rBuffer);
            LIBERFA._free(uBuffer);

            return ret;


        },
        /** void eraPpp(double a[3], double b[3], double apb[3]); */
        ppp: function (a, b) {
          return [
            a[0] + b[0],
            a[1] + b[1],
            a[2] + b[2]
          ];

        },
        /** void eraPpsp(double a[3], double s, double b[3], double apsb[3]); */
        ppsp: function(a, s, b) {
            var aBuffer = LIBERFA._malloc(a.length * Float64Array.BYTES_PER_ELEMENT),
                bBuffer = LIBERFA._malloc(b.length * Float64Array.BYTES_PER_ELEMENT),
                apsbBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(aBuffer, a);
            writeFloat64Buffer(bBuffer, b);

            LIBERFA._eraPpsp(aBuffer, s, bBuffer, apsbBuffer);

            var ret = readFloat64Buffer(apsbBuffer, 3);

            LIBERFA._free(aBuffer);
            LIBERFA._free(bBuffer);
            LIBERFA._free(apsbBuffer);

            return ret;

        },
        /** void eraPvdpv(double a[2][3], double b[2][3], double adb[2]); */
        pvdpv: function (a, b) {

            a = SH.flattenVector(a);
            b = SH.flattenVector(b);

            var aBuffer = LIBERFA._malloc(a.length * Float64Array.BYTES_PER_ELEMENT),
              bBuffer = LIBERFA._malloc(b.length * Float64Array.BYTES_PER_ELEMENT),
              adbBuffer = LIBERFA._malloc(2 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(aBuffer, a);
            writeFloat64Buffer(bBuffer, b);

            LIBERFA._eraPvdpv(aBuffer, bBuffer, adbBuffer);

            var ret = readFloat64Buffer(adbBuffer, 2);

            LIBERFA._free(aBuffer);
            LIBERFA._free(bBuffer);
            LIBERFA._free(adbBuffer);

            return ret;

        },
        /** void eraPvm(double pv[2][3], double *r, double *s); */
        pvm: function (pv) {

            pv = SH.flattenVector(pv);

            var pvBuffer = LIBERFA._malloc(pv.length * Float64Array.BYTES_PER_ELEMENT),
                rBuffer = LIBERFA._malloc(Float64Array.BYTES_PER_ELEMENT),
                sBuffer = LIBERFA._malloc(Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pvBuffer, pv);

            LIBERFA._eraPvm(pvBuffer, rBuffer, sBuffer);

            var ret = {
                r: LIBERFA.HEAPF64[rBuffer >> 3],
                s: LIBERFA.HEAPF64[sBuffer >> 3]
            };

            LIBERFA._free(pvBuffer);
            LIBERFA._free(rBuffer);
            LIBERFA._free(sBuffer);

            return ret;

        },
        /** void eraPvmpv(double a[2][3], double b[2][3], double amb[2][3]); */
        pvmpv: function(a, b) {

            a = SH.flattenVector(a);
            b = SH.flattenVector(b);

            var aBuffer = LIBERFA._malloc(a.length * Float64Array.BYTES_PER_ELEMENT),
                bBuffer = LIBERFA._malloc(b.length * Float64Array.BYTES_PER_ELEMENT),
                ambBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(aBuffer, a);
            writeFloat64Buffer(bBuffer, b);

            LIBERFA._eraPvmpv(aBuffer, bBuffer, ambBuffer);

            var ret = SH.chunkArray(Array.from(readFloat64Buffer(ambBuffer, 6)), 3);

            LIBERFA._free(aBuffer);
            LIBERFA._free(bBuffer);
            LIBERFA._free(ambBuffer);

            return ret;
        },
        /** void eraPvppv(double a[2][3], double b[2][3], double apb[2][3]); */
        pvppv: function (a, b) {

            a = SH.flattenVector(a);
            b = SH.flattenVector(b);

            var aBuffer = LIBERFA._malloc(a.length * Float64Array.BYTES_PER_ELEMENT),
                bBuffer = LIBERFA._malloc(b.length * Float64Array.BYTES_PER_ELEMENT),
                apbBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(aBuffer, a);
            writeFloat64Buffer(bBuffer, b);

            LIBERFA._eraPvppv(aBuffer, bBuffer, apbBuffer);

            var ret = SH.chunkArray(Array.from(readFloat64Buffer(apbBuffer, 6)), 3);

            LIBERFA._free(aBuffer);
            LIBERFA._free(bBuffer);
            LIBERFA._free(apbBuffer);

            return ret;
        },
        /** void eraPvu(double dt, double pv[2][3], double upv[2][3]); */
        pvu: function (dt, pv, upv) {
            pv = SH.flattenVector(pv);

            var pvBuffer = LIBERFA._malloc(pv.length * Float64Array.BYTES_PER_ELEMENT),
                upvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pvBuffer, pv);

            LIBERFA._eraPvu(dt, pvBuffer, upvBuffer);

            var ret = SH.chunkArray(Array.from(readFloat64Buffer(upvBuffer, 6)), 3);

            LIBERFA._free(pvBuffer);
            LIBERFA._free(upvBuffer);

            return ret;

        },
        /** void eraPvup(double dt, double pv[2][3], double p[3]); */
        pvup: function (dt, pv) {
            return [
                pv[0][0] + dt * pv[1][0],
                pv[0][1] + dt * pv[1][1],
                pv[0][2] + dt * pv[1][2]
            ];

        },
        /** void eraPvxpv(double a[2][3], double b[2][3], double axb[2][3]); */
        pvxpv: function (a, b) {

            a = SH.flattenVector(a);
            b = SH.flattenVector(b);

            var aBuffer = LIBERFA._malloc(a.length * Float64Array.BYTES_PER_ELEMENT),
              bBuffer = LIBERFA._malloc(b.length * Float64Array.BYTES_PER_ELEMENT),
              axbBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(aBuffer, a);
            writeFloat64Buffer(bBuffer, b);

            LIBERFA._eraPvxpv(aBuffer, bBuffer, axbBuffer);

            var ret = SH.chunkArray(Array.from(readFloat64Buffer(axbBuffer, 6)), 3);

            LIBERFA._free(aBuffer);
            LIBERFA._free(bBuffer);
            LIBERFA._free(axbBuffer);

            return ret;

        },
        /** void eraPxp(double a[3], double b[3], double axb[3]); */
        pxp: function (a, b) {

            var aBuffer = LIBERFA._malloc(a.length * Float64Array.BYTES_PER_ELEMENT),
              bBuffer = LIBERFA._malloc(b.length * Float64Array.BYTES_PER_ELEMENT),
              axbBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(aBuffer, a);
            writeFloat64Buffer(bBuffer, b);

            LIBERFA._eraPxp(aBuffer, bBuffer, axbBuffer);

            var ret = readFloat64Buffer(axbBuffer, 3);

            LIBERFA._free(aBuffer);
            LIBERFA._free(bBuffer);
            LIBERFA._free(axbBuffer);

            return ret;
        },

        /** void eraS2xpv(double s1, double s2, double pv[2][3], double spv[2][3]); */
        s2xpv: function (s1, s2, pv) {

            pv = SH.flattenVector(pv);

            var pvBuffer = LIBERFA._malloc(pv.length * Float64Array.BYTES_PER_ELEMENT),
                spvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pvBuffer, pv);

            LIBERFA._eraS2xpv(s1, s2, pvBuffer, spvBuffer);

            var ret = SH.chunkArray(Array.from(readFloat64Buffer(spvBuffer, 6)), 3);


            LIBERFA._free(pvBuffer);
            LIBERFA._free(spvBuffer);

            return ret;

        },
        /** void eraSxp(double s, double p[3], double sp[3]); */
        sxp: function (s, p) {
            return    [s * p[0], s * p[1], s * p[2]];
        },
        /** void eraSxpv(double s, double pv[2][3], double spv[2][3]); */
        sxpv: function (s, pv) {
            return this.s2xpv(s, s, pv);
        }
    };

    module.exports = Object.assign(erfa, calendar, astrometry, ephemerides, fundamentalArguments);
})();