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
        precessionNutation = require('./src/precession-nutation'),
        rotationTime = require('./src/rotationTime'),
        spaceMotion = require('./src/space-motion'),
        starCatalogs = require('./src/star-catalogs'),
        galacticCoordinates =require('./src/galactic-coordinates'),
        geodeticGeocentric = require('./src/geodetic-geocentric'),
        timescales = require('./src/timescales'),
        angleOperations = require('./src/angle-operations'),
        vectorBuildRotations = require('./src/vector-build-rotations'),
        vectorCopyExtendExtract = require('./src/vector-copy-extend-extract'),
        vectorInitialisation = require('./src/vector-initialisation'),
        vectorRotation = require('./src/vector-rotations'),
        sphericalCartesian = require('./src/spherical-cartesian'),
        HH = require('./src/heap-helper'),
        ASTROM = require('./src/astrom'),
        LDBODY = require('./src/ldbody');


    var writeFloat64Buffer = HH.writeFloat64Buffer,
        readFloat64Buffer = HH.readFloat64Buffer;

    var erfa = {
        _Module : LIBERFA,
        ASTROM : ASTROM,
        LDBODY: LDBODY,
        CONSTANTS: CONSTANTS,


        





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

    module.exports = Object.assign(erfa,
      calendar, astrometry, ephemerides, fundamentalArguments,
      precessionNutation, rotationTime, spaceMotion, starCatalogs,
      galacticCoordinates, geodeticGeocentric, timescales, angleOperations, vectorBuildRotations,
      vectorCopyExtendExtract, vectorInitialisation, vectorRotation, sphericalCartesian
    );
})();