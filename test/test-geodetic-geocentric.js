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
        it('Transforms geocentric coordinates to geodetic for a reference ellipsoid of specified form', function () {

            var xyz = [2e6, 3e6, 5.244e6];

            var gc2gde = erfa.gc2gde(6378136.0, 0.0033528 , xyz);
            (gc2gde.status).should.equal(0);
            (gc2gde.e).should.be.closeTo(0.98279372324732907, 1e-14);
            (gc2gde.p).should.be.closeTo(0.97160183775704115, 1e-14);
            (gc2gde.h).should.be.closeTo(332.36862495764397, 1e-8);

        });
    });

    describe("#gd2gc()", function () {
        it('Transform geodetic coordinates to geocentric using the specified reference ellipsoid', function () {

            var e = 3.1, p = -0.5, h = 2500.0;

            var gd2gc = erfa.gd2gc(0, e, p, h);
            (gd2gc.status).should.equal(-1);

            gd2gc = erfa.gd2gc(ERFA_CONSTANTS.ERFA_WGS84, e, p, h);
            (gd2gc.status).should.equal(0);

            (gd2gc.x).should.be.closeTo(-5599000.5577049947, 1e-7);
            (gd2gc.y).should.be.closeTo(233011.67223479203, 1e-7);
            (gd2gc.z).should.be.closeTo(-3040909.4706983363, 1e-7);

            gd2gc = erfa.gd2gc(ERFA_CONSTANTS.ERFA_GRS80, e, p, h);
            (gd2gc.status).should.equal(0);

            (gd2gc.x).should.be.closeTo(-5599000.5577260984, 1e-7);
            (gd2gc.y).should.be.closeTo(233011.6722356703, 1e-7);
            (gd2gc.z).should.be.closeTo(-3040909.4706095476, 1e-7);

            gd2gc = erfa.gd2gc(ERFA_CONSTANTS.ERFA_WGS72, e, p, h);
            (gd2gc.status).should.equal(0);

            (gd2gc.x).should.be.closeTo(-5598998.7626301490, 1e-7);
            (gd2gc.y).should.be.closeTo(233011.5975297822, 1e-7);
            (gd2gc.z).should.be.closeTo(-3040908.6861467111, 1e-7);

            gd2gc = erfa.gd2gc(4, e, p, h);
            (gd2gc.status).should.equal(-1);

        });
    });

    describe("#gd2gce()", function () {
        it('Transform geodetic coordinates to geocentric for a reference ellipsoid of specified form', function () {
            /*
             int j;
             double a = 6378136.0, f = 0.0033528;
             double e = 3.1, p = -0.5, h = 2500.0;
             double xyz[3];

             j = eraGd2gce(a, f, e, p, h, xyz);

             viv(j, 0, "eraGd2gce", "j", status);
             vvd(xyz[0], -5598999.6665116328, 1e-7, "eraGd2gce", "0", status);
             vvd(xyz[1], 233011.63514630572, 1e-7, "eraGd2gce", "1", status);
             vvd(xyz[2], -3040909.0517314132, 1e-7, "eraGd2gce", "2", status);
             */
            var a = 6378136.0, f = 0.0033528, e = 3.1, p = -0.5, h = 2500.0;

            var gd2gce = erfa.gd2gce(a, f, e, p, h);

            (gd2gce.status).should.equal(0);

            (gd2gce.x).should.be.closeTo(-5598999.6665116328, 1e-7);
            (gd2gce.y).should.be.closeTo(233011.63514630572, 1e-7);
            (gd2gce.z).should.be.closeTo(-3040909.0517314132, 1e-7);
        });
    });
});