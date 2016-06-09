(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa'),
    SH = require('./struct-helper'),
    HH = require('./heap-helper'),
    writeFloat64Buffer = HH.writeFloat64Buffer,
    readFloat64Buffer = HH.readFloat64Buffer;

  module.exports = {
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

  };

})();