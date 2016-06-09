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

    module.exports = Object.assign(erfa,
      calendar, astrometry, ephemerides, fundamentalArguments,
      precessionNutation, rotationTime, spaceMotion, starCatalogs,
      galacticCoordinates
    );
})();