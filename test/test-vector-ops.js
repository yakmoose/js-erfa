"use strict";

var chai = require('chai'),
  should = chai.should(),
  erfa = require('../index');

describe('Vector Ops', function () {

  describe('#pdp()', function () {
    it('Should compute p-vector inner (=scalar=dot) product', function () {

      var a = [2.0, 2.0, 3.0],
          b = [1.0, 3.0, 4.0];

      var ret = erfa.pdp(a, b);

      (ret).should.be.closeTo(20, 1e-12)


    });
  });

  describe('#pm', function () {
    it('Should return the modulus of a p-vector', function () {

      var p = [0.3, 1.2, -2.5];

      var ret = erfa.pm(p);

      (ret).should.be.closeTo(2.789265136196270604, 1e-12);

    });
  });

  describe('#pmp', function () {
    it('Should perform p-vector subtraction', function () {

      var a = [2.0, 2.0, 3.0],
          b = [1.0, 3.0, 4.0];

      var ret = erfa.pmp(a, b);

      (ret[0]).should.be.closeTo(1.0, 1e-12);
      (ret[1]).should.be.closeTo(-1.0, 1e-12);
      (ret[2]).should.be.closeTo(-1.0, 1e-12);

    });
  });

});