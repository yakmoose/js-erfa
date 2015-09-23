(function () {
    "use strict";

    var Module = require('./lib/liberfa'),
        SH = require('./lib/struct-helper');

    //simple wrappers that handle various heap/pointer shenanigans
    var angleToDMSF = function (fn,ndp, angle ) {
            var signBuffer = Module._malloc(1 * Uint8Array.BYTES_PER_ELEMENT),// one byte for the sign char
                idmsBuffer = Module._malloc(4 * Int32Array.BYTES_PER_ELEMENT),
                ofs = idmsBuffer>> 2,
                status = Module[fn](ndp, angle, signBuffer, idmsBuffer),

            //we want to return a sensible structure not just a chunk of memory
            ret =  {
                status: status,
                sign: String.fromCharCode( Module.HEAP8[signBuffer]),
                degrees: Module.HEAP32[ ofs + 0 ],
                minutes: Module.HEAP32[ ofs + 1 ],
                seconds: Module.HEAP32[ ofs + 2 ],
                fraction: Module.HEAP32[ ofs + 3 ]
            };

            Module._free(signBuffer);
            Module._free(idmsBuffer);

            return ret;
        },
        dmsToAngle = function (fn, s, ideg, iamin, iasec) {
            var radBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                ret,
                rad;

            s = s || "";

            ret = Module[fn](s.charCodeAt(0), ideg, iamin, iasec, radBuffer);

            rad = Module.HEAPF64[ radBuffer >> 3];

            Module._free(radBuffer);

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
            var t1Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                t2Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = Module[fn](t1, t2, t1Buffer, t2Buffer),
                ret = {};

            ret[ symbol + '1'] = Module.HEAPF64[t1Buffer >> 3];
            ret[ symbol + '2'] = Module.HEAPF64[t2Buffer >> 3];
            ret['status'] = status;

            Module._free(t1Buffer);
            Module._free(t2Buffer);

            return ret;
        },
        /** helper to simplfy buffers / pointers when converting between timecales with and additional correction factor */
        timeScaleConvertWithFactor = function (t1, t2, d, fn, symbol) {
            var t1Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                t2Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = Module[fn](t1, t2, d, t1Buffer, t2Buffer),
                ret = {};

            ret[ symbol + '1'] = Module.HEAPF64[t1Buffer >> 3];
            ret[ symbol + '2'] = Module.HEAPF64[t2Buffer >> 3];
            ret['status'] = status;

            Module._free(t1Buffer);
            Module._free(t2Buffer);

            return ret;
        },
        /** helper to wrap writing to heap/buffer */
        writeFloat64Buffer = function (ptr, data) {
            for (var i = 0; i < data.length; i++) {
                var ofs = ((ptr>>3) + i);
                Module.HEAPF64[ofs]= data[i];
            }
        };




    module.exports = {

        // Astronomy/Calendars
        /** int eraCal2jd(int iy, int im, int id, double *djm0, double *djm); */
        cal2jd: function(iy, im, id) {

            var djm0Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                djmBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = Module._eraCal2jd(iy, im, id, djm0Buffer, djmBuffer),
                ret = {
                    status: status,
                    djm0: Module.HEAPF64[ djm0Buffer >> 3],
                    djm: Module.HEAPF64[ djmBuffer >> 3]
                };


            Module._free(djm0Buffer);
            Module._free(djmBuffer);

            return ret;
        },
        /** double eraEpb(double dj1, double dj2); */
        epb: Module.cwrap('eraEpb','number',['number','number']),
        /** void eraEpb2jd(double epb, double *djm0, double *djm); */
        epb2jd: function (epb){
            var djm0Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                djmBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = Module._eraEpb2jd(epb, djm0Buffer, djmBuffer),
                ret = {
                    status: status,
                    djm0: Module.HEAPF64[ djm0Buffer >> 3],
                    djm: Module.HEAPF64[ djmBuffer >> 3]
                };


            Module._free(djm0Buffer);
            Module._free(djmBuffer);

            return ret;
        },
        /** double eraEpj(double dj1, double dj2); */
        epj: Module.cwrap('eraEpj', 'number', ['number','number']),
        /** void eraEpj2jd(double epj, double *djm0, double *djm); */
        epj2jd: function (epj) {
            var djm0Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                djmBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = Module._eraEpj2jd(epj, djm0Buffer, djmBuffer),
                ret = {
                    status: status,
                    djm0: Module.HEAPF64[ djm0Buffer >> 3],
                    djm: Module.HEAPF64[ djmBuffer >> 3]
                };


            Module._free(djm0Buffer);
            Module._free(djmBuffer);

            return ret;
        },
        /** int eraJd2cal(double dj1, double dj2, int *iy, int *im, int *id, double *fd); */
        jd2cal: function (dj1, dj2) {
            var iyBuffer = Module._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                imBuffer = Module._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                idBuffer = Module._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                fBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            //we use ccall here so we don't need to mess about with string pointers etc..
            var status = Module._eraJd2cal(dj1, dj2, iyBuffer, imBuffer, idBuffer, fBuffer),
                ret = {
                    year: Module.HEAP32[iyBuffer>>2],
                    month: Module.HEAP32[imBuffer>>2],
                    day: Module.HEAP32[idBuffer>>2],
                    fraction: Module.HEAPF64[fBuffer>>3],
                    status: status
                };

            Module._free(iyBuffer);
            Module._free(imBuffer);
            Module._free(idBuffer);
            Module._free(fBuffer);

            return ret;
        },
        /** int eraJdcalf(int ndp, double dj1, double dj2, int iymdf[4]); */
        jdcalf: function (ndp, dj1, dj2) {
            var iymdfBuffer = Module._malloc(4 * Float64Array.BYTES_PER_ELEMENT);

            //we use ccall here so we don't need to mess about with string pointers etc..
            var status = Module._eraJdcalf(ndp, dj1, dj2, iymdfBuffer),
                ret = {
                    year: Module.HEAP32[(iymdfBuffer>>2) +0],
                    month: Module.HEAP32[(iymdfBuffer>>2) +1],
                    day: Module.HEAP32[(iymdfBuffer>>2) +2],
                    fraction: Module.HEAP32[(iymdfBuffer>>2) +3],
                    status: status
                };

            Module._free(iymdfBuffer);

            return ret;
        },

        //astrometry

        //ephemerides
        /** int eraEpv00(double date1, double date2, double pvh[2][3], double pvb[2][3]); */
        epv00: function(date1, date2) {

            var pvhBuffer = Module._malloc( 2 * 3 * Float64Array.BYTES_PER_ELEMENT),
                pvbBuffer = Module._malloc( 2 * 3 * Float64Array.BYTES_PER_ELEMENT);

            var status = Module._eraEpv00(date1, date2, pvhBuffer, pvbBuffer),
                ret = {
                    status: status,
                    //we leave these as arrays, as that is how the comeout/go in
                    pvh: [
                        [
                            Module.HEAPF64[(pvhBuffer>>3) +0],
                            Module.HEAPF64[(pvhBuffer>>3) +1],
                            Module.HEAPF64[(pvhBuffer>>3) +2]
                        ],
                        [
                            Module.HEAPF64[(pvhBuffer>>3) +3],
                            Module.HEAPF64[(pvhBuffer>>3) +4],
                            Module.HEAPF64[(pvhBuffer>>3) +5]
                        ]
                    ],
                    pvb: [
                        [
                            Module.HEAPF64[(pvbBuffer>>3) +0],
                            Module.HEAPF64[(pvbBuffer>>3) +1],
                            Module.HEAPF64[(pvbBuffer>>3) +2]
                        ],
                        [
                            Module.HEAPF64[(pvbBuffer>>3) +3],
                            Module.HEAPF64[(pvbBuffer>>3) +4],
                            Module.HEAPF64[(pvbBuffer>>3) +5]
                        ]
                    ]

                };

            Module._free(pvhBuffer);
            Module._free(pvbBuffer);

            return ret;
        },
        /** int eraPlan94(double date1, double date2, int np, double pv[2][3]); */
        plan94: function(date1, date2, np) {
            var pvBuffer = Module._malloc( 2  * 3 * Float64Array.BYTES_PER_ELEMENT);
            var status = Module._eraPlan94(date1, date2, np, pvBuffer),
                ret = {
                    status: status,
                    x: Module.HEAPF64[(pvBuffer>>3) +0],
                    y: Module.HEAPF64[(pvBuffer>>3) +1],
                    z: Module.HEAPF64[(pvBuffer>>3) +2],

                    vx: Module.HEAPF64[(pvBuffer>>3) +3],
                    vy: Module.HEAPF64[(pvBuffer>>3) +4],
                    vz: Module.HEAPF64[(pvBuffer>>3) +5]
                };

            Module._free(pvBuffer);

            return ret;
        },

        //Fundamental arguments
        /** double eraFal03(double t); */
        fal03: Module.cwrap('eraFal03', 'number', ['number']),
        /** double eraFalp03(double t); */
        falp03: Module.cwrap('eraFalp03', 'number', ['number']),
        /** double eraFaf03(double t); */
        faf03: Module.cwrap('eraFaf03', 'number', ['number']),
        /** double eraFad03(double t); */
        fad03: Module.cwrap('eraFad03', 'number', ['number']),
        /** double eraFaom03(double t); */
        faom03: Module.cwrap('eraFaom03', 'number', ['number']),
        /** double eraFave03(double t); */
        fave03: Module.cwrap('eraFave03', 'number', ['number']),
        /** double eraFae03(double t); */
        fae03: Module.cwrap('eraFae03', 'number', ['number']),
        /** double eraFapa03(double t); */
        fapa03: Module.cwrap('eraFapa03', 'number', ['number']),
        /** double eraFame03(double t); */
        fame03: Module.cwrap('eraFame03', 'number', ['number']),
        /** double eraFama03(double t); */
        fama03: Module.cwrap('eraFama03', 'number', ['number']),
        /** double eraFaju03(double t); */
        faju03: Module.cwrap('eraFaju03', 'number', ['number']),
        /** double eraFasa03(double t); */
        fasa03: Module.cwrap('eraFasa03', 'number', ['number']),
        /** double eraFaur03(double t); */
        faur03: Module.cwrap('eraFaur03', 'number', ['number']),
        /** double eraFane03(double t); */
        fane03: Module.cwrap('eraFane03', 'number', ['number']),

        //PrecNutPolar

        //Rotation and Time
        /** double eraEra00(double dj1, double dj2); */
        era00: Module.cwrap('eraEra00','number',['number','number']),
        /** double eraGmst06(double uta, double utb, double tta, double ttb); */
        gmst06: Module.cwrap('eraGmst06','number', ['number', 'number', 'number', 'number']),
        /**  double eraGmst00(double uta, double utb, double tta, double ttb); */
        gmst00: Module.cwrap('eraGmst00', 'number', ['number', 'number', 'number', 'number']),
        /** double eraGmst82(double dj1, double dj2); */
        gmst82: Module.cwrap('eraGmst82', 'number', ['number', 'number']),
        /** double eraGst06(double uta, double utb, double tta, double ttb, double rnpb[3][3]); */
        gst06: function (uta, utb, tta, ttb, rnpb) {

            var data = SH.flattenVector(rnpb),
                buffer = Module._malloc( data.length * Float64Array.BYTES_PER_ELEMENT),
                result;

            writeFloat64Buffer(buffer, data);

            result = Module._eraGst06(uta, utb, tta, ttb, buffer);
            Module._free(buffer);

            return result;

        },
        /** double eraGst00a(double uta, double utb, double tta, double ttb); */
        gst00a: Module.cwrap('eraGst00a', 'number', ['number', 'number', 'number', 'number']),
        /** double eraGst00b(double uta, double utb); */
        gst00b: Module.cwrap('eraGst00b', 'number', ['number', 'number']),
        /** double eraEe00a(double date1, double date2); */
        ee00a: Module.cwrap('eraEe00a', 'number', ['number', 'number']),
        /** double eraEe00b(double date1, double date2); */
        ee00b: Module.cwrap('eraEe00b', 'number', ['number', 'number']),
        /** double eraEe00(double date1, double date2, double epsa, double dpsi); */
        ee00: Module.cwrap('eraEe00', 'number', ['number', 'number', 'number', 'number']),
        /** double eraEect00(double date1, double date2); */
        eect00: Module.cwrap('eraEect00', 'number', ['number', 'number']),
        /** double eraEe06a(double date1, double date2); */
        ee06a: Module.cwrap('eraEe06a', 'number', ['number', 'number']),
        /** double eraEqeq94(double date1, double date2); */
        eqeq94: Module.cwrap('eraEqeq94', 'number', ['number', 'number']),
        /** double eraGst06a(double uta, double utb, double tta, double ttb); */
        gst06a: Module.cwrap('eraGst06a', 'number', ['number', 'number', 'number', 'number']),
        /** double eraGst94(double uta, double utb); */
        gst94: Module.cwrap('eraGst94', 'number', ['number', 'number']),

        //SpaceMotion
        /** int eraPvstar(double pv[2][3], double *ra, double *dec, double *pmr, double *pmd, double *px, double *rv); */
        pvstar: function (pv) {
            var data = SH.flattenVector(pv),
                pvBuffer = Module._malloc( data.length * Float64Array.BYTES_PER_ELEMENT),
                raBuffer = Module._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
                decBuffer = Module._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
                pmrBuffer = Module._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
                pmdBuffer = Module._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
                pxBuffer = Module._malloc( 1 * Float64Array.BYTES_PER_ELEMENT),
                rvBuffer = Module._malloc( 1 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(pvBuffer, data);

            var status = Module._eraPvstar(pvBuffer, raBuffer, decBuffer, pmrBuffer, pmdBuffer, pxBuffer, rvBuffer),
                ret = {
                    status: status,
                    ra: Module.HEAPF64[raBuffer >> 3],
                    dec: Module.HEAPF64[decBuffer >> 3],
                    pmr: Module.HEAPF64[pmrBuffer >> 3],
                    pmd: Module.HEAPF64[pmdBuffer >> 3],
                    px: Module.HEAPF64[pxBuffer >> 3],
                    rv: Module.HEAPF64[rvBuffer >> 3]
                };


            Module._free(pvBuffer);
            Module._free(raBuffer);
            Module._free(decBuffer);
            Module._free(pmrBuffer);
            Module._free(pmdBuffer);
            Module._free(pxBuffer);
            Module._free(rvBuffer);

            return ret;
        },
        /** int eraStarpv(double ra, double dec, double pmr, double pmd, double px, double rv, double pv[2][3]); */
        starpv: function(ra, dec, pmr, pmd, px, rv) {

            var pvBuffer = Module._malloc(2 * 3 * Float64Array.BYTES_PER_ELEMENT ),
                status = Module._eraStarpv(ra, dec, pmr, pmd, px, rv, pvBuffer),
                ret = {
                    status: status,

                    //going to put this back into an array, as that is how these functions roll.
                    pv: [
                        [
                            Module.HEAPF64[(pvBuffer >> 3)],
                            Module.HEAPF64[(pvBuffer >> 3) + 1],
                            Module.HEAPF64[(pvBuffer >> 3) + 2]
                        ],
                        [
                            Module.HEAPF64[(pvBuffer >> 3) + 3],
                            Module.HEAPF64[(pvBuffer >> 3) + 4],
                            Module.HEAPF64[(pvBuffer >> 3) + 5]
                        ]
                    ]
                };

            Module._free(pvBuffer);

            return ret;
        },

        //StarCatalogs
        /** void eraFk52h(double r5, double d5, double dr5, double dd5, double px5, double rv5, double *rh, double *dh, double *drh, double *ddh, double *pxh, double *rvh); */
        fk52h: function (r5, d5, dr5, dd5, px5, rv5) {
            var rhBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                dhBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                drhBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                ddhBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                pxhBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                rvhBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);



            Module._eraFk52h(r5, d5, dr5, dd5, px5, rv5, rhBuffer, dhBuffer, drhBuffer, ddhBuffer, pxhBuffer, rvhBuffer);

            var ret = {
                rh: Module.HEAPF64[ rhBuffer >> 3],
                dh: Module.HEAPF64[ dhBuffer >> 3],
                drh: Module.HEAPF64[ drhBuffer >> 3],
                ddh: Module.HEAPF64[ ddhBuffer >> 3],
                pxh: Module.HEAPF64[ pxhBuffer >> 3],
                rvh: Module.HEAPF64[ rvhBuffer >> 3]
            };

            Module._free(rhBuffer);
            Module._free(dhBuffer);
            Module._free(drhBuffer);
            Module._free(ddhBuffer);
            Module._free(pxhBuffer);
            Module._free(rvhBuffer);

            return ret;

        },
        /** void eraFk5hip(double r5h[3][3], double s5h[3]); */
        fk5hip: function () {
            var r5hBuffer = Module._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT),
                s5hBuffer = Module._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            Module._eraFk5hip(r5hBuffer, s5hBuffer);

            var r5h = Module.HEAPF64.subarray((r5hBuffer>>3),(r5hBuffer>>3) + 9),
                s5h = Module.HEAPF64.subarray((s5hBuffer>>3),(s5hBuffer>>3) + 3),
                ret = {
                    r5h: Array.prototype.slice.call(r5h).chunk(3),
                    s5h: Array.prototype.slice.call(s5h)
                };

            Module._free(r5hBuffer);
            Module._free(s5hBuffer);

            return ret;
        },
        /** void eraFk5hz(double r5, double d5, double date1, double date2, double *rh, double *dh); */
        fk5hz: function (r5, d5, date1, date2) {
            var rhBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                dhBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            //we use ccall here so we don't need to mess about with string pointers etc..
            var status = Module._eraFk5hz(r5, d5, date1, date2, rhBuffer, dhBuffer),
                ret = {
                    dh: Module.HEAPF64[dhBuffer>>3],
                    rh: Module.HEAPF64[rhBuffer>>3]
                };

            Module._free(rhBuffer);
            Module._free(dhBuffer);

            return ret;
        },
        /** void eraH2fk5(double rh, double dh, double drh, double ddh, double pxh, double rvh, double *r5, double *d5, double *dr5, double *dd5, double *px5, double *rv5); */
        h2fk5: function (rh, dh, drh, ddh, pxh, rvh) {
            var r5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                d5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                dr5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                dd5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                px5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                rv5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            Module._eraH2fk5(rh, dh, drh, ddh, pxh, rvh, r5Buffer, d5Buffer, dr5Buffer, dd5Buffer, px5Buffer, rv5Buffer);

            var ret = {
                r5: Module.HEAPF64[ r5Buffer >> 3],
                d5: Module.HEAPF64[ d5Buffer >> 3],
                dr5: Module.HEAPF64[ dr5Buffer >> 3],
                dd5: Module.HEAPF64[ dd5Buffer >> 3],
                px5: Module.HEAPF64[ px5Buffer >> 3],
                rv5: Module.HEAPF64[ rv5Buffer >> 3]
            };

            Module._free(r5Buffer);
            Module._free(d5Buffer);
            Module._free(dr5Buffer);
            Module._free(dd5Buffer);
            Module._free(px5Buffer);
            Module._free(rv5Buffer);

            return ret;
        },
        /** void eraHfk5z(double rh, double dh, double date1, double date2, double *r5, double *d5, double *dr5, double *dd5); */
        hfk5z: function (rh, dh, date1, date2){

            var r5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                d5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                dr5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                dd5Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            Module._eraHfk5z(rh, dh, date1, date2, r5Buffer, d5Buffer, dr5Buffer, dd5Buffer);

            var ret = {
                r5: Module.HEAPF64[ r5Buffer >> 3],
                d5: Module.HEAPF64[ d5Buffer >> 3],
                dr5: Module.HEAPF64[ dr5Buffer >> 3],
                dd5: Module.HEAPF64[ dd5Buffer >> 3]
            };

            Module._free(r5Buffer);
            Module._free(d5Buffer);
            Module._free(dr5Buffer);
            Module._free(dd5Buffer);

            return ret;

        },
        /** int eraStarpm(double ra1, double dec1, double pmr1, double pmd1, double px1, double rv1, double ep1a, double ep1b, double ep2a, double ep2b, double *ra2, double *dec2, double *pmr2, double *pmd2, double *px2, double *rv2); */
        starpm: function(ra1, dec1, pmr1, pmd1, px1, rv1, ep1a, ep1b, ep2a, ep2b) {

            var raBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                decBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                pmrBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                pmdBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                pxBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                rvBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);


            var status = Module._eraStarpm(ra1, dec1, pmr1, pmd1, px1, rv1, ep1a, ep1b, ep2a, ep2b, raBuffer, decBuffer, pmrBuffer, pmdBuffer, pxBuffer, rvBuffer),
                ret = {
                    status: status,
                    ra: Module.HEAPF64[ raBuffer >> 3],
                    dec: Module.HEAPF64[ decBuffer >> 3],
                    pmr: Module.HEAPF64[ pmrBuffer >> 3],
                    pmd: Module.HEAPF64[ pmdBuffer >> 3],
                    px: Module.HEAPF64[ pxBuffer >> 3],
                    rv: Module.HEAPF64[ rvBuffer >> 3]
                };

            Module._free(raBuffer);
            Module._free(decBuffer);
            Module._free(pmrBuffer);
            Module._free(pmdBuffer);
            Module._free(pxBuffer);
            Module._free(rvBuffer);

            return ret;
        },

        //GalacticCoordinates
        /** void eraG2icrs ( double dl, double db, double *dr, double *dd ); */
        g2icrs: function (dl, db) {
            var drBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                ddBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = Module._eraG2icrs(dl , db, drBuffer, ddBuffer),
                ret = {
                    status: status,
                    dr: Module.HEAPF64[ drBuffer >> 3],
                    dd: Module.HEAPF64[ ddBuffer >> 3]
                };


            Module._free(drBuffer);
            Module._free(ddBuffer);

            return ret;
        },
        /** void eraIcrs2g ( double dr, double dd, double *dl, double *db ); */
        icrs2g: function (dr, dd) {
            var dlBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                dbBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = Module._eraIcrs2g(dr , dd, dlBuffer, dbBuffer),
                ret = {
                    status: status,
                    dl: Module.HEAPF64[ dlBuffer >> 3],
                    db: Module.HEAPF64[ dbBuffer >> 3]
                };


            Module._free(dlBuffer);
            Module._free(dbBuffer);

            return ret;
        },

        //GeodeticGeocentric
        /** int eraEform(int n, double *a, double *f); */
        eform: function (n) {
            var aBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                fBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            var status = Module._eraEform(n, aBuffer, fBuffer),
                ret = {
                    status: status,
                    a: Module.HEAPF64[ aBuffer >> 3],
                    f: Module.HEAPF64[ fBuffer >> 3]
                };

            Module._free(aBuffer);
            Module._free(fBuffer);

            return ret;
        },
        /** int eraGc2gd(int n, double xyz[3], double *elong, double *phi, double *height); */
        gc2gd: function (n, xyz) {

            var eBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                pBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                hBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                xyzBuffer = Module._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

            writeFloat64Buffer(xyzBuffer, xyz);

            var status = Module._eraGc2gd(n, xyzBuffer, eBuffer, pBuffer, hBuffer),
                ret = {
                    status: status,
                    e: Module.HEAPF64[ eBuffer >> 3],
                    p: Module.HEAPF64[ pBuffer >> 3],
                    h: Module.HEAPF64[ hBuffer >> 3]
                };

            Module._free(eBuffer);
            Module._free(pBuffer);
            Module._free(hBuffer);
            Module._free(xyzBuffer);

            return ret;
        },
        /** int eraGc2gde(double a, double f, double xyz[3], double *elong, double *phi, double *height); */
        gc2gde: function (a, f, xyz) {

        },
        /** int eraGd2gc(int n, double elong, double phi, double height, double xyz[3]); */
        gd2gc: function (n, elong, phi, height) {

        },
        /** int eraGd2gce(double a, double f, double elong, double phi, double height, double xyz[3]); */
        gd2gce: function (a, f, elong, phi, height) {

        },


        //Timescales
        /** int eraD2dtf(const char *scale, int ndp, double d1, double d2, int *iy, int *im, int *id, int ihmsf[4]); */
        d2dtf: function (scale, ndp, d1, d2 /*, int *iy, int *im, int *id, int ihmsf[4]*/) {

            var iyBuffer = Module._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                imBuffer = Module._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                idBuffer = Module._malloc(1 * Int32Array.BYTES_PER_ELEMENT),
                ihmsfBuffer = Module._malloc(4 * Int32Array.BYTES_PER_ELEMENT);

            //we use ccall here so we don't need to mess about with string pointers etc..
            var status = Module.ccall(
                    'eraD2dtf',
                    'number',
                    ['string','number','number','number','number','number','number','number'],
                    [scale, ndp, d1, d2, iyBuffer, imBuffer, idBuffer, ihmsfBuffer]
                ),
                ret = {
                    year: Module.HEAP32[iyBuffer>>2],
                    month: Module.HEAP32[imBuffer>>2],
                    day: Module.HEAP32[idBuffer>>2],
                    hour: Module.HEAP32[(ihmsfBuffer>>2) +0],
                    minute: Module.HEAP32[(ihmsfBuffer>>2) +1],
                    second: Module.HEAP32[(ihmsfBuffer>>2) +2],
                    fraction: Module.HEAP32[(ihmsfBuffer>>2) +3],
                    status: status
                };

            Module._free(iyBuffer);
            Module._free(imBuffer);
            Module._free(idBuffer);
            Module._free(ihmsfBuffer);

            return ret;

        },
        /** int eraDat(int iy, int im, int id, double fd, double *deltat); */
        dat: function (iy, im, id, fd) {

            var deltaBuffer = Module._malloc(4 * Float64Array.BYTES_PER_ELEMENT);

            var ret = Module._eraDat(iy, im, id, fd,deltaBuffer );

            //TODO: put this in an structure
            //if (ret != 0){
            //    //how to handle non normal results??
            //}

            ret = Module.HEAPF64[ deltaBuffer >> 3];

            Module._free(deltaBuffer);

            return ret;
        },
        /** double eraDtdb(double date1, double date2, double ut, double elong, double u, double v); */
        dtdb: Module.cwrap('eraDtdb', 'number', ['number','number','number','number','number','number']),
        /** int eraDtf2d(const char *scale, int iy, int im, int id, int ihr, int imn, double sec, double *d1, double *d2); */
        dtf2d : function (scale, iy, im, id, ihr, imn, sec) {
            var u1Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                u2Buffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

            //we use ccall here so we don't need to mess about with string pointers etc..
            var status = Module.ccall(
                    'eraDtf2d',
                    'number',
                    ['string','number','number','number','number','number','number','number','number'],
                    [scale, iy, im, id, ihr, imn, sec, u1Buffer, u2Buffer]
                ),
                ret = {
                    u1: Module.HEAPF64[u1Buffer >> 3],
                    u2: Module.HEAPF64[u2Buffer >> 3],
                    status: status
                };

            Module._free(u1Buffer);
            Module._free(u2Buffer);

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
        anp: Module.cwrap('eraAnp','number',['number']),
        /** double eraAnpm(double a); */
        anpm: Module.cwrap('eraAnpm','number',['number']),
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
        }

        //BuildRotations
        //CopyExtendExtract
        //Initialization
        //MatrixOps
        //MatrixVectorProducts
        //RotationVectors
        //SeparationAndAngle
        //SphericalCartesian
        //VectorOps

    };




})();