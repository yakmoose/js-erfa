(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa'),
      HH = require('./heap-helper'),
      SH = require('./struct-helper'),
      writeFloat64Buffer = HH.writeFloat64Buffer,
      readFloat64Buffer = HH.readFloat64Buffer;

  var /** helper to wrap rotations */
      rxyz = function (angle, axis, matrix) {
    var matrixBuffer = LIBERFA._malloc(3 * 3 * Float64Array.BYTES_PER_ELEMENT);

    writeFloat64Buffer(matrixBuffer, SH.flattenVector(matrix));

    LIBERFA['_eraR' + axis](angle,  matrixBuffer);

    var retMatrix = readFloat64Buffer(matrixBuffer, 3 * 3);

    LIBERFA._free(matrixBuffer);

    return SH.chunkArray(Array.from(retMatrix), 3);
  };

  module.exports = {
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

  };
})();