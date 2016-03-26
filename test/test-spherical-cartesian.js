"use strict";

var chai = require('chai'),
  should = chai.should(),
  erfa = require('../index');

describe('Spherical Cartesian', function () {

  describe("#c2s()", function () {
    it('should convert P-vector to spherical coordinates', function () {

      var p = [100.0, -50.0, 25.0];

      var ret = erfa.c2s(p);

      (ret.theta).should.be.closeTo(-0.4636476090008061162, 1e-14);
      (ret.phi).should.be.closeTo(0.2199879773954594463, 1e-14);


    });
  });

  describe("#p2s()", function () {
    it('should convert P-vector to spherical polar coordinates', function () {

      var p = [100.0, -50.0, 25.0];

      var ret = erfa.p2s(p);

      (ret.theta).should.be.closeTo(-0.4636476090008061162, 1e-12);
      (ret.phi).should.be.closeTo(0.2199879773954594463, 1e-12);
      (ret.r).should.be.closeTo(114.5643923738960002, 1e-9);
    });
  });

  describe("#pv2s()", function () {
    it('should convert position/velocity from Cartesian to spherical coordinates', function () {

       var pv = [
          [-0.4514964673880165, 0.03093394277342585, 0.05594668105108779],
          [1.292270850663260e-5, 2.652814182060692e-6, 2.568431853930293e-6]
       ];

      var ret = erfa.pv2s(pv);//, &theta, &phi, &r, &td, &pd, &rd

      (ret.theta).should.be.closeTo(3.073185307179586515, 1e-12);
      (ret.phi).should.be.closeTo(0.1229999999999999992, 1e-12);
      (ret.r).should.be.closeTo(0.4559999999999999757, 1e-12);
      (ret.td).should.be.closeTo(-0.7800000000000000364e-5, 1e-16);
      (ret.pd).should.be.closeTo(0.9010000000000001639e-5, 1e-16);
      (ret.rd).should.be.closeTo(-0.1229999999999999832e-4, 1e-16);

    });
  });

  describe("#s2c()", function () {
    it('should convert spherical coordinates to Cartesian', function () {


      var ret = erfa.s2c(3.0123, -0.999);

      (ret[0]).should.be.closeTo(-0.5366267667260523906, 1e-12);
      (ret[1]).should.be.closeTo(0.0697711109765145365, 1e-12);
      (ret[2]).should.be.closeTo(-0.8409302618566214041, 1e-12);

    });
  });

  describe("#s2p()", function () {
    it('should convert spherical polar coordinates to p-vector', function () {

      var ret = erfa.s2p(-3.21, 0.123, 0.456);

      (ret[0]).should.be.closeTo(-0.4514964673880165228, 1e-12);
      (ret[1]).should.be.closeTo(0.0309339427734258688, 1e-12);
      (ret[2]).should.be.closeTo(0.0559466810510877933, 1e-12);


    });
  });

  describe("#s2pv()", function () {
    it('should convert position/velocity from spherical to Cartesian coordinates.', function () {

      var ret = erfa.s2pv(-3.21, 0.123, 0.456, -7.8e-6, 9.01e-6, -1.23e-5);

      (ret[0][0]).should.be.closeTo(-0.4514964673880165228, 1e-12);
      (ret[0][1]).should.be.closeTo(0.0309339427734258688, 1e-12);
      (ret[0][2]).should.be.closeTo(0.0559466810510877933, 1e-12);

      (ret[1][0]).should.be.closeTo(0.1292270850663260170e-4, 1e-16);
      (ret[1][1]).should.be.closeTo(0.2652814182060691422e-5, 1e-16);
      (ret[1][2]).should.be.closeTo(0.2568431853930292259e-5, 1e-16);

    });
  });


});