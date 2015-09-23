"use strict";

var assert = require('assert'),
    chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Timescales', function () {


    describe("#d2dtf()", function () {
        it("Should return julian date in a gregorian calendar", function () {

            var d2dtf = erfa.d2dtf("UTC", 5, 2400000.5, 49533.99999);
            (d2dtf.year).should.equal(1994);
            (d2dtf.month).should.equal(6);
            (d2dtf.day).should.equal(30);
            (d2dtf.hour).should.equal(23);
            (d2dtf.minute).should.equal(59);
            (d2dtf.second).should.equal(60);
            (d2dtf.fraction).should.equal(13599);

        });
    });

    describe("#dat()", function () {
        it("Should return the time delta between TAI-UTC", function () {

            var dat = erfa.dat(2003, 6, 1, 0.0);
            (dat).should.be.closeTo(32.0, 0.0);

            dat = erfa.dat(2008, 1, 17, 0.0);
            (dat).should.be.closeTo(33.0, 0.0);


            dat = erfa.dat(2015, 9, 1, 0.0, 0.0);
            (dat).should.be.closeTo(36.0, 0.0);



        });
    });

    describe("#dtdb()", function () {
        it("Should return the difference between barycentric dynamical time and terrestrial time", function () {

            var dtdb = erfa.dtdb(2448939.5, 0.123, 0.76543, 5.0123, 5525.242, 3190.0);
            (dtdb).should.be.closeTo(-0.1280368005936998991e-2, 1e-15);

        });
    });

    describe("#dtf2d()", function () {
        it("Should return a two part julian date", function () {

            var dtf2d = erfa.dtf2d("UTC", 1994, 6, 30, 23, 59, 60.13599);
            (dtf2d.u1 + dtf2d.u2).should.be.closeTo(2449534.49999, 1e-6);

        });
    });

    describe("#taitt()", function () {
        it("Should return the terrestrial time ", function () {

            var taitt = erfa.taitt(2453750.5, 0.892482639);
            (taitt.tt1).should.be.closeTo( 2453750.5, 1e-6);
            (taitt.tt2).should.be.closeTo( 0.892855139, 1e-12);

        });
    });

    describe("#taiut1()", function () {
        it("Should return UT time ", function () {

            var taiut1 = erfa.taiut1(2453750.5, 0.892482639, -32.6659);
            (taiut1.ut11).should.be.closeTo( 2453750.5, 1e-6);
            (taiut1.ut12).should.be.closeTo( 0.8921045614537037037, 1e-12);
        });
    });

    describe("#taiutc()", function () {
        it("Should return UTC time ", function () {

            var taiutc = erfa.taiutc(2453750.5, 0.892482639);
            (taiutc.utc1).should.be.closeTo( 2453750.5, 1e-6);
            (taiutc.utc2).should.be.closeTo( 0.8921006945555555556, 1e-12);

        });
    });

    describe("#tcbtdb()", function () {
        it("Should return Barycentric Dynamical Time", function () {

            var tcbtdb = erfa.tcbtdb(2453750.5, 0.893019599);
            (tcbtdb.tdb1).should.be.closeTo( 2453750.5, 1e-6);
            (tcbtdb.tdb2).should.be.closeTo( 0.8928551362746343397, 1e-12);

        });
    });

    describe("#tcgtt()", function () {
        it("Should return Terrestrial Time", function () {

            var tcgtt = erfa.tcgtt(2453750.5, 0.892862531);
            (tcgtt.tt1).should.be.closeTo( 2453750.5, 1e-6);
            (tcgtt.tt2).should.be.closeTo( 0.8928551387488816828, 1e-12);

        });
    });

    describe("#tdbtcb()", function () {
        it("Should return Barycentric Coordinate Time", function () {

            var tdbtcb = erfa.tdbtcb(2453750.5, 0.892855137);
            (tdbtcb.tcb1).should.be.closeTo( 2453750.5, 1e-6);
            (tdbtcb.tcb2).should.be.closeTo( 0.8930195997253656716, 1e-12);

        });
    });

    describe("#tdbtcb()", function () {
        it("Should return Barycentric Coordinate Time", function () {

            var tdbtcb = erfa.tdbtcb(2453750.5, 0.892855137);
            (tdbtcb.tcb1).should.be.closeTo( 2453750.5, 1e-6);
            (tdbtcb.tcb2).should.be.closeTo( 0.8930195997253656716, 1e-12);

        });
    });

    describe("#tdbtt()", function () {
        it("Should return Terrestrial Time", function () {

            var tdbtt = erfa.tdbtt(2453750.5, 0.892855137, -0.000201);
            (tdbtt.tt1).should.be.closeTo( 2453750.5, 1e-6);
            (tdbtt.tt2).should.be.closeTo( 0.8928551393263888889, 1e-12);

        });
    });

    describe("#tttai()", function () {
        it("Should return International Atomic Time", function () {

            var tttai = erfa.tttai(2453750.5, 0.892482639);
            (tttai.tai1).should.be.closeTo( 2453750.5, 1e-6);
            (tttai.tai2).should.be.closeTo( 0.892110139, 1e-12);

        });
    });

    describe("#tttcg()", function () {
        it("Should return Geocentric Coordinate Time", function () {

            var tttcg = erfa.tttcg(2453750.5, 0.892482639);
            (tttcg.tcg1).should.be.closeTo( 2453750.5, 1e-6);
            (tttcg.tcg2).should.be.closeTo( 0.8924900312508587113, 1e-12);

        });
    });

    describe("#tttdb()", function () {
        it("Should return Barycentric Dynamical Time", function () {

            var tttdb = erfa.tttdb(2453750.5, 0.892855139, -0.000201);
            (tttdb.tdb1).should.be.closeTo( 2453750.5, 1e-6);
            (tttdb.tdb2).should.be.closeTo( 0.8928551366736111111, 1e-12);

        });
    });

    describe("#ttut1()", function () {
        it("Should return Universal Time", function () {

            var ttut1 = erfa.ttut1(2453750.5, 0.892855139, 64.8499);
            (ttut1.ut11).should.be.closeTo( 2453750.5, 1e-6);
            (ttut1.ut12).should.be.closeTo( 0.8921045614537037037, 1e-12);

        });
    });

    describe("#ut1tai()", function () {
        it("Should return International Atomic Time", function () {

            var ut1tai = erfa.ut1tai(2453750.5, 0.892104561, -32.6659);
            (ut1tai.tai1).should.be.closeTo( 2453750.5, 1e-6);
            (ut1tai.tai2).should.be.closeTo( 0.8924826385462962963, 1e-12);

        });
    });

    describe("#ut1tt()", function () {
        it("Should return Terrestrial Time", function () {

            var ut1tt = erfa.ut1tt(2453750.5, 0.892104561, 64.8499);
            (ut1tt.tt1).should.be.closeTo( 2453750.5, 1e-6);
            (ut1tt.tt2).should.be.closeTo( 0.8928551385462962963, 1e-12);

        });
    });

    describe("#ut1utc()", function () {
        it("Should return UTC time", function () {

            var ut1utc = erfa.ut1utc(2453750.5, 0.892104561, 0.3341);
            (ut1utc.utc1).should.be.closeTo( 2453750.5, 1e-6);
            (ut1utc.utc2).should.be.closeTo( 0.8921006941018518519, 1e-12);

        });
    });

    describe("#utctai()", function () {
        it("Should return International Atomic Time", function () {

            var utctai = erfa.utctai(2453750.5, 0.892100694);
            (utctai.tai1).should.be.closeTo( 2453750.5, 1e-6);
            (utctai.tai2).should.be.closeTo( 0.8924826384444444444, 1e-12);

        });
    });

    describe("#utcut1()", function () {
        it("Should return Universal Time", function () {

            var utcut1 = erfa.utcut1(2453750.5, 0.892100694, 0.3341);
            (utcut1.ut11).should.be.closeTo( 2453750.5, 1e-6);
            (utcut1.ut12).should.be.closeTo( 0.8921045608981481481, 1e-12);

        });
    });

});