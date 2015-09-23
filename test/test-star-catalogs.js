"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Star Catalogs', function () {


    describe("#fk52h()", function () {
        it('Transforms FK5 (J2000.0) star data into the Hipparcos system', function () {

            var r5  =  1.76779433,
            d5  = -0.2917517103,
            dr5 = -1.91851572e-7,
            dd5 = -5.8468475e-6,
            px5 =  0.379210,
            rv5 = -7.6;

            var fk52h = erfa.fk52h(r5, d5, dr5, dd5, px5, rv5);

            (fk52h.rh).should.be.closeTo(1.767794226299947632, 1e-14);
            (fk52h.dh).should.be.closeTo(-0.2917516070530391757, 1e-14);
            (fk52h.drh).should.be.closeTo(-0.19618741256057224e-6,1e-19);
            (fk52h.ddh).should.be.closeTo(-0.58459905176693911e-5, 1e-19);
            (fk52h.pxh).should.be.closeTo(0.37921, 1e-14);
            (fk52h.rvh).should.be.closeTo(-7.6000000940000254, 1e-11);

        });
    });

    describe("#fk5hip()", function () {
        it('Transforms FK5 to Hipparcos rotation and spin', function () {

            var r5  =  1.76779433,
                d5  = -0.2917517103,
                dr5 = -1.91851572e-7,
                dd5 = -5.8468475e-6,
                px5 =  0.379210,
                rv5 = -7.6;

            var fk5hip = erfa.fk5hip(r5, d5, dr5, dd5, px5, rv5);

            (fk5hip.r5h[0][0]).should.be.closeTo(0.9999999999999928638, 1e-14);
            (fk5hip.r5h[0][1]).should.be.closeTo(0.1110223351022919694e-6, 1e-17);
            (fk5hip.r5h[0][2]).should.be.closeTo(0.4411803962536558154e-7, 1e-17);

            (fk5hip.r5h[1][0]).should.be.closeTo(-0.1110223308458746430e-6, 1e-17);
            (fk5hip.r5h[1][1]).should.be.closeTo(0.9999999999999891830, 1e-14);
            (fk5hip.r5h[1][2]).should.be.closeTo(-0.9647792498984142358e-7, 1e-17);

            (fk5hip.r5h[2][0]).should.be.closeTo(-0.4411805033656962252e-7, 1e-17);
            (fk5hip.r5h[2][1]).should.be.closeTo(0.9647792009175314354e-7, 1e-17);
            (fk5hip.r5h[2][2]).should.be.closeTo(0.9999999999999943728, 1e-14);

            (fk5hip.s5h[0]).should.be.closeTo(-0.1454441043328607981e-8, 1e-17);
            (fk5hip.s5h[1]).should.be.closeTo(0.2908882086657215962e-8, 1e-17);
            (fk5hip.s5h[2]).should.be.closeTo(0.3393695767766751955e-8, 1e-17);

        });
    });

    describe("#fk5hz()", function () {
        it('Transform an FK5 (J2000.0) star position into the system of the Hipparcos catalogue, assuming zero Hipparcos proper motion', function () {

            var fk5hz  = erfa.fk5hz(1.76779433, -0.2917517103, 2400000.5, 54479.0);

            (fk5hz.rh).should.be.closeTo(1.767794191464423978, 1e-12);
            (fk5hz.dh).should.be.closeTo(-0.2917516001679884419, 1e-12);
        });
    });

    describe("#h2fk5()", function () {
        it('Transform Hipparcos star data into the FK5 (J2000.0) system.', function () {

            var h2fk5 = erfa.h2fk5(1.767794352, -0.2917512594, -2.76413026e-6, -5.92994449e-6, 0.379210, -7.6);

            (h2fk5.r5).should.be.closeTo(1.767794455700065506, 1e-13);
            (h2fk5.d5).should.be.closeTo(-0.2917513626469638890, 1e-13);
            (h2fk5.dr5).should.be.closeTo(-0.27597945024511204e-5, 1e-18);
            (h2fk5.dd5).should.be.closeTo(-0.59308014093262838e-5, 1e-18);
            (h2fk5.px5).should.be.closeTo(0.37921, 1e-13);
            (h2fk5.rv5).should.be.closeTo(-7.6000001309071126, 1e-10);


        });
    });

    describe("#hfk5z()", function () {
        it('Transform a Hipparcos star position into FK5 J2000.0, assuming zero Hipparcos proper motion', function () {

            var hfk5z = erfa.hfk5z(1.767794352, -0.2917512594, 2400000.5, 54479.0 );
            (hfk5z.r5).should.be.closeTo(1.767794490535581026, 1e-13);
            (hfk5z.d5).should.be.closeTo(-0.2917513695320114258, 1e-14);
            (hfk5z.dr5).should.be.closeTo(0.4335890983539243029e-8, 1e-22);
            (hfk5z.dd5).should.be.closeTo(-0.8569648841237745902e-9, 1e-23);

        });
    });

    //starpm
    describe("#starpm()", function () {
        it('update star catalog data for space motion', function () {

            var starpm = erfa.starpm(0.01686756, -1.093989828, -1.78323516e-5, 2.336024047e-6, 0.74723, -21.6, 2400000.5, 50083.0, 2400000.5, 53736.0);

            (starpm.ra).should.be.closeTo(0.01668919069414242368, 1e-13);
            (starpm.dec).should.be.closeTo(-1.093966454217127879, 1e-13);
            (starpm.pmr).should.be.closeTo(-0.1783662682155932702e-4, 1e-17);
            (starpm.pmd).should.be.closeTo(0.2338092915987603664e-5, 1e-17);
            (starpm.px).should.be.closeTo(0.7473533835323493644, 1e-13);
            (starpm.rv).should.be.closeTo(-21.59905170476860786, 1e-11);

            (starpm.status).should.equal(0);

        });
    });

});