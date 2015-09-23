"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Galactic Coordinates', function () {

    describe("#g2icrs()", function () {
        it('Should return ICRS from Galactic coordinates', function () {

            var g2icrs = erfa.g2icrs(5.5850536063818546461558105, -0.7853981633974483096156608);
            (g2icrs.dr).should.be.closeTo(5.9338074302227188048671, 1e-14);
            (g2icrs.dd).should.be.closeTo(-1.1784870613579944551541, 1e-14);

        });
    });

    describe("#icrs2g()", function () {
        it('Should Galactic coordinates from ICRS', function () {

            var icrs2g = erfa.icrs2g(5.9338074302227188048671087, -1.1784870613579944551540570);
            (icrs2g.dl).should.be.closeTo(5.5850536063818546461558, 1e-14);
            (icrs2g.db).should.be.closeTo(-0.7853981633974483096157, 1e-14);

        });
    });
});
