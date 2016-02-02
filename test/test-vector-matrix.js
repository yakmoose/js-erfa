/**
 * Created by john on 4/10/15.
 */
"use strict";

var chai = require('chai'),
  should = chai.should(),
  erfa = require('../index');

describe('Vector / Matrix Operations', function () {


  describe('BuildRotations', function () {

    describe('#rx()', function () {
      it('Should rotate an r-matrix about the x-axis.', function () {
        var phi = 0.3456789,

          r = [
            [2.0, 3.0, 2.0],
            [3.0, 2.0, 3.0],
            [3.0, 4.0, 5.0]];

        var ret = erfa.rx(phi, r);

        (ret[0][0]).should.be.closeTo(2.0, 0.0);
        (ret[0][1]).should.be.closeTo(3.0, 0.0);
        (ret[0][2]).should.be.closeTo(2.0, 0.0);

        (ret[1][0]).should.be.closeTo(3.839043388235612460, 1e-12);
        (ret[1][1]).should.be.closeTo(3.237033249594111899, 1e-12);
        (ret[1][2]).should.be.closeTo(4.516714379005982719, 1e-12);

        (ret[2][0]).should.be.closeTo(1.806030415924501684, 1e-12);
        (ret[2][1]).should.be.closeTo(3.085711545336372503, 1e-12);
        (ret[2][2]).should.be.closeTo(3.687721683977873065, 1e-12);

      });
    });

    describe('#ry()', function () {
      it('Should rotate an r-matrix about the y-axis.', function () {
        var theta = 0.3456789, r = [[2.0, 3.0, 2.0], [3.0, 2.0, 3.0], [3.0, 4.0, 5.0]];

        var ret = erfa.ry(theta, r);

        (ret[0][0]).should.be.closeTo(0.8651847818978159930, 1e-12);
        (ret[0][1]).should.be.closeTo(1.467194920539316554, 1e-12);
        (ret[0][2]).should.be.closeTo(0.1875137911274457342, 1e-12);

        (ret[1][0]).should.be.closeTo(3, 1e-12);
        (ret[1][1]).should.be.closeTo(2, 1e-12);
        (ret[1][2]).should.be.closeTo(3, 1e-12);

        (ret[2][0]).should.be.closeTo(3.500207892850427330, 1e-12);
        (ret[2][1]).should.be.closeTo(4.779889022262298150, 1e-12);
        (ret[2][2]).should.be.closeTo(5.381899160903798712, 1e-12);
      });
    });

    describe('#rz()', function () {
      it('Should rotate an r-matrix about the z-axis.', function () {
        var psi = 0.3456789,

          r = [
            [2.0, 3.0, 2.0],
            [3.0, 2.0, 3.0],
            [3.0, 4.0, 5.0]
          ];

        var ret = erfa.rz(psi, r);

        (ret[0][0]).should.be.closeTo(2.898197754208926769, 1e-12);
        (ret[0][1]).should.be.closeTo(3.500207892850427330, 1e-12);
        (ret[0][2]).should.be.closeTo(2.898197754208926769, 1e-12);

        (ret[1][0]).should.be.closeTo(2.144865911309686813, 1e-12);
        (ret[1][1]).should.be.closeTo(0.865184781897815993, 1e-12);
        (ret[1][2]).should.be.closeTo(2.144865911309686813, 1e-12);

        (ret[2][0]).should.be.closeTo(3.0, 1e-12);
        (ret[2][1]).should.be.closeTo(4.0, 1e-12);
        (ret[2][2]).should.be.closeTo(5.0, 1e-12);
      });
    });


  });

  describe('Initalisation', function () {
    describe('#ir()', function () {
      it('Should initialize an r-matrix to the identity matrix', function () {

        var r = [
          [2.0, 3.0, 2.0],
          [3.0, 2.0, 3.0],
          [3.0, 4.0, 5.0]];

        var ret = erfa.ir(r);

        (ret[0][0]).should.be.closeTo(1.0, 0.0);
        (ret[0][1]).should.be.closeTo(0.0, 0.0);
        (ret[0][2]).should.be.closeTo(0.0, 0.0);

        (ret[1][0]).should.be.closeTo(0.0, 0.0);
        (ret[1][1]).should.be.closeTo(1.0, 0.0);
        (ret[1][2]).should.be.closeTo(0.0, 0.0);

        (ret[2][0]).should.be.closeTo(0.0, 0.0);
        (ret[2][1]).should.be.closeTo(0.0, 0.0);
        (ret[2][2]).should.be.closeTo(1.0, 0.0);

      });
    });

    describe('#zp()', function (){
      it('Should zero a p-matrix', function () {
        var p = [0.3, 1.2 -2.5];

        var ret = erfa.zp(p);

        (ret[0]).should.be.closeTo(0.0, 0.0);
        (ret[1]).should.be.closeTo(0.0, 0.0);
        (ret[2]).should.be.closeTo(0.0, 0.0);

      });
    });

    describe('#zpr()', function (){
      it('Should Zero a pv-vector', function (){
        var pv = [
          [0.3, 1.2, -2.5],
          [-0.5, 3.1, 0.9]
        ];
        var ret = erfa.zpv(pv);

        (ret[0][0]).should.be.closeTo(0.0, 0.0);
        (ret[0][1]).should.be.closeTo(0.0, 0.0);
        (ret[0][2]).should.be.closeTo(0.0, 0.0);

        (ret[1][0]).should.be.closeTo(0.0, 0.0);
        (ret[1][1]).should.be.closeTo(0.0, 0.0);
        (ret[1][2]).should.be.closeTo(0.0, 0.0);
      });
    });

    describe('#zr()', function () {
      it('should set an r-matrix to the null matrix', function (){


        var r = [
          [2.0, 3.0, 2.0],
          [3.0, 2.0, 3.0],
          [3.0, 4.0, 5.0]];
        
        var ret = erfa.zr(r);
        

        (ret[0][0]).should.be.closeTo(0.0, 0.0);
        (ret[1][0]).should.be.closeTo(0.0, 0.0);
        (ret[2][0]).should.be.closeTo(0.0, 0.0);

        (ret[0][1]).should.be.closeTo(0.0, 0.0);
        (ret[1][1]).should.be.closeTo(0.0, 0.0);
        (ret[2][1]).should.be.closeTo(0.0, 0.0);

        (ret[0][2]).should.be.closeTo(0.0, 0.0);
        (ret[1][2]).should.be.closeTo(0.0, 0.0);
        (ret[2][2]).should.be.closeTo(0.0, 0.0);
        
      });
    });
  });

  describe('Matrix Ops', function () {
    describe('#rxr()', function () {
      it('Should multiply two r-matrices', function () {

        var a =[
          [2.0, 3.0, 2.0],
          [3.0, 2.0, 3.0],
          [3.0, 4.0, 5.0]
        ],

        b = [
          [1.0, 2.0, 2.0],
          [4.0, 1.0, 1.0],
          [3.0, 0.0, 1.0]
        ];

        var atb = erfa.rxr(a, b);

        (atb[0][0]).should.be.closeTo(20.0, 1e-12);
        (atb[0][1]).should.be.closeTo( 7.0, 1e-12);
        (atb[0][2]).should.be.closeTo( 9.0, 1e-12);

        (atb[1][0]).should.be.closeTo(20.0, 1e-12);
        (atb[1][1]).should.be.closeTo( 8.0, 1e-12);
        (atb[1][2]).should.be.closeTo(11.0, 1e-12);

        (atb[2][0]).should.be.closeTo(34.0, 1e-12);
        (atb[2][1]).should.be.closeTo(10.0, 1e-12);
        (atb[2][2]).should.be.closeTo(15.0, 1e-12);
        
      });
    });

    describe('#tr()', function () {
      it('Should transpose an r-matrix', function () {

        var r =[
          [2.0, 3.0, 2.0],
          [3.0, 2.0, 3.0],
          [3.0, 4.0, 5.0]
        ];

        var rt = erfa.tr(r);

        (rt[0][0]).should.be.closeTo(2.0, 0.0, "eraTr", "11");
        (rt[0][1]).should.be.closeTo(3.0, 0.0, "eraTr", "12");
        (rt[0][2]).should.be.closeTo(3.0, 0.0, "eraTr", "13");

        (rt[1][0]).should.be.closeTo(3.0, 0.0, "eraTr", "21");
        (rt[1][1]).should.be.closeTo(2.0, 0.0, "eraTr", "22");
        (rt[1][2]).should.be.closeTo(4.0, 0.0, "eraTr", "23");

        (rt[2][0]).should.be.closeTo(2.0, 0.0, "eraTr", "31");
        (rt[2][1]).should.be.closeTo(3.0, 0.0, "eraTr", "32");
        (rt[2][2]).should.be.closeTo(5.0, 0.0, "eraTr", "33");
      });
    });
  });

});
