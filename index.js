(function () {
    "use strict";

    var LIBERFA = require('./lib/liberfa'),
        SH = require('./lib/struct-helper');

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
        /** helper to wrap writing to heap/buffer */
        writeFloat64Buffer = function (ptr, data) {
            for (var i = 0, c = data.length, ofs = ptr >> 3; i < c; i++) {
                LIBERFA.HEAPF64[ofs + i ]= data[i];
            }
        },
        /** helper to wrap rotations */
        rxyz = function (angle, axis, matrix) {
            var matrixBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT);
            
            writeFloat64Buffer(matrixBuffer, SH.flattenVector(matrix));
            
            LIBERFA['_eraR' + axis](angle,  matrixBuffer);
            
            var retMatrix = readFloat64Buffer(matrixBuffer, 3 * 3);

            LIBERFA._free(matrixBuffer);

            return SH.chunkArray(Array.from(retMatrix), 3);
        },
        /** helper that will read a buffer into an array */
        readFloat64Buffer = function (ptr, size) {
            var ret = new Float64Array(size);
            for(var i = 0, ofs = ptr >> 3; i < size; i++) {
                ret[i] = LIBERFA.HEAPF64[ofs + i];
            }

            return ret;
        },
        /* wrapper for the struct eraASTROM defined in erfam.h */
        /** Star-independent astrometry parameters */
        ASTROM = function (raw) {

            if (!raw) {
                raw = new Float64Array(ASTROM.STRUCT_SIZE);
                raw.fill(0);
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
        ASTROM.STRUCT_SIZE = 31;


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
            a = a.concat(SH.flattenVector(this[item]));
        }.bind(this));

        return a;
    };

    /* wrapper for the struct eraLDBODY defined in erfam.h */
    /** Body parameters for light deflection */
    var LDBODY = function(raw) {

        if (!raw) {
            raw = new Float64Array(LDBODY.STRUCT_SIZE);
            raw.fill(0);
        }

        /** mass of the body (solar masses) */
        this.bm = raw[0];
        /** deflection limiter (radians^2/2) */
        this.dl = raw[1];

        /* barycentric PV of the body (au, au/day) */
        this.pv =[
            [
                raw[2],
                raw[3],
                raw[4]
            ],
            [
                raw[5],
                raw[6],
                raw[7]
            ]];
        };
        LDBODY.STRUCT_SIZE = 8;
        LDBODY.prototype.toArray = function () {
            var a = [],
                propsOrder = ['bm', 'dl', 'pv'];

            propsOrder.forEach(function (item) {
                a = a.concat(SH.flattenVector(this[item]));
            }.bind(this));

            return a;
        };

    module.exports = {
        _Module : LIBERFA,
        ASTROM : ASTROM,
        LDBODY: LDBODY,
        // Astronomy/Calendars
        /** int eraCal2jd(int iy, int im, int id, double *djm0, double *djm); */
        cal2jd: function(iy, im, id) {

            var djm0Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                djmBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA._eraCal2jd(iy, im, id, djm0Buffer, djmBuffer),
                ret = {
                    status: status,
                    djm0: LIBERFA.HEAPF64[ djm0Buffer >> 3],
                    djm: LIBERFA.HEAPF64[ djmBuffer >> 3]
                };


            LIBERFA._free(djm0Buffer);
            LIBERFA._free(djmBuffer);

            return ret;
        },
        /** double eraEpb(double dj1, double dj2); */
        epb: LIBERFA.cwrap('eraEpb','number',['number','number']),
        /** void eraEpb2jd(double epb, double *djm0, double *djm); */
        epb2jd: function (epb){
            var djm0Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                djmBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA._eraEpb2jd(epb, djm0Buffer, djmBuffer),
                ret = {
                    status: status,
                    djm0: LIBERFA.HEAPF64[ djm0Buffer >> 3],
                    djm: LIBERFA.HEAPF64[ djmBuffer >> 3]
                };


            LIBERFA._free(djm0Buffer);
            LIBERFA._free(djmBuffer);

            return ret;
        },
        /** double eraEpj(double dj1, double dj2); */
        epj: LIBERFA.cwrap('eraEpj', 'number', ['number','number']),
        /** void eraEpj2jd(double epj, double *djm0, double *djm); */
        epj2jd: function (epj) {
            var djm0Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                djmBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA._eraEpj2jd(epj, djm0Buffer, djmBuffer),
                ret = {
                    status: status,
                    djm0: LIBERFA.HEAPF64[ djm0Buffer >> 3],
                    djm: LIBERFA.HEAPF64[ djmBuffer >> 3]
                };


            LIBERFA._free(djm0Buffer);
            LIBERFA._free(djmBuffer);

            return ret;
        },
        /** int eraJd2cal(double dj1, double dj2, int *iy, int *im, int *id, double *fd); */
        jd2cal: function (dj1, dj2) {
            var iyBuffer = LIBERFA._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                imBuffer = LIBERFA._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                idBuffer = LIBERFA._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                fBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            //we use ccall here so we don't need to mess about with string pointers etc..
            var status = LIBERFA._eraJd2cal(dj1, dj2, iyBuffer, imBuffer, idBuffer, fBuffer),
                ret = {
                    year: LIBERFA.HEAP32[iyBuffer>>2],
                    month: LIBERFA.HEAP32[imBuffer>>2],
                    day: LIBERFA.HEAP32[idBuffer>>2],
                    fraction: LIBERFA.HEAPF64[fBuffer>>3],
                    status: status
                };

            LIBERFA._free(iyBuffer);
            LIBERFA._free(imBuffer);
            LIBERFA._free(idBuffer);
            LIBERFA._free(fBuffer);

            return ret;
        },
        /** int eraJdcalf(int ndp, double dj1, double dj2, int iymdf[4]); */
        jdcalf: function (ndp, dj1, dj2) {
            var iymdfBuffer = LIBERFA._malloc(4 * Float64Array.BYTES_PER_ELEMENT);

            //we use ccall here so we don't need to mess about with string pointers etc..
            var status = LIBERFA._eraJdcalf(ndp, dj1, dj2, iymdfBuffer),
                ret = {
                    year: LIBERFA.HEAP32[(iymdfBuffer>>2) +0],
                    month: LIBERFA.HEAP32[(iymdfBuffer>>2) +1],
                    day: LIBERFA.HEAP32[(iymdfBuffer>>2) +2],
                    fraction: LIBERFA.HEAP32[(iymdfBuffer>>2) +3],
                    status: status
                };

            LIBERFA._free(iymdfBuffer);

            return ret;
        },

        //astrometry

        /** void eraAb(double pnat[3], double v[3], double s, double bm1, double ppr[3]); */
        ab: function (pnat, v, s, bm1) {
            var pnatBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
                vBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
                pprBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

                //pnatBuffer
                writeFloat64Buffer(pnatBuffer, pnat);
                writeFloat64Buffer(vBuffer, v);

                LIBERFA._eraAb(pnatBuffer, vBuffer, s, bm1, pprBuffer);

                var ret = [
                    LIBERFA.HEAPF64[(pprBuffer >> 3) + 0],
                    LIBERFA.HEAPF64[(pprBuffer >> 3) + 1],
                    LIBERFA.HEAPF64[(pprBuffer >> 3) + 2]
                ];

            LIBERFA._free(pnatBuffer);
            LIBERFA._free(vBuffer);
            LIBERFA._free(pprBuffer);

            return ret;

        },


        /** void eraApcg(double date1, double date2, double ebpv[2][3], double ehp[3], eraASTROM *astrom); */
        apcg: function (date1, date2, ebpv, ehp) {
            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),// this is the size of the struct, trust me
              ebpvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT),
              ehpBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(ebpvBuffer, SH.flattenVector(ebpv));
            writeFloat64Buffer(ehpBuffer, ehp);

            LIBERFA._eraApcg(date1, date2, ebpvBuffer, ehpBuffer, astromBuffer );

            var ret = readFloat64Buffer(astromBuffer, 31);

            LIBERFA._free(astromBuffer);
            LIBERFA._free(ebpvBuffer);
            LIBERFA._free(ehpBuffer);

            return new ASTROM(ret);
        },

        /** void eraApcg13(double date1, double date2, eraASTROM *astrom); */
        apcg13: function (date1, date2) {

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

            LIBERFA._eraApcg13(date1, date2, astromBuffer);

            var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);
            LIBERFA._free(astromBuffer);

            return new ASTROM(ret);
        },

        /** void eraApci(double date1, double date2, double ebpv[2][3], double ehp[3], double x, double y, double s, eraASTROM *astrom); */
        apci: function (date1, date2, ebpv, ehp, x, y, s) {

            var ebpvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT),
              ehpBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
              astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(ebpvBuffer, SH.flattenVector(ebpv));
            writeFloat64Buffer(ehpBuffer, ehp);

            LIBERFA._eraApci(date1, date2, ebpvBuffer, ehpBuffer, x, y, s, astromBuffer);

            var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);
            LIBERFA._free(astromBuffer);
            LIBERFA._free(ebpvBuffer);
            LIBERFA._free(ehpBuffer);

            return new ASTROM(ret);
        },
        /** void eraApci13(double date1, double date2, eraASTROM *astrom, double *eo);*/
        apci13: function (date1, date2) {

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
                eoBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            LIBERFA._eraApci13(date1, date2, astromBuffer, eoBuffer);

            var ret = {
                astrom: new ASTROM(readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE)),
                eo: LIBERFA.HEAPF64[ eoBuffer >>> 3]
            };

            LIBERFA._free(astromBuffer);
            LIBERFA._free(eoBuffer);


            return ret;
        },
        /** void eraApco(double date1, double date2, double ebpv[2][3], double ehp[3], double x, double y, double s, double theta, double elong, double phi, double hm, double xp, double yp, double sp, double refa, double refb, eraASTROM *astrom);*/
        apco: function (date1, date2, ebpv, ehp, x, y, s, theta, elong, phi, hm, xp, yp, sp, refa, refb) {

            var ebpvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT),
              ehpBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
              astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(ebpvBuffer, SH.flattenVector(ebpv));
            writeFloat64Buffer(ehpBuffer, ehp);

            LIBERFA._eraApco(date1, date2, ebpvBuffer, ehpBuffer, x, y, s, theta, elong, phi, hm, xp, yp, sp, refa, refb, astromBuffer);

            var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

            LIBERFA._free(astromBuffer);
            LIBERFA._free(ebpvBuffer);
            LIBERFA._free(ehpBuffer);

            return new ASTROM(ret);
        },
        /** int eraApco13(double utc1, double utc2, double dut1, double elong, double phi, double hm, double xp, double yp, double phpa, double tc, double rh, double wl, eraASTROM *astrom, double *eo);*/
        apco13: function (utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl) {

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
              eoBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);


            var j = LIBERFA._eraApco13(utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl, astromBuffer, eoBuffer);

            var ret = {
                astrom: new ASTROM(readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE)),
                eo: LIBERFA.HEAPF64[ eoBuffer >>> 3],
                status: j
            };

            LIBERFA._free(astromBuffer);
            LIBERFA._free(eoBuffer);

            return ret;
        },
        /** void eraApcs(double date1, double date2, double pv[2][3], double ebpv[2][3], double ehp[3], eraASTROM *astrom); */
        apcs: function (date1, date2, pv, ebpv, ehp) {

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
              pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT),
              ebpvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT),
              ehpBuffer = LIBERFA._malloc(3  * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pvBuffer, SH.flattenVector(pv));
            writeFloat64Buffer(ebpvBuffer, SH.flattenVector(ebpv));
            writeFloat64Buffer(ehpBuffer, ehp);

            LIBERFA._eraApcs(date1, date2, pvBuffer, ebpvBuffer, ehpBuffer, astromBuffer);

            var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

            LIBERFA._free(astromBuffer);
            LIBERFA._free(pvBuffer);
            LIBERFA._free(ebpvBuffer);
            LIBERFA._free(ehpBuffer);

            return new ASTROM(ret);
        },
        /** void eraApcs13(double date1, double date2, double pv[2][3], eraASTROM *astrom);*/
        apcs13: function (date1, date2, pv) {
            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
              pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pvBuffer, SH.flattenVector(pv));

            LIBERFA._eraApcs13(date1, date2, pvBuffer, astromBuffer);

            var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

            LIBERFA._free(astromBuffer);
            LIBERFA._free(pvBuffer);

            return new ASTROM(ret);

        },
        /** void eraAper(double theta, eraASTROM *astrom); */
        aper: function(theta, astrom) {

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(astromBuffer, astrom.toArray());

            LIBERFA._eraAper(theta, astromBuffer);

            var ret =readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

            LIBERFA._free(astromBuffer);

            return  new ASTROM(ret);//return the one we were passed in??
        },

        /** void eraAper13(double ut11, double ut12, eraASTROM *astrom); */
        aper13: function (ut11, ut12, astrom) {
            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(astromBuffer, astrom.toArray());

            LIBERFA._eraAper13(ut11, ut12, astromBuffer);

            var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

            LIBERFA._free(astromBuffer);

            return  new ASTROM(ret);//return the one we were passed in??
        },
        /** void eraApio(double sp, double theta, double elong, double phi, double hm, double xp, double yp, double refa, double refb, eraASTROM *astrom); */
        apio: function (sp, theta, elong, phi, hm, xp, yp, refa, refb) {
            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

            LIBERFA._eraApio(sp, theta, elong, phi, hm, xp, yp, refa, refb, astromBuffer);

            var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

            LIBERFA._free(astromBuffer);

            return  new ASTROM(ret);

        },
        /** int eraApio13(double utc1, double utc2, double dut1, double elong, double phi, double hm, double xp, double yp, double phpa, double tc, double rh, double wl, eraASTROM *astrom);*/
        apio13: function (utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl) {
            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA._eraApio13(utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl, astromBuffer);

            var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

            LIBERFA._free(astromBuffer);

            return  {
                astrom: new ASTROM(ret),
                status: status
            };
        },

        /** void eraAtci13(double rc, double dc, double pr, double pd, double px, double rv, double date1, double date2, double *ri, double *di, double *eo); */
        atci13: function (rc, dc, pr, pd, px, rv, date1, date2) {

            var eoBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                riBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                diBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT);

            LIBERFA._eraAtci13(rc, dc, pr, pd, px, rv, date1, date2, riBuffer, diBuffer, eoBuffer);

            var ret = {
                ri: LIBERFA.HEAPF64[ riBuffer >>> 3],
                di: LIBERFA.HEAPF64[ diBuffer >>> 3],
                eo: LIBERFA.HEAPF64[ eoBuffer >>> 3]
            };

            LIBERFA._free(diBuffer);
            LIBERFA._free(riBuffer);
            LIBERFA._free(eoBuffer);

            return ret;

        },
        /** void eraAtciq(double rc, double dc, double pr, double pd, double px, double rv, eraASTROM *astrom, double *ri, double *di); */
        atciq: function (rc, dc, pr, pd, px, rv, astrom) {

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
                riBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                diBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(astromBuffer, astrom.toArray());

            LIBERFA._eraAtciq(rc, dc, pr, pd, px, rv, astromBuffer, riBuffer, diBuffer);

            var ret = {
                ri: LIBERFA.HEAPF64[riBuffer >>> 3],
                di: LIBERFA.HEAPF64[diBuffer >>> 3]
            };

            LIBERFA._free(diBuffer);
            LIBERFA._free(riBuffer);
            LIBERFA._free(astromBuffer);

            return ret;
        },
        /** void eraAtciqn(double rc, double dc, double pr, double pd, double px, double rv, eraASTROM *astrom, int n, eraLDBODY b[], double *ri, double *di); */
        atciqn: function (rc, dc, pr, pd, px, rv, astrom, n, b) {

            var bSize = b.length * LDBODY.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT;

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
              riBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              diBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              bBuffer = LIBERFA._malloc(bSize);

            writeFloat64Buffer(astromBuffer, astrom.toArray());


            writeFloat64Buffer(bBuffer, SH.flattenVector(b.map(function (item){
                return item.toArray();
            })));

            LIBERFA._eraAtciqn(rc, dc, pr, pd, px, rv, astromBuffer, b.length, bBuffer, riBuffer, diBuffer);

            var ret = {
                ri: LIBERFA.HEAPF64[riBuffer >>> 3],
                di: LIBERFA.HEAPF64[diBuffer >>> 3]
            };

            LIBERFA._free(diBuffer);
            LIBERFA._free(riBuffer);
            LIBERFA._free(astromBuffer);
            LIBERFA._free(bBuffer);

            return ret;
        },
        /** void eraAtciqz(double rc, double dc, eraASTROM *astrom, double *ri, double *di); */
        atciqz: function (rc, dc, astrom) {

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
                riBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                diBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(astromBuffer, astrom.toArray());

            LIBERFA._eraAtciqz(rc, dc, astromBuffer, riBuffer, diBuffer);


            var ret = {
                ri: LIBERFA.HEAPF64[riBuffer >>> 3],
                di: LIBERFA.HEAPF64[diBuffer >>> 3]
            };

            LIBERFA._free(diBuffer);
            LIBERFA._free(riBuffer);
            LIBERFA._free(astromBuffer);

            return ret;
        },

        /** int eraAtco13(double rc, double dc, double pr, double pd, double px, double rv, double utc1, double utc2, double dut1, double elong, double phi, double hm, double xp, double yp, double phpa, double tc, double rh, double wl, double *aob, double *zob, double *hob, double *dob, double *rob, double *eo); */
        atco13: function (rc, dc, pr, pd, px, rv, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl) {

            var aobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                zobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                hobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                dobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                robBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                eoBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA._eraAtco13(
              rc, dc, pr, pd, px, rv, utc1, utc2, dut1,
              elong, phi, hm, xp, yp, phpa, tc, rh, wl,
              aobBuffer, zobBuffer, hobBuffer, dobBuffer,
              robBuffer, eoBuffer
            );

            var ret = {
                aob: LIBERFA.HEAPF64[aobBuffer >>> 3],
                zob: LIBERFA.HEAPF64[zobBuffer >>> 3],
                hob: LIBERFA.HEAPF64[hobBuffer >>> 3],
                dob: LIBERFA.HEAPF64[dobBuffer >>> 3],
                rob: LIBERFA.HEAPF64[robBuffer >>> 3],
                eo: LIBERFA.HEAPF64[eoBuffer >>> 3],
                status: status
            };

            LIBERFA._free(aobBuffer);
            LIBERFA._free(zobBuffer);
            LIBERFA._free(hobBuffer);
            LIBERFA._free(dobBuffer);
            LIBERFA._free(robBuffer);
            LIBERFA._free(eoBuffer);

            return ret;

        },

        /** void eraAtic13(double ri, double di, double date1, double date2, double *rc, double *dc, double *eo); */
        atic13: function (ri, di, date1, date2 ){
            var riBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                diBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                eoBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT);

            LIBERFA._eraAtic13(ri, di, date1, date2, riBuffer, diBuffer, eoBuffer);

            var ret = {
                rc: LIBERFA.HEAPF64[riBuffer >>> 3],
                dc: LIBERFA.HEAPF64[diBuffer >>> 3],
                eo: LIBERFA.HEAPF64[eoBuffer >>> 3]
            };

            LIBERFA._free(riBuffer);
            LIBERFA._free(diBuffer);
            LIBERFA._free(eoBuffer);

            return ret;
        },
        /** void eraAticq(double ri, double di, eraASTROM *astrom, double *rc, double *dc);*/
        aticq: function (ri, di, astrom) {
            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
              rcBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              dcBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(astromBuffer, astrom.toArray());

            LIBERFA._eraAticq(ri, di, astromBuffer, rcBuffer, dcBuffer);

            var ret = {
                rc: LIBERFA.HEAPF64[rcBuffer >>> 3],
                dc: LIBERFA.HEAPF64[dcBuffer >>> 3]
            };

            LIBERFA._free(rcBuffer);
            LIBERFA._free(dcBuffer);
            LIBERFA._free(astromBuffer);

            return ret;

        },
        /**void eraAticqn(double ri, double di, eraASTROM *astrom, int n, eraLDBODY b[], double *rc, double *dc);*/
        aticqn: function (ri, di, astrom, n, b) {

            var bSize = b.length * LDBODY.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT;

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
              rcBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              dcBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              bBuffer = LIBERFA._malloc(bSize);

            writeFloat64Buffer(astromBuffer, astrom.toArray());
            writeFloat64Buffer(bBuffer, SH.flattenVector(b.map(function (item){
                return item.toArray();
            })));

            LIBERFA._eraAticqn(ri, di, astromBuffer, b.length, bBuffer, rcBuffer, dcBuffer);

            var ret = {
                rc: LIBERFA.HEAPF64[rcBuffer >>> 3],
                dc: LIBERFA.HEAPF64[dcBuffer >>> 3]
            };

            LIBERFA._free(rcBuffer);
            LIBERFA._free(dcBuffer);
            LIBERFA._free(astromBuffer);
            LIBERFA._free(bBuffer);

            return ret;
        },
        /** int eraAtio13(double ri, double di, double utc1, double utc2, double dut1, double elong, double phi, double hm, double xp, double yp, double phpa, double tc, double rh, double wl, double *aob, double *zob, double *hob, double *dob, double *rob);*/
        atio13: function (ri, di, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl) {

            var aobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                zobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                hobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                dobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                robBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT);

            var j = LIBERFA._eraAtio13(ri, di, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl,
                                        aobBuffer, zobBuffer, hobBuffer,dobBuffer, robBuffer);

            var ret = {
                aob: LIBERFA.HEAPF64[aobBuffer >>> 3],
                zob: LIBERFA.HEAPF64[zobBuffer >>> 3],
                hob: LIBERFA.HEAPF64[hobBuffer >>> 3],
                dob: LIBERFA.HEAPF64[dobBuffer >>> 3],
                rob: LIBERFA.HEAPF64[robBuffer >>> 3],
                status: j
            };

            LIBERFA._free(aobBuffer);
            LIBERFA._free(zobBuffer);
            LIBERFA._free(hobBuffer);
            LIBERFA._free(dobBuffer);
            LIBERFA._free(robBuffer);

            return ret;
        },
        /** void eraAtioq(double ri, double di, eraASTROM *astrom, double *aob, double *zob, double *hob, double *dob, double *rob); */
        atioq: function (ri, di, astrom) {
            //double *aob, double *zob, double *hob, double *dob, double *rob

            var aobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              zobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              hobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              dobBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              robBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(astromBuffer, astrom.toArray());

            
            LIBERFA._eraAtioq(ri, di, astromBuffer,
              aobBuffer, zobBuffer, hobBuffer,dobBuffer, robBuffer);

            var ret = {
                aob: LIBERFA.HEAPF64[aobBuffer >>> 3],
                zob: LIBERFA.HEAPF64[zobBuffer >>> 3],
                hob: LIBERFA.HEAPF64[hobBuffer >>> 3],
                dob: LIBERFA.HEAPF64[dobBuffer >>> 3],
                rob: LIBERFA.HEAPF64[robBuffer >>> 3]
            };

            LIBERFA._free(aobBuffer);
            LIBERFA._free(zobBuffer);
            LIBERFA._free(hobBuffer);
            LIBERFA._free(dobBuffer);
            LIBERFA._free(robBuffer);
            LIBERFA._free(astromBuffer);

            return ret;
        },
        /** int eraAtoc13(const char *type, double ob1, double ob2, double utc1, double utc2, double dut1, double elong, double phi, double hm, double xp, double yp, double phpa, double tc, double rh, double wl, double *rc, double *dc); */
        atoc13: function (type, ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl) {

            var rcBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              dcBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              typeBuffer = LIBERFA._malloc(type.length);

            LIBERFA.writeStringToMemory(type, typeBuffer, false);

            var status = LIBERFA._eraAtoc13(typeBuffer, ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl, rcBuffer, dcBuffer);

            var ret = {
                rc: LIBERFA.HEAPF64[rcBuffer >>> 3],
                dc: LIBERFA.HEAPF64[dcBuffer >>> 3],
                status: status
            };

            LIBERFA._free(rcBuffer);
            LIBERFA._free(dcBuffer);

            return ret;

        },
        /** int eraAtoi13(const char *type, double ob1, double ob2, double utc1, double utc2, double dut1, double elong, double phi, double hm, double xp, double yp, double phpa, double tc, double rh, double wl, double *ri, double *di); */
        atoi13: function (type, ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl) {
            var riBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                diBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
                typeBuffer = LIBERFA._malloc(type.length);

            LIBERFA.writeStringToMemory(type, typeBuffer, false);

            var status = LIBERFA._eraAtoi13(typeBuffer, ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl, riBuffer, diBuffer);

            var ret = {
                ri: LIBERFA.HEAPF64[riBuffer >>> 3],
                di: LIBERFA.HEAPF64[diBuffer >>> 3],
                status: status
            };

            LIBERFA._free(riBuffer);
            LIBERFA._free(diBuffer);

            return ret;
        },
        /** void eraAtoiq(const char *type, double ob1, double ob2, eraASTROM *astrom, double *ri, double *di); */
        atoiq: function(type, ob1, ob2, astrom) {

            var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
              riBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              diBuffer = LIBERFA._malloc(1  * Float64Array.BYTES_PER_ELEMENT),
              typeBuffer = LIBERFA._malloc(type.length);

            LIBERFA.writeStringToMemory(type, typeBuffer, false);
            writeFloat64Buffer(astromBuffer, astrom.toArray());

            LIBERFA._eraAtoiq(typeBuffer, ob1, ob2, astromBuffer);

            var ret = {
                ri: LIBERFA.HEAPF64[riBuffer >>> 3],
                di: LIBERFA.HEAPF64[diBuffer >>> 3]
            };

            LIBERFA._free(riBuffer);
            LIBERFA._free(diBuffer);
            LIBERFA._free(astromBuffer);
            LIBERFA._free(typeBuffer);

            return ret;
        },
        /** void eraLd(double bm, double p[3], double q[3], double e[3], double em, double dlim, double p1[3]);*/
        ld: function (bm, p, q, e, em, dlim) {

            var pBuffer = LIBERFA._malloc(3  * Float64Array.BYTES_PER_ELEMENT),
                qBuffer = LIBERFA._malloc(3  * Float64Array.BYTES_PER_ELEMENT),
                eBuffer = LIBERFA._malloc(3  * Float64Array.BYTES_PER_ELEMENT),
                p1Buffer = LIBERFA._malloc(3  * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pBuffer, p);
            writeFloat64Buffer(qBuffer, q);
            writeFloat64Buffer(eBuffer, e);

            LIBERFA._eraLd(bm, pBuffer, qBuffer, eBuffer, em, dlim, p1Buffer);

            var ret = readFloat64Buffer(p1Buffer, 3);

            LIBERFA._free(pBuffer);
            LIBERFA._free(qBuffer);
            LIBERFA._free(eBuffer);

            return ret;
        },
        /** void eraLdn(int n, eraLDBODY b[], double ob[3], double sc[3], double sn[3]); */
        ldn: function (n, b, ob, sc) {

            var bSize = b.length * LDBODY.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT;
            var bBuffer = LIBERFA._malloc(bSize),
                obBuffer = LIBERFA._malloc(3  * Float64Array.BYTES_PER_ELEMENT),
                scBuffer = LIBERFA._malloc(3  * Float64Array.BYTES_PER_ELEMENT),
                snBuffer = LIBERFA._malloc(3  * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(obBuffer, ob);
            writeFloat64Buffer(scBuffer, sc);
            writeFloat64Buffer(bBuffer, SH.flattenVector(b.map(function (item){
                return item.toArray();
            })));

            LIBERFA._eraLdn(b.length, bBuffer, obBuffer, scBuffer, snBuffer);

            var ret = readFloat64Buffer(snBuffer, 3);

            LIBERFA._free(bBuffer);
            LIBERFA._free(obBuffer);
            LIBERFA._free(scBuffer);
            LIBERFA._free(snBuffer);

            return ret;

        },
        /** void eraLdsun(double p[3], double e[3], double em, double p1[3]);*/
        ldsun: function (p, e, em, p1) {

            var pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
                eBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
                p1Buffer = LIBERFA._malloc( 3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pBuffer, p);
            writeFloat64Buffer(eBuffer, e);

            LIBERFA._eraLdsun(pBuffer, eBuffer, em, p1Buffer);

            var ret = readFloat64Buffer(p1Buffer, 3);

            LIBERFA._free(pBuffer);
            LIBERFA._free(eBuffer);
            LIBERFA._free(p1Buffer);

            return ret;

        },
        /** void eraPmpx(double rc, double dc, double pr, double pd, double px, double rv, double pmt, double pob[3], double pco[3]);*/
        pmpx: function (rc, dc, pr, pd, px, rv, pmt, pob) {

            var pobBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
                pcoBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pobBuffer, pob);

            LIBERFA._eraPmpx(rc, dc, pr, pd, px, rv, pmt, pobBuffer, pcoBuffer);

            var ret = readFloat64Buffer(pcoBuffer, 3);

            LIBERFA._free(pobBuffer);
            LIBERFA._free(pcoBuffer);

            return ret;

        },
        /** int eraPmsafe(double ra1, double dec1, double pmr1, double pmd1, double px1, double rv1, double ep1a, double ep1b, double ep2a, double ep2b, double *ra2, double *dec2, double *pmr2, double *pmd2, double *px2, double *rv2); */
        pmsafe: function (ra1, dec1, pmr1, pmd1, px1, rv1, ep1a, ep1b, ep2a, ep2b) {
            //double *ra2, double *dec2, double *pmr2, double *pmd2, double *px2, double *rv2

            var ra2Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                dec2Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                pmr2Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                pmd2Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                px2Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                rv2Buffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);


            var status = LIBERFA._eraPmsafe(ra1, dec1, pmr1, pmd1, px1, rv1, ep1a, ep1b, ep2a, ep2b, ra2Buffer, dec2Buffer, pmr2Buffer, pmd2Buffer, px2Buffer, rv2Buffer);

            var ret = {
                status: status,
                ra2: LIBERFA.HEAPF64[ra2Buffer >>> 3],
                dec2: LIBERFA.HEAPF64[dec2Buffer >>> 3],
                pmr2: LIBERFA.HEAPF64[pmr2Buffer >>> 3],
                pmd2: LIBERFA.HEAPF64[pmd2Buffer >>> 3],
                px2: LIBERFA.HEAPF64[px2Buffer >>> 3],
                rv2: LIBERFA.HEAPF64[rv2Buffer >>> 3]
            };

            LIBERFA._free(ra2Buffer);
            LIBERFA._free(dec2Buffer);
            LIBERFA._free(pmr2Buffer);
            LIBERFA._free(pmd2Buffer);
            LIBERFA._free(px2Buffer);
            LIBERFA._free(rv2Buffer);

            return ret;
        },
        /** void eraPvtob(double elong, double phi, double height, double xp, double yp, double sp, double theta, double pv[2][3]);*/
        pvtob: function (elong, phi, height, xp, yp, sp, theta) {

          var pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT );
          LIBERFA._eraPvtob(elong, phi, height, xp, yp, sp, theta, pvBuffer);

          var pv = SH.chunkArray(Array.from(readFloat64Buffer(pvBuffer, 6)) ,3);

          LIBERFA._free(pvBuffer);

          return pv;

        },
        /** void eraRefco(double phpa, double tc, double rh, double wl, double *refa, double *refb); */
        refco: function (phpa, tc, rh, wl) {
            //refa, double *refb
            var refaBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                refbBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            LIBERFA._eraRefco(phpa, tc, rh, wl, refaBuffer, refbBuffer);

            var ret = {
                refa: LIBERFA.HEAPF64[refaBuffer >>> 3],
                refb: LIBERFA.HEAPF64[refbBuffer >>> 3]
            };

            LIBERFA._free(refaBuffer);
            LIBERFA._free(refbBuffer);

            return ret;
        },

        //ephemerides
        /** int eraEpv00(double date1, double date2, double pvh[2][3], double pvb[2][3]); */
        epv00: function(date1, date2) {

            var pvhBuffer = LIBERFA._malloc( 2 * 3 * Float64Array.BYTES_PER_ELEMENT),
                pvbBuffer = LIBERFA._malloc( 2 * 3 * Float64Array.BYTES_PER_ELEMENT);

            var status = LIBERFA._eraEpv00(date1, date2, pvhBuffer, pvbBuffer),
                ret = {
                    status: status,
                    //we leave these as arrays, as that is how the comeout/go in
                    pvh: [
                        [
                            LIBERFA.HEAPF64[(pvhBuffer>>3) +0],
                            LIBERFA.HEAPF64[(pvhBuffer>>3) +1],
                            LIBERFA.HEAPF64[(pvhBuffer>>3) +2]
                        ],
                        [
                            LIBERFA.HEAPF64[(pvhBuffer>>3) +3],
                            LIBERFA.HEAPF64[(pvhBuffer>>3) +4],
                            LIBERFA.HEAPF64[(pvhBuffer>>3) +5]
                        ]
                    ],
                    pvb: [
                        [
                            LIBERFA.HEAPF64[(pvbBuffer>>3) +0],
                            LIBERFA.HEAPF64[(pvbBuffer>>3) +1],
                            LIBERFA.HEAPF64[(pvbBuffer>>3) +2]
                        ],
                        [
                            LIBERFA.HEAPF64[(pvbBuffer>>3) +3],
                            LIBERFA.HEAPF64[(pvbBuffer>>3) +4],
                            LIBERFA.HEAPF64[(pvbBuffer>>3) +5]
                        ]
                    ]

                };

            LIBERFA._free(pvhBuffer);
            LIBERFA._free(pvbBuffer);

            return ret;
        },
        /** int eraPlan94(double date1, double date2, int np, double pv[2][3]); */
        plan94: function(date1, date2, np) {
            var pvBuffer = LIBERFA._malloc( 2  * 3 * Float64Array.BYTES_PER_ELEMENT);
            var status = LIBERFA._eraPlan94(date1, date2, np, pvBuffer),
                ret = {
                    status: status,
                    x: LIBERFA.HEAPF64[(pvBuffer>>3) +0],
                    y: LIBERFA.HEAPF64[(pvBuffer>>3) +1],
                    z: LIBERFA.HEAPF64[(pvBuffer>>3) +2],

                    vx: LIBERFA.HEAPF64[(pvBuffer>>3) +3],
                    vy: LIBERFA.HEAPF64[(pvBuffer>>3) +4],
                    vz: LIBERFA.HEAPF64[(pvBuffer>>3) +5]
                };

            LIBERFA._free(pvBuffer);

            return ret;
        },

        //Fundamental arguments
        /** double eraFal03(double t); */
        fal03: LIBERFA.cwrap('eraFal03', 'number', ['number']),
        /** double eraFalp03(double t); */
        falp03: LIBERFA.cwrap('eraFalp03', 'number', ['number']),
        /** double eraFaf03(double t); */
        faf03: LIBERFA.cwrap('eraFaf03', 'number', ['number']),
        /** double eraFad03(double t); */
        fad03: LIBERFA.cwrap('eraFad03', 'number', ['number']),
        /** double eraFaom03(double t); */
        faom03: LIBERFA.cwrap('eraFaom03', 'number', ['number']),
        /** double eraFave03(double t); */
        fave03: LIBERFA.cwrap('eraFave03', 'number', ['number']),
        /** double eraFae03(double t); */
        fae03: LIBERFA.cwrap('eraFae03', 'number', ['number']),
        /** double eraFapa03(double t); */
        fapa03: LIBERFA.cwrap('eraFapa03', 'number', ['number']),
        /** double eraFame03(double t); */
        fame03: LIBERFA.cwrap('eraFame03', 'number', ['number']),
        /** double eraFama03(double t); */
        fama03: LIBERFA.cwrap('eraFama03', 'number', ['number']),
        /** double eraFaju03(double t); */
        faju03: LIBERFA.cwrap('eraFaju03', 'number', ['number']),
        /** double eraFasa03(double t); */
        fasa03: LIBERFA.cwrap('eraFasa03', 'number', ['number']),
        /** double eraFaur03(double t); */
        faur03: LIBERFA.cwrap('eraFaur03', 'number', ['number']),
        /** double eraFane03(double t); */
        fane03: LIBERFA.cwrap('eraFane03', 'number', ['number']),

        //PrecNutPolar
        /*
        void eraBi00(double *dpsibi, double *depsbi, double *dra);
        void eraBp00(double date1, double date2, double rb[3][3], double rp[3][3], double rbp[3][3]);
        void eraBp06(double date1, double date2, double rb[3][3], double rp[3][3], double rbp[3][3]);
        void eraBpn2xy(double rbpn[3][3], double *x, double *y);
        void eraC2i00a(double date1, double date2, double rc2i[3][3]);
        void eraC2i00b(double date1, double date2, double rc2i[3][3]);
        void eraC2i06a(double date1, double date2, double rc2i[3][3]);
        void eraC2ibpn(double date1, double date2, double rbpn[3][3], double rc2i[3][3]);
        void eraC2ixy(double date1, double date2, double x, double y, double rc2i[3][3]);
        void eraC2ixys(double x, double y, double s, double rc2i[3][3]);
        void eraC2t00a(double tta, double ttb, double uta, double utb, double xp, double yp, double rc2t[3][3]);
        void eraC2t00b(double tta, double ttb, double uta, double utb, double xp, double yp, double rc2t[3][3]);
        void eraC2t06a(double tta, double ttb, double uta, double utb, double xp, double yp, double rc2t[3][3]);
        void eraC2tcio(double rc2i[3][3], double era, double rpom[3][3], double rc2t[3][3]);
        void eraC2teqx(double rbpn[3][3], double gst, double rpom[3][3], double rc2t[3][3]);
        void eraC2tpe(double tta, double ttb, double uta, double utb, double dpsi, double deps, double xp, double yp, double rc2t[3][3]);
        void eraC2txy(double tta, double ttb, double uta, double utb, double x, double y, double xp, double yp, double rc2t[3][3]);
        double eraEo06a(double date1, double date2);
        double eraEors(double rnpb[3][3], double s);
        void eraFw2m(double gamb, double phib, double psi, double eps, double r[3][3]);
        void eraFw2xy(double gamb, double phib, double psi, double eps, double *x, double *y);
        void eraNum00a(double date1, double date2, double rmatn[3][3]);
        void eraNum00b(double date1, double date2, double rmatn[3][3]);
        void eraNum06a(double date1, double date2, double rmatn[3][3]);
        void eraNumat(double epsa, double dpsi, double deps, double rmatn[3][3]);
        void eraNut00a(double date1, double date2, double *dpsi, double *deps);
        void eraNut00b(double date1, double date2, double *dpsi, double *deps);
        void eraNut06a(double date1, double date2, double *dpsi, double *deps);
        void eraNut80(double date1, double date2, double *dpsi, double *deps);
        void eraNutm80(double date1, double date2, double rmatn[3][3]);
        double eraObl06(double date1, double date2);
        double eraObl80(double date1, double date2);
        void eraP06e(double date1, double date2, double *eps0, double *psia, double *oma, double *bpa, double *bqa, double *pia, double *bpia, double *epsa, double *chia, double *za, double *zetaa, double *thetaa, double *pa, double *gam, double *phi, double *psi);
        void eraPb06(double date1, double date2, double *bzeta, double *bz, double *btheta);
        void eraPfw06(double date1, double date2, double *gamb, double *phib, double *psib, double *epsa);
        void eraPmat00(double date1, double date2, double rbp[3][3]);
        void eraPmat06(double date1, double date2, double rbp[3][3]);
        void eraPmat76(double date1, double date2, double rmatp[3][3]);
        void eraPn00(double date1, double date2, double dpsi, double deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]);
        void eraPn00a(double date1, double date2, double *dpsi, double *deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]);
        void eraPn00b(double date1, double date2, double *dpsi, double *deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]);
        void eraPn06(double date1, double date2, double dpsi, double deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]);
        void eraPn06a(double date1, double date2, double *dpsi, double *deps, double *epsa, double rb[3][3], double rp[3][3], double rbp[3][3], double rn[3][3], double rbpn[3][3]);
        void eraPnm00a(double date1, double date2, double rbpn[3][3]);
        void eraPnm00b(double date1, double date2, double rbpn[3][3]);
        void eraPnm06a(double date1, double date2, double rnpb[3][3]);
        void eraPnm80(double date1, double date2, double rmatpn[3][3]);
        void eraPom00(double xp, double yp, double sp, double rpom[3][3]);
        void eraPr00(double date1, double date2, double *dpsipr, double *depspr);
        void eraPrec76(double date01, double date02, double date11, double date12, double *zeta, double *z, double *theta);
        double eraS00(double date1, double date2, double x, double y);
        double eraS00a(double date1, double date2);
        double eraS00b(double date1, double date2);
        double eraS06(double date1, double date2, double x, double y);
        double eraS06a(double date1, double date2);
        double eraSp00(double date1, double date2);
        void eraXy06(double date1, double date2, double *x, double *y);
        void eraXys00a(double date1, double date2, double *x, double *y, double *s);
        void eraXys00b(double date1, double date2, double *x, double *y, double *s);
        void eraXys06a(double date1, double date2,  double *x, double *y, double *s);
    */
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

            var ret = LIBERFA._eraDat(iy, im, id, fd,deltaBuffer );

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
            /* do it the hard way to get the example below
            var rBuffer = LIBERFA._malloc( 3 * 3 * Float64Array.BYTES_PER_ELEMENT);

            LIBERFA._eraIr(rBuffer);

            var ret = SH.chunkArray(Array.from(readFloat64Buffer(rBuffer,3 * 3)),3);
            Module._free(rBuffer);

            return ret;
            */

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
        }

        //VectorOps

    };

})();