"use strict";

var chai = require('chai'),
  should = chai.should(),
  erfa = require('../index');

describe('Precession / Nutation', function () {

  describe("#bi00()", function () {
    it('Should return the frame bias components of IAU 2000 precession-nutation models (part of MHB2000 with additions).', function () {

      var ret = erfa.bi00();

      (ret.dpsibi).should.be.closeTo(-0.2025309152835086613e-6, 1e-12);
      (ret.depsbi).should.be.closeTo(-0.3306041454222147847e-7, 1e-12);
      (ret.dra).should.be.closeTo(-0.7078279744199225506e-7, 1e-12);

    });
  });

  describe("#bp00()", function () {
    it('Should calculate the frame bias and precession, IAU 2000.', function () {

      var ret = erfa.bp00(2400000.5, 50123.9999);


      (ret.rb[0][0]).should.be.closeTo(0.9999999999999942498, 1e-12);
      (ret.rb[0][1]).should.be.closeTo(-0.7078279744199196626e-7, 1e-16);
      (ret.rb[0][2]).should.be.closeTo(0.8056217146976134152e-7, 1e-16);
      (ret.rb[1][0]).should.be.closeTo(0.7078279477857337206e-7, 1e-16);
      (ret.rb[1][1]).should.be.closeTo(0.9999999999999969484, 1e-12);
      (ret.rb[1][2]).should.be.closeTo(0.3306041454222136517e-7, 1e-16);
      (ret.rb[2][0]).should.be.closeTo(-0.8056217380986972157e-7, 1e-16);
      (ret.rb[2][1]).should.be.closeTo(-0.3306040883980552500e-7, 1e-16);
      (ret.rb[2][2]).should.be.closeTo(0.9999999999999962084, 1e-12);

      (ret.rp[0][0]).should.be.closeTo(0.9999995504864048241, 1e-12);
      (ret.rp[0][1]).should.be.closeTo(0.8696113836207084411e-3, 1e-14);
      (ret.rp[0][2]).should.be.closeTo(0.3778928813389333402e-3, 1e-14);
      (ret.rp[1][0]).should.be.closeTo(-0.8696113818227265968e-3, 1e-14);
      (ret.rp[1][1]).should.be.closeTo(0.9999996218879365258, 1e-12);
      (ret.rp[1][2]).should.be.closeTo(-0.1690679263009242066e-6, 1e-14);
      (ret.rp[2][0]).should.be.closeTo(-0.3778928854764695214e-3, 1e-14);
      (ret.rp[2][1]).should.be.closeTo(-0.1595521004195286491e-6, 1e-14);
      (ret.rp[2][2]).should.be.closeTo(0.9999999285984682756, 1e-12);

      (ret.rbp[0][0]).should.be.closeTo(0.9999995505175087260, 1e-12);
      (ret.rbp[0][1]).should.be.closeTo(0.8695405883617884705e-3, 1e-14);
      (ret.rbp[0][2]).should.be.closeTo(0.3779734722239007105e-3, 1e-14);
      (ret.rbp[1][0]).should.be.closeTo(-0.8695405990410863719e-3, 1e-14);
      (ret.rbp[1][1]).should.be.closeTo(0.9999996219494925900, 1e-12);
      (ret.rbp[1][2]).should.be.closeTo(-0.1360775820404982209e-6, 1e-14);
      (ret.rbp[2][0]).should.be.closeTo(-0.3779734476558184991e-3, 1e-14);
      (ret.rbp[2][1]).should.be.closeTo(-0.1925857585832024058e-6, 1e-14);
      (ret.rbp[2][2]).should.be.closeTo(0.9999999285680153377, 1e-12);

    });
  });

  describe("#bp06()", function () {
    it('Should calculate the frame bias and precession, IAU 2006.', function () {

      var ret = erfa.bp06(2400000.5, 50123.9999);


      (ret.rb[0][0]).should.be.closeTo(0.9999999999999942497, 1e-12);
      (ret.rb[0][1]).should.be.closeTo(-0.7078368960971557145e-7, 1e-14);
      (ret.rb[0][2]).should.be.closeTo(0.8056213977613185606e-7, 1e-14);
      (ret.rb[1][0]).should.be.closeTo(0.7078368694637674333e-7, 1e-14);
      (ret.rb[1][1]).should.be.closeTo(0.9999999999999969484, 1e-12);
      (ret.rb[1][2]).should.be.closeTo(0.3305943742989134124e-7, 1e-14);
      (ret.rb[2][0]).should.be.closeTo(-0.8056214211620056792e-7, 1e-14);
      (ret.rb[2][1]).should.be.closeTo(-0.3305943172740586950e-7, 1e-14);
      (ret.rb[2][2]).should.be.closeTo(0.9999999999999962084, 1e-12);

      (ret.rp[0][0]).should.be.closeTo(0.9999995504864960278, 1e-12);
      (ret.rp[0][1]).should.be.closeTo(0.8696112578855404832e-3, 1e-14);
      (ret.rp[0][2]).should.be.closeTo(0.3778929293341390127e-3, 1e-14);
      (ret.rp[1][0]).should.be.closeTo(-0.8696112560510186244e-3, 1e-14);
      (ret.rp[1][1]).should.be.closeTo(0.9999996218880458820, 1e-12);
      (ret.rp[1][2]).should.be.closeTo(-0.1691646168941896285e-6, 1e-14);
      (ret.rp[2][0]).should.be.closeTo(-0.3778929335557603418e-3, 1e-14);
      (ret.rp[2][1]).should.be.closeTo(-0.1594554040786495076e-6, 1e-14);
      (ret.rp[2][2]).should.be.closeTo(0.9999999285984501222, 1e-12);

      (ret.rbp[0][0]).should.be.closeTo(0.9999995505176007047, 1e-12);
      (ret.rbp[0][1]).should.be.closeTo(0.8695404617348208406e-3, 1e-14);
      (ret.rbp[0][2]).should.be.closeTo(0.3779735201865589104e-3, 1e-14);
      (ret.rbp[1][0]).should.be.closeTo(-0.8695404723772031414e-3, 1e-14);
      (ret.rbp[1][1]).should.be.closeTo(0.9999996219496027161, 1e-12);
      (ret.rbp[1][2]).should.be.closeTo(-0.1361752497080270143e-6, 1e-14);
      (ret.rbp[2][0]).should.be.closeTo(-0.3779734957034089490e-3, 1e-14);
      (ret.rbp[2][1]).should.be.closeTo(-0.1924880847894457113e-6, 1e-14);
      (ret.rbp[2][2]).should.be.closeTo(0.9999999285679971958, 1e-12);
    });
  });

  describe("#bpn2xy()", function () {
      it('Should extract from the bias-precession-nutation matrix the X,Y coordinates of the Celestial Intermediate Pole', function () {

        var rbpn = [
          [9.999962358680738e-1, -2.516417057665452e-3, -1.093569785342370e-3],
          [2.516462370370876e-3, 9.999968329010883e-1, 4.006159587358310e-5],
          [1.093465510215479e-3, -4.281337229063151e-5, 9.999994012499173e-1]
        ];

        var ret = erfa.bpn2xy(rbpn);

        (ret.x).should.be.closeTo(1.093465510215479e-3, 1e-12);
        (ret.y).should.be.closeTo(-4.281337229063151e-5, 1e-12);

      });
    });

  describe("#c2i00a()", function () {
    it('Should form the celestial-to-intermediate matrix for a given date using the IAU 2000A precession-nutation model', function () {

      var ret = erfa.c2i00a(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999998323037165557, 1e-12);
      (ret[0][1]).should.be.closeTo(0.5581526348992140183e-9, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.5791308477073443415e-3, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.2384266227870752452e-7, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991917405258, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4020594955028209745e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5791308472168152904e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4020595661591500259e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998314954572304, 1e-12);

    });
  });

  describe("#c2i00b()", function () {
    it('Should form the celestial-to-intermediate matrix for a given date using the IAU 2000B precession-nutation model', function () {

      var ret = erfa.c2i00b(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999998323040954356, 1e-12);
      (ret[0][1]).should.be.closeTo(0.5581526349131823372e-9, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.5791301934855394005e-3, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.2384239285499175543e-7, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991917574043, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4020552974819030066e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5791301929950208873e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4020553681373720832e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998314958529887, 1e-12);

    });
  });

  describe("#c2i06a()", function () {
    it('', function () {

      var ret = erfa.c2i06a(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999998323037159379, 1e-12);
      (ret[0][1]).should.be.closeTo(0.5581121329587613787e-9, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.5791308487740529749e-3, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.2384253169452306581e-7, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991917467827, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4020579392895682558e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5791308482835292617e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4020580099454020310e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998314954628695, 1e-12);

    });
  });

});