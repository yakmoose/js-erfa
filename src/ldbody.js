(function () {
  "use strict";

  var _ = require('lodash');

  /* wrapper for the struct eraLDBODY defined in erfam.h */
  /** Body parameters for light deflection */
  var LDBODY = function(raw) {

    if (!raw) {
      raw = _.times(LDBODY.STRUCT_SIZE, _.constant(0));
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
      if (_.isArray(this[item])) {
        a = a.concat(_.flatten(this[item]));
      } else {
        a.push(this[item]);
      }
    }.bind(this));

    return a;
  };

  module.exports = LDBODY;

})();