(function () {
    "use strict";

    var Module = require('./c/erfa/src/erfa'),
        SH = require('./lib/struct-helper');

    module.exports = {
        //helper bits and bobs
        writeFloat64Buffer : function (ptr, data) {
            for (var i = 0; i < data.length; i++) {
                var ofs = ((ptr>>3) + i);
                Module.HEAPF64[ofs]= data[i];
            }
        },

        //Angle ops

        /** void eraA2af(int ndp, double angle, char *sign, int idmsf[4]); */
        a2af: function (ndp, angle) {

            var signBuffer = Module._malloc(1 * Uint8Array.BYTES_PER_ELEMENT),// one byte for the sign char
                idmsBuffer = Module._malloc(4 * Int32Array.BYTES_PER_ELEMENT),
                ofs = idmsBuffer>> 2,
                ret;

            Module._eraA2af(ndp, angle, signBuffer, idmsBuffer);

            //we want to return a sensible structure not just a chunk of memory
            ret =  {
                sign: String.fromCharCode( Module.HEAP8[signBuffer ]),
                degrees: Module.HEAP32[ ofs + 0 ],
                minutes: Module.HEAP32[ ofs + 1 ],
                seconds: Module.HEAP32[ ofs + 2 ],
                fraction: Module.HEAP32[ ofs + 3 ]
            };

            Module._free(signBuffer);
            Module._free(idmsBuffer);

            return ret;
        },
        /** void eraA2tf(int ndp, double angle, char *sign, int ihmsf[4]); */
        a2tf: function (ndp, angle, sign, ihmsf) {

            var signBuffer = Module._malloc(1 * Uint8Array.BYTES_PER_ELEMENT),// one byte for the sign char
                idmsBuffer = Module._malloc(4 * Int32Array.BYTES_PER_ELEMENT),
                ofs = idmsBuffer>> 2,
                ret;

            Module._eraA2tf(ndp, angle, signBuffer, idmsBuffer);

            //we want to return a sensible structure not just a chunk of memory
            ret =  {
                sign: String.fromCharCode( Module.HEAP8[signBuffer ]),
                degrees: Module.HEAP32[ ofs + 0 ],
                minutes: Module.HEAP32[ ofs + 1 ],
                seconds: Module.HEAP32[ ofs + 2 ],
                fraction: Module.HEAP32[ ofs + 3 ]
            };

            Module._free(signBuffer);
            Module._free(idmsBuffer);

            return ret;
        },
        /** int eraAf2a(char s, int ideg, int iamin, double asec, double *rad); */
        af2a : function (s, ideg, iamin, asec) {
            var radBuffer = Module._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
                ret,
                rad;

            s = s || "";

            ret = Module._eraAf2a(s.charCodeAt(0), ideg, iamin, asec, radBuffer);

            rad = Module.HEAPF64[ radBuffer >> 3];

            Module._free(radBuffer);

            if (ret != 0) {
                //throw an exception here...
            }

            return rad;
        },
        /** double eraAnp(double a); */
        anp: Module.cwrap('eraAnp','number',['number']),
        /** double eraAnpm(double a); */
        anpm: Module.cwrap('eraAnpm','number',['number']),
        /** void eraD2tf(int ndp, double days, char *sign, int ihmsf[4]); */
        d2tf: function (ndp, days) { //} char *sign, int ihmsf[4]) {
            var signBuffer = Module._malloc(1 * Uint8Array.BYTES_PER_ELEMENT),// one byte for the sign char
                idmsBuffer = Module._malloc(4 * Int32Array.BYTES_PER_ELEMENT),
                ofs = idmsBuffer>> 2,
                ret;

            Module._eraD2tf(ndp, days, signBuffer, idmsBuffer);

            //we want to return a sensible structure not just a chunk of memory
            ret =  {
                sign: String.fromCharCode( Module.HEAP8[signBuffer ]),
                degrees: Module.HEAP32[ ofs + 0 ],
                minutes: Module.HEAP32[ ofs + 1 ],
                seconds: Module.HEAP32[ ofs + 2 ],
                fraction: Module.HEAP32[ ofs + 3 ]
            };

            Module._free(signBuffer);
            Module._free(idmsBuffer);

            return ret;
        },
        /** int eraTf2a(char s, int ihour, int imin, double sec, double *rad); */
        tf2a: function (s, ihour, imin, sec) {

        },
        /** int eraTf2d(char s, int ihour, int imin, double sec, double *days); */
        eraTf2d: function (s, ihour, imin, sec) {

        },

        //Rotation and Time
        era00: Module.cwrap('eraEra00','number',['number','number']),
        gmst06: Module.cwrap('eraGmst06','number', ['number', 'number', 'number', 'number']),
        gmst00: Module.cwrap('eraGmst00', 'number', ['number', 'number', 'number', 'number']),
        gmst82: Module.cwrap('eraGmst82', 'number', ['number', 'number']),
        gst06: function (uta, utb, tta, ttb, rnpb) {

            var data = (new Float64Array(SH.flattenVector(rnpb))),
                buffer = Module._malloc( data.length * data.BYTES_PER_ELEMENT),
                result;

            this.writeFloat64Buffer(buffer, data);

            result = Module._eraGst06(uta, utb, tta, ttb, buffer);
            Module._free(buffer);

            return result;

        },
        gst00a: Module.cwrap('eraGst00a', 'number', ['number', 'number', 'number', 'number']),
        gst00b: Module.cwrap('eraGst00b', 'number', ['number', 'number']),
        ee00a: Module.cwrap('eraEe00a', 'number', ['number', 'number']),
        ee00b: Module.cwrap('eraEe00b', 'number', ['number', 'number']),
        ee00: Module.cwrap('eraEe00', 'number', ['number', 'number', 'number', 'number']),
        eect00: Module.cwrap('eraEect00', 'number', ['number', 'number']),







        //Fundamental arguments
        /** double eraFal03(double t); */
        fal03: Module.cwrap('eraFal03', 'number', ['number']),
        /**  double eraFalp03(double t); */
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
        /**     double eraFane03(double t); */
        fane03: Module.cwrap('eraFane03', 'number', ['number'])
















    };

})();