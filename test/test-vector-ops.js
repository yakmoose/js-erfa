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

  describe('#pm()', function () {
    it('Should return the modulus of a p-vector', function () {

      var p = [0.3, 1.2, -2.5];

      var ret = erfa.pm(p);

      (ret).should.be.closeTo(2.789265136196270604, 1e-12);

    });
  });

  describe('#pmp()', function () {
    it('Should perform p-vector subtraction', function () {

      var a = [2.0, 2.0, 3.0],
          b = [1.0, 3.0, 4.0];

      var ret = erfa.pmp(a, b);

      (ret[0]).should.be.closeTo(1.0, 1e-12);
      (ret[1]).should.be.closeTo(-1.0, 1e-12);
      (ret[2]).should.be.closeTo(-1.0, 1e-12);

    });
  });

  describe('#pn()', function () {
    it('Should convert a p-vector into modulus and unit vector', function () {

      var p = [0.3, 1.2, -2.5];

      var ret = erfa.pn(p);

      (ret.r).should.be.closeTo(2.789265136196270604, 1e-12);

      (ret.u[0]).should.be.closeTo(0.1075552109073112058, 1e-12);
      (ret.u[1]).should.be.closeTo(0.4302208436292448232, 1e-12);
      (ret.u[2]).should.be.closeTo(-0.8962934242275933816, 1e-12);

    });
  });

  describe('#ppp()', function () {
    it('Should perform p-vector addition', function () {

      var a = [2.0, 2.0, 3.0],
          b = [1.0, 3.0, 4.0];

      var ret = erfa.ppp(a, b);

      (ret[0]).should.be.closeTo(3.0, 1e-12);
      (ret[1]).should.be.closeTo(5.0, 1e-12);
      (ret[2]).should.be.closeTo(7.0, 1e-12);

    });
  });

  describe('#ppsp()', function () {
    it('Should calculate p-vector plus scaled p-vector', function () {

      var a = [2.0, 2.0, 3.0],
          s = 5.0,
          b = [1.0, 3.0, 4.0];

      var ret = erfa.ppsp(a, s, b);

      (ret[0]).should.be.closeTo(7.0, 1e-12);
      (ret[1]).should.be.closeTo(17.0, 1e-12);
      (ret[2]).should.be.closeTo(23.0, 1e-12);


    });
  });


  describe('#pvdpv()', function () {
    it('Should calculate scalar product of two p-vectors', function () {

      var a = [[2.0, 2.0, 3.0],[6.0, 0.0, 4.0]],
          b = [[1.0, 3.0, 4.0],[0.0, 2.0, 8.0]];

      var ret = erfa.pvdpv(a, b);

      (ret[0]).should.be.closeTo(20.0, 1e-12);
      (ret[1]).should.be.closeTo(50.0, 1e-12);

    });
  });


  describe('#pvm()', function () {
    it('Should calculate modulus of pv-vector', function () {

      var pv = [[0.3, 1.2, -2.5], [0.45, -0.25, 1.1]];

      var ret = erfa.pvm(pv);

      (ret.r).should.be.closeTo(2.789265136196270604, 1e-12);
      (ret.s).should.be.closeTo(1.214495780149111922, 1e-12);

    });
  });


  describe('#pvmpv()', function () {
    it('Should calculate p-vector minus p-vector', function () {


      var a = [[2.0, 2.0, 3.0], [5.0, 6.0, 3.0]],
          b = [[1.0, 3.0, 4.0], [3.0, 2.0, 1.0]];

      var ret = erfa.pvmpv(a, b);

      (ret[0][0]).should.be.closeTo(1.0, 1e-12);
      (ret[0][1]).should.be.closeTo(-1.0, 1e-12);
      (ret[0][2]).should.be.closeTo(-1.0, 1e-12);

      (ret[1][0]).should.be.closeTo(2.0, 1e-12);
      (ret[1][1]).should.be.closeTo(4.0, 1e-12);
      (ret[1][2]).should.be.closeTo(2.0, 1e-12);

    });
  });


  describe('#pvppv()', function () {
    it('Should calculate add pv-vector to pv-vector', function () {

      var a = [[2.0, 2.0, 3.0], [5.0, 6.0, 3.0]],
          b =[[1.0, 3.0, 4.0], [3.0, 2.0, 1.0]];

      var ret = erfa.pvppv(a, b);

      (ret[0][0]).should.be.closeTo(3.0, 1e-12);
      (ret[0][1]).should.be.closeTo(5.0, 1e-12);
      (ret[0][2]).should.be.closeTo(7.0, 1e-12);

      (ret[1][0]).should.be.closeTo(8.0, 1e-12);
      (ret[1][1]).should.be.closeTo(8.0, 1e-12);
      (ret[1][2]).should.be.closeTo(4.0, 1e-12);

    });
  });

  describe('#pvu()', function () {
    it('Should update a pv-vector', function () {

      var pv = [
        [126668.5912743160734, 2136.792716839935565, -245251.2339876830229],
        [-0.4051854035740713039e-2, -0.6253919754866175788e-2, 0.1189353719774107615e-1]
      ];

      var ret = erfa.pvu(2920.0, pv);

      (ret[0][0]).should.be.closeTo(126656.7598605317105, 1e-12);
      (ret[0][1]).should.be.closeTo(2118.531271155726332, 1e-12);
      (ret[0][2]).should.be.closeTo(-245216.5048590656190, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.4051854035740713039e-2, 1e-12);
      (ret[1][1]).should.be.closeTo(-0.6253919754866175788e-2, 1e-12);
      (ret[1][2]).should.be.closeTo(0.1189353719774107615e-1, 1e-12);

    });
  });

  describe('#pvup()', function () {
    it('Should update a pv-vector, discarding the velocity component', function () {

      var pv = [
        [126668.5912743160734, 2136.792716839935565, -245251.2339876830229],
        [-0.4051854035740713039e-2, -0.6253919754866175788e-2, 0.1189353719774107615e-1]
      ];

      var ret = erfa.pvup(2920.0, pv);

      (ret[0]).should.be.closeTo(126656.7598605317105, 1e-12);
      (ret[1]).should.be.closeTo(2118.531271155726332, 1e-12);
      (ret[2]).should.be.closeTo(-245216.5048590656190, 1e-12);

    });
  });

  describe('#pvxpv()', function () {
    it('Should calculate outer (=vector=cross) product of two pv-vectors', function () {

      var a = [[2.0, 2.0, 3.0],[6.0, 0.0, 4.0]],
          b = [[1.0, 3.0, 4.0],[0.0, 2.0, 8.0]];

      var ret =  erfa.pvxpv(a, b);

      (ret[0][0]).should.be.closeTo(-1.0, 1e-12);
      (ret[0][1]).should.be.closeTo(-5.0, 1e-12);
      (ret[0][2]).should.be.closeTo(4.0, 1e-12);

      (ret[1][0]).should.be.closeTo(-2.0, 1e-12);
      (ret[1][1]).should.be.closeTo(-36.0, 1e-12);
      (ret[1][2]).should.be.closeTo(22.0, 1e-12);

    });
  });

});