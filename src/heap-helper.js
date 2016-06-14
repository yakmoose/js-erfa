(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa');

  module.exports = {
    /** helper to wrap writing to heap/buffer */
    writeFloat64Buffer: function (ptr, data) {
      for (var i = 0, c = data.length, ofs = ptr >> 3; i < c; i++) {
        LIBERFA.HEAPF64[ofs + i ]= data[i];
      }
    },
    /** helper that will read a buffer into an array */
    readFloat64Buffer: function (ptr, size) {
      var ret = [];
      for(var i = 0, ofs = ptr >> 3; i < size; i++) {
        ret[i] = LIBERFA.HEAPF64[ofs + i];
      }

      return ret;
    }
  }

})();