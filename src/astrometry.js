(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa'),
      HH = require('./heap-helper'),
      writeFloat64Buffer = HH.writeFloat64Buffer,
      readFloat64Buffer = HH.readFloat64Buffer,
      ASTROM = require('./astrom'),
      LDBODY = require('./ldbody'),
      SH = require('./struct-helper');


  var astrometry = {
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

      LIBERFA._eraApcg(date1, date2, ebpvBuffer, ehpBuffer, astromBuffer);

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
        eo: LIBERFA.HEAPF64[eoBuffer >>> 3]
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
        eo: LIBERFA.HEAPF64[eoBuffer >>> 3],
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
        ehpBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

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
    aper: function (theta, astrom) {

      var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(astromBuffer, astrom.toArray());

      LIBERFA._eraAper(theta, astromBuffer);

      var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

      LIBERFA._free(astromBuffer);

      return new ASTROM(ret);//return the one we were passed in??
    },
    /** void eraAper13(double ut11, double ut12, eraASTROM *astrom); */
    aper13: function (ut11, ut12, astrom) {
      var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(astromBuffer, astrom.toArray());

      LIBERFA._eraAper13(ut11, ut12, astromBuffer);

      var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

      LIBERFA._free(astromBuffer);

      return new ASTROM(ret);//return the one we were passed in??
    },
    /** void eraApio(double sp, double theta, double elong, double phi, double hm, double xp, double yp, double refa, double refb, eraASTROM *astrom); */
    apio: function (sp, theta, elong, phi, hm, xp, yp, refa, refb) {
      var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraApio(sp, theta, elong, phi, hm, xp, yp, refa, refb, astromBuffer);

      var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

      LIBERFA._free(astromBuffer);

      return new ASTROM(ret);

    },
    /** int eraApio13(double utc1, double utc2, double dut1, double elong, double phi, double hm, double xp, double yp, double phpa, double tc, double rh, double wl, eraASTROM *astrom);*/
    apio13: function (utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl) {
      var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

      var status = LIBERFA._eraApio13(utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl, astromBuffer);

      var ret = readFloat64Buffer(astromBuffer, ASTROM.STRUCT_SIZE);

      LIBERFA._free(astromBuffer);

      return {
        astrom: new ASTROM(ret),
        status: status
      };
    },
    /** void eraAtci13(double rc, double dc, double pr, double pd, double px, double rv, double date1, double date2, double *ri, double *di, double *eo); */
    atci13: function (rc, dc, pr, pd, px, rv, date1, date2) {

      var eoBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        riBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        diBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      LIBERFA._eraAtci13(rc, dc, pr, pd, px, rv, date1, date2, riBuffer, diBuffer, eoBuffer);

      var ret = {
        ri: LIBERFA.HEAPF64[riBuffer >>> 3],
        di: LIBERFA.HEAPF64[diBuffer >>> 3],
        eo: LIBERFA.HEAPF64[eoBuffer >>> 3]
      };

      LIBERFA._free(diBuffer);
      LIBERFA._free(riBuffer);
      LIBERFA._free(eoBuffer);

      return ret;

    },
    /** void eraAtciq(double rc, double dc, double pr, double pd, double px, double rv, eraASTROM *astrom, double *ri, double *di); */
    atciq: function (rc, dc, pr, pd, px, rv, astrom) {

      var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
        riBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        diBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

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
        riBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        diBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        bBuffer = LIBERFA._malloc(bSize);

      writeFloat64Buffer(astromBuffer, astrom.toArray());


      writeFloat64Buffer(bBuffer, SH.flattenVector(b.map(function (item) {
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
        riBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        diBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

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

      var aobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        zobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        hobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        robBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        eoBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

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
    atic13: function (ri, di, date1, date2) {
      var riBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        diBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        eoBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

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
        rcBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dcBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

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
        rcBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dcBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        bBuffer = LIBERFA._malloc(bSize);

      writeFloat64Buffer(astromBuffer, astrom.toArray());
      writeFloat64Buffer(bBuffer, SH.flattenVector(b.map(function (item) {
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

      var aobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        zobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        hobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        robBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT);

      var j = LIBERFA._eraAtio13(ri, di, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl,
        aobBuffer, zobBuffer, hobBuffer, dobBuffer, robBuffer);

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

      var aobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        zobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        hobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dobBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        robBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(astromBuffer, astrom.toArray());


      LIBERFA._eraAtioq(ri, di, astromBuffer,
        aobBuffer, zobBuffer, hobBuffer, dobBuffer, robBuffer);

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

      var rcBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        dcBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
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
      var riBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        diBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
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
    atoiq: function (type, ob1, ob2, astrom) {

      var astromBuffer = LIBERFA._malloc(ASTROM.STRUCT_SIZE * Float64Array.BYTES_PER_ELEMENT),
        riBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
        diBuffer = LIBERFA._malloc(1 * Float64Array.BYTES_PER_ELEMENT),
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

      var pBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        qBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        eBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        p1Buffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

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
        obBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        scBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT),
        snBuffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

      writeFloat64Buffer(obBuffer, ob);
      writeFloat64Buffer(scBuffer, sc);
      writeFloat64Buffer(bBuffer, SH.flattenVector(b.map(function (item) {
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
        p1Buffer = LIBERFA._malloc(3 * Float64Array.BYTES_PER_ELEMENT);

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

      var pvBuffer = LIBERFA._malloc(6 * Float64Array.BYTES_PER_ELEMENT);
      LIBERFA._eraPvtob(elong, phi, height, xp, yp, sp, theta, pvBuffer);

      var pv = SH.chunkArray(Array.from(readFloat64Buffer(pvBuffer, 6)), 3);

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

  };

  module.exports = astrometry;

})();