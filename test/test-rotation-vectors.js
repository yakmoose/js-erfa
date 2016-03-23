"use strict";

var chai = require('chai'),
  should = chai.should(),
  erfa = require('../index');

describe('Rotation Vectors', function () {


  describe("#rm2v()", function () {
    it('Should Express an r-matrix as an r-vector', function () {
      var r = [
          [0.00, -0.80, -0.60],
          [0.80, -0.36, 0.48],
          [0.60, 0.48, -0.64]
        ];

      var ret = erfa.rm2v(r);

      (ret[0]).should.be.closeTo(0.0, 1e-12);
      (ret[1]).should.be.closeTo(1.413716694115406957, 1e-12);
      (ret[2]).should.be.closeTo(-1.884955592153875943, 1e-12);

    });
  });

  describe("#rv2m()", function () {
    it('Should form the r-matrix corresponding to a given r-vector', function () {

      var w = [0.0, 1.41371669, -1.88495559];

      var ret = erfa.rv2m(w);

      (ret[0][0]).should.be.closeTo(-0.7071067782221119905, 1e-14);
      (ret[0][1]).should.be.closeTo(-0.5656854276809129651, 1e-14);
      (ret[0][2]).should.be.closeTo(-0.4242640700104211225, 1e-14);

      (ret[1][0]).should.be.closeTo(0.5656854276809129651, 1e-14);
      (ret[1][1]).should.be.closeTo(-0.0925483394532274246, 1e-14);
      (ret[1][2]).should.be.closeTo(-0.8194112531408833269, 1e-14);

      (ret[2][0]).should.be.closeTo(0.4242640700104211225, 1e-14);
      (ret[2][1]).should.be.closeTo(-0.8194112531408833269, 1e-14);
      (ret[2][2]).should.be.closeTo(0.3854415612311154341, 1e-14);

    });
  });


});