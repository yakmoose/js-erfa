"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index'),
    ERFA_CONSTANTS = require('../lib/constants');

describe('Geodetic Geocentric', function () {

    describe("#eform()", function () {
        it('Should return Earth reference ellipsoids', function () {

            var eform = erfa.eform(0);
            (eform.status).should.equal(-1);

            eform = erfa.eform(ERFA_CONSTANTS.ERFA_WGS84);
            (eform.status).should.equal(0);
            (eform.a).should.be.closeTo(6378137.0, 1e-10);
            (eform.f).should.be.closeTo(0.0033528106647474807, 1e-18);

            eform = erfa.eform(ERFA_CONSTANTS.ERFA_GRS80);
            (eform.status).should.equal(0);
            (eform.a).should.be.closeTo(6378137.0, 1e-10);
            (eform.f).should.be.closeTo(0.0033528106811823189, 1e-18);

            eform = erfa.eform(ERFA_CONSTANTS.ERFA_WGS72);
            (eform.status).should.equal(0);
            (eform.a).should.be.closeTo(6378135.0, 1e-10);
            (eform.f).should.be.closeTo(0.0033527794541675049, 1e-18);

            eform = erfa.eform(4);
            (eform.status).should.equal(-1);

        });
    });

    describe("#gc2gd()", function () {
        it('Transforms geocentric coordinates to geodetic using the specified reference ellipsoid', function () {

            var xyz = [2e6, 3e6, 5.244e6];
            var gc2gd = erfa.gc2gd(0, xyz);
            (gc2gd.status).should.equal(-1);

            gc2gd = erfa.gc2gd(ERFA_CONSTANTS.ERFA_WGS84, xyz);
            (gc2gd.status).should.equal(0);
            (gc2gd.e).should.be.closeTo(0.98279372324732907, 1e-14);
            (gc2gd.p).should.be.closeTo(0.97160184819075459, 1e-14);
            (gc2gd.h).should.be.closeTo(331.41724614260599, 1e-8);

            gc2gd = erfa.gc2gd(ERFA_CONSTANTS.ERFA_GRS80, xyz);
            (gc2gd.status).should.equal(0);
            (gc2gd.e).should.be.closeTo(0.98279372324732907, 1e-14);
            (gc2gd.p).should.be.closeTo(0.97160184820607853, 1e-14);
            (gc2gd.h).should.be.closeTo(331.41731754844348, 1e-8);

            gc2gd = erfa.gc2gd(ERFA_CONSTANTS.ERFA_WGS72, xyz);
            (gc2gd.status).should.equal(0);
            (gc2gd.e).should.be.closeTo(0.98279372324732907, 1e-14);
            (gc2gd.p).should.be.closeTo(0.97160181811015119, 1e-14);
            (gc2gd.h).should.be.closeTo(333.27707261303181, 1e-8);

            gc2gd = erfa.gc2gd(4, xyz);
            (gc2gd.status).should.equal(-1);
        });
    });

    describe("#gc2gde()", function () {
        it('', function () {
        });
    });

    describe("#gd2gc()", function () {
        it('', function () {
        });
    });

    describe("#gd2gce()", function () {
        it('', function () {
        });
    });
});