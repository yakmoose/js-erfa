"use strict";

var chai = require('chai'),
  should = chai.should(),
  erfa = require('../index'),
  ERFA_CONSTANTS = require('../src/constants');


describe('Matrix Vector Products', function () {

  describe("#rxp()", function () {
    it('should multiply a p-vector by an r-matrix', function () {

      var r = [
          [2.0, 3.0, 2.0],
          [3.0, 2.0, 3.0],
          [3.0, 4.0, 5.0]
        ],
        p = [0.2, 1.5, 0.1];

      var ret = erfa.rxp(r, p);

      (ret[0]).should.be.closeTo(5.1, 1e-12);
      (ret[1]).should.be.closeTo(3.9, 1e-12);
      (ret[2]).should.be.closeTo(7.1, 1e-12);

    });
  });

  describe("#rxpv()", function () {
    it('should multiply a pv-vector by an r-matrix', function () {

      var r = [
          [2.0, 3.0, 2.0],
          [3.0, 2.0, 3.0],
          [3.0, 4.0, 5.0]
        ],

        p = [
          [0.2, 1.5, 0.1],
          [1.5, 0.2, 0.1]
        ];

      var ret = erfa.rxpv(r, p);

      (ret[0][0]).should.be.closeTo(5.1, 1e-12);
      (ret[1][0]).should.be.closeTo(3.8, 1e-12);

      (ret[0][1]).should.be.closeTo(3.9, 1e-12);
      (ret[1][1]).should.be.closeTo(5.2, 1e-12);

      (ret[0][2]).should.be.closeTo(7.1, 1e-12);
      (ret[1][2]).should.be.closeTo(5.8, 1e-12);

    });
  });

  describe("#trxp()", function () {
    it('should multiply a p-vector by the transpose of an r-matrix', function () {

      var r = [
          [2.0, 3.0, 2.0],
          [3.0, 2.0, 3.0],
          [3.0, 4.0, 5.0]
        ],
        p = [0.2, 1.5, 0.1];

      var ret = erfa.trxp(r, p);

      (ret[0]).should.be.closeTo(5.2, 1e-12);
      (ret[1]).should.be.closeTo(4.0, 1e-12);
      (ret[2]).should.be.closeTo(5.4, 1e-12);

    });
  });

  describe("#trxpv(()", function () {
    it('Multiply a pv-vector by the transpose of an r-matrix', function () {

      var r = [
          [2.0, 3.0, 2.0],
          [3.0, 2.0, 3.0],
          [3.0, 4.0, 5.0]
        ],
        pv = [
          [0.2, 1.5, 0.1],
          [1.5, 0.2, 0.1]
        ];

      var ret = erfa.trxpv(r, pv);

      (ret[0][0]).should.be.closeTo(5.2, 1e-12);
      (ret[0][1]).should.be.closeTo(4.0, 1e-12);
      (ret[0][2]).should.be.closeTo(5.4, 1e-12);

      (ret[1][0]).should.be.closeTo(3.9, 1e-12);
      (ret[1][1]).should.be.closeTo(5.3, 1e-12);
      (ret[1][2]).should.be.closeTo(4.1, 1e-12);


    });
  });
});
