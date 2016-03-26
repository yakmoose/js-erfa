"use strict";

var chai = require('chai'),
  should = chai.should(),
  erfa = require('../index');

describe('Separation and Angle', function () {

  describe("#pap()", function () {
    it('Should return position-angle from two p-vectors', function () {
      
      var a = [1.0, 0.1, 0.2],
          b = [-3.0,1e-3, 0.2];

      var ret = erfa.pap(a, b);

      (ret).should.be.closeTo(0.3671514267841113674, 1e-12);
      
    });
  });

  describe("#pas()", function () {
    it('Should return position-angle from spherical coordinates', function () {

      var al =  1.0,
          ap =  0.1,
          bl =  0.2,
          bp = -1.0;

      var ret = erfa.pas(al, ap, bl, bp);

      (ret).should.be.closeTo(-2.724544922932270424, 1e-12);
      
    });
  });

  describe("#sepp()", function () {
    it('Should return angular separation between two p-vectors', function () {

      var a = [1.0, 0.1, 0.2],
          b = [-3.0, 1e-3, 0.2];

      var ret = erfa.sepp(a, b);

      (ret).should.be.closeTo(2.860391919024660768, 1e-12);

    });
  });


  describe("#seps()", function () {
    it('Should return angular separation between two sets of spherical coordinates', function () {

      var al =  1.0,
          ap =  0.1,
          bl =  0.2,
          bp = -3.0;

      var ret = erfa.seps(al, ap, bl, bp);

      (ret).should.be.closeTo(2.346722016996998842, 1e-14);
    });
  });  

});