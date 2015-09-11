"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Space motion', function () {

    describe("#pvstar()", function () {
        it('Should return catalog coordinates from star position+velocity vector', function () {
            //pv[0][0] =  126668.5912743160601;
            //pv[0][1] =  2136.792716839935195;
            //pv[0][2] = -245251.2339876830091;
            //
            //pv[1][0] = -0.4051854035740712739e-2;
            //pv[1][1] = -0.6253919754866173866e-2;
            //pv[1][2] =  0.1189353719774107189e-1;
            //
            //j = eraPvstar(pv, &ra, &dec, &pmr, &pmd, &px, &rv);
            //
            //vvd(ra, 0.1686756e-1, 1e-12, "eraPvstar", "ra", status);
            //vvd(dec, -1.093989828, 1e-12, "eraPvstar", "dec", status);
            //vvd(pmr, -0.178323516e-4, 1e-16, "eraPvstar", "pmr", status);
            //vvd(pmd, 0.2336024047e-5, 1e-16, "eraPvstar", "pmd", status);
            //vvd(px, 0.74723, 1e-12, "eraPvstar", "px", status);
            //vvd(rv, -21.6, 1e-11, "eraPvstar", "rv", status);
            //
            //viv(j, 0, "eraPvstar", "j", status);

            var pv = [
                    [
                        126668.5912743160601,
                        2136.792716839935195,
                        -245251.2339876830091
                    ],
                    [
                        -0.4051854035740712739e-2,
                        -0.6253919754866173866e-2,
                        0.1189353719774107189e-1
                    ]
                ],
                pvstar = erfa.pvstar(pv);

            (pvstar.ra).should.be.closeTo(0.1686756e-1, 1e-12);
            (pvstar.dec).should.be.closeTo(-1.093989828, 1e-12);
            (pvstar.pmr).should.be.closeTo(-0.178323516e-4, 1e-16);
            (pvstar.pmd).should.be.closeTo(0.2336024047e-5, 1e-16);
            (pvstar.px).should.be.closeTo(0.74723, 1e-12);
            (pvstar.rv).should.be.closeTo(-21.6, 1e-11);
            (pvstar.status).should.equal(0);

        });
    });

    describe("#starpv()", function () {
        it('Should Convert star position+velocity vector to catalog coordinates', function () {
            //ra =   0.01686756;
            //dec = -1.093989828;
            //pmr = -1.78323516e-5;
            //pmd =  2.336024047e-6;
            //px =   0.74723;
            //rv = -21.6;

            //
            //j = eraStarpv(ra, dec, pmr, pmd, px, rv, pv);
            //
            //vvd(pv[0][0], 126668.5912743160601, 1e-10, "eraStarpv", "11", status);
            //vvd(pv[0][1], 2136.792716839935195, 1e-12, "eraStarpv", "12", status);
            //vvd(pv[0][2], -245251.2339876830091, 1e-10, "eraStarpv", "13", status);
            //
            //vvd(pv[1][0], -0.4051854035740712739e-2, 1e-13, "eraStarpv", "21", status);
            //vvd(pv[1][1], -0.6253919754866173866e-2, 1e-15,  "eraStarpv", "22", status);
            //vvd(pv[1][2], 0.1189353719774107189e-1, 1e-13, "eraStarpv", "23", status);
            //
            //viv(j, 0, "eraStarpv", "j", status);

            var ra =   0.01686756,
                dec = -1.093989828,
                pmr = -1.78323516e-5,
                pmd =  2.336024047e-6,
                px =   0.74723,
                rv = -21.6,
                starpv = erfa.starpv(ra, dec, pmr, pmd, px, rv);

                (starpv.pv[0][0]).should.be.closeTo(126668.5912743160601, 1e-10);
                (starpv.pv[0][1]).should.be.closeTo(2136.792716839935195, 1e-12);
                (starpv.pv[0][2]).should.be.closeTo(-245251.2339876830091, 1e-10);

                (starpv.pv[1][0]).should.be.closeTo(-0.4051854035740712739e-2, 1e-13);
                (starpv.pv[1][1]).should.be.closeTo(-0.6253919754866173866e-2, 1e-15);
                (starpv.pv[1][2]).should.be.closeTo(0.1189353719774107189e-1, 1e-13);

            //(starpv)

        });
    });
});