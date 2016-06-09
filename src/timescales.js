(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa');

  var
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
    };

  module.exports ={
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
  };
})();