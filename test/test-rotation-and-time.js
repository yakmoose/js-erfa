"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Rotation and Time', function () {

    describe("#era00()", function (){
        it("Should return a number", function (){

            //era00 = eraEra00(2400000.5, 54388.0);
            //vvd(era00, 0.4022837240028158102, 1e-12, "eraEra00", "", status);
            var era  = erfa.era00(2400000.5, 54388.0);
            (era).should.be.closeTo(0.4022837240028158102, 1e-12);
//            (era).should.be.above(0).and.below(Constants.D2PI);

        });
    });

    describe("#gmst06()", function(){
        it("Should return a sidereal time", function (){

            //theta = eraGmst06(2400000.5, 53736.0, 2400000.5, 53736.0);
            //vvd(theta, 1.754174971870091203, 1e-12, "eraGmst06", "", status);
            var gmst06 = erfa.gmst06(2400000.5, 53736.0, 2400000.5, 53736.0);
            (gmst06).should.be.closeTo( 1.754174971870091203, 1e-12);
//            (gmst06).should.be.above(0).and.below(Constants.D2PI);
        });
    });

    describe("#gmst00()", function(){
        it("Should return a sidereal time", function (){

            var gmst82 = erfa.gmst00(2400000.5, 53736.0, 2400000.5, 53736.0);

            (gmst82).should.be.closeTo( 1.754174972210740592, 1e-12);
            //(gmst82).should.be.above(0).and.below(Constants.D2PI);
        });
    });

    describe("#gmst82()", function(){
        it("Should return a sidereal time", function (){

            var gmst82 = erfa.gmst82(2400000.5, 53736.0);

            (gmst82).should.be.closeTo( 1.754174981860675096, 1e-12);
            //(gmst82).should.be.above(0).and.below(Constants.D2PI);
        });
    });

    describe("#gst06()", function (){
        it("Should return a sideral time", function (){

            var rnpb = [
                [
                    0.9999989440476103608,
                    -0.1332881761240011518e-2,
                    -0.5790767434730085097e-3
                ],
                [
                    0.1332858254308954453e-2,
                    0.9999991109044505944,
                    -0.4097782710401555759e-4
                ],
                [
                    0.5791308472168153320e-3,
                    0.4020595661593994396e-4,
                    0.9999998314954572365
                ]
            ];

            // vvd(theta, 1.754166138018167568, 1e-12, "eraGst06", "", status);
            var gst06 = erfa.gst06(2400000.5, 53736.0, 2400000.5, 53736.0, rnpb);
            (gst06).should.be.closeTo(1.754166138018167568, 1e-12);
        });
    });

    describe("#gst00a()", function (){
        it("Should return a sideral time", function (){
            //theta = eraGst00a(2400000.5, 53736.0, 2400000.5, 53736.0);
            //vvd(theta, 1.754166138018281369, 1e-12, "eraGst00a", "", status);
            var gst00a = erfa.gst00a(2400000.5, 53736.0, 2400000.5, 53736.0);
            (gst00a).should.be.closeTo(1.754166138018281369, 1e-12);
        });
    });

    describe("#gst00b()", function (){
        it("Should return a sideral time", function (){
            //theta = eraGst00b(2400000.5, 53736.0);
            //vvd(theta, 1.754166136510680589, 1e-12, "eraGst00b", "", status);
            var gst00b = erfa.gst00b(2400000.5, 53736.0);
            (gst00b).should.be.closeTo(1.754166136510680589, 1e-12);
        });
    });

    describe("#ee00a()", function (){
        it("Should return an angle in radians for equation of equinoxes", function (){
            //ee = eraEe00a(2400000.5, 53736.0);
            //vvd(ee, -0.8834192459222588227e-5, 1e-18, "eraEe00a", "", status);
            var ee = erfa.ee00a(2400000.5, 53736.0);
            (ee).should.be.closeTo(-0.8834192459222588227e-5, 1e-18);
        });
    });

    describe("#ee00b()", function (){
        it("Should return an angle in radians for equation of equinoxes", function (){
            //ee = eraEe00b(2400000.5, 53736.0);
            //vvd(ee, -0.8834192459222588227e-5, 1e-18, "eraEe00b", "", status);
            var ee = erfa.ee00b(2400000.5, 53736.0);
            (ee).should.be.closeTo(-0.8835700060003032831e-5, 1e-18);
        });
    });

    describe("#ee00()", function (){
        it("Should return an angle in radians for equation of equinoxes", function (){
            //ee = eraEe00(2400000.5, 53736.0, 0.4090789763356509900, -0.9630909107115582393e-5);
            //vvd(ee, -0.8834193235367965479e-5, 1e-18, "eraEe00", "", status);
            var ee = erfa.ee00(2400000.5, 53736.0, 0.4090789763356509900, -0.9630909107115582393e-5);
            (ee).should.be.closeTo(-0.8834193235367965479e-5, 1e-18);
        });
    });

    describe("#eect00()", function (){
        it("Should return an angle in radians for equation of equinoxes", function (){
            //eect = eraEect00(2400000.5, 53736.0);
            //vvd(eect, 0.2046085004885125264e-8, 1e-20, "eraEect00", "", status);
            var eect00 = erfa.eect00(2400000.5, 53736.0);
            (eect00).should.be.closeTo(0.2046085004885125264e-8, 1e-20);
        });
    });

    describe("#eraGst94()", function (){
        it("Should return a sideral time", function (){
            //theta = eraGst94(2400000.5, 53736.0);
            //vvd(theta, 1.754166136020645203, 1e-12, "eraGst94", "", status);
            var gst94 = erfa.gst94(2400000.5, 53736.0, 2400000.5, 53736.0);
            (gst94).should.be.closeTo(1.754166136020645203, 1e-12);
        });
    });

    describe("#gst06a()", function (){
        it("Should return a sideral time", function (){

            //theta = eraGst06a(2400000.5, 53736.0, 2400000.5, 53736.0);
            //vvd(theta, 1.754166137675019159, 1e-12, "eraGst06a", "", status);

            var gst06a = erfa.gst06a(2400000.5, 53736.0, 2400000.5, 53736.0);
            (gst06a).should.be.closeTo( 1.754166137675019159, 1e-12);
        });
    });

    describe("#eqeq94()", function (){
        it("Should return a sideral time", function (){
            //eqeq = eraEqeq94(2400000.5, 41234.0);
            //vvd(eqeq, 0.5357758254609256894e-4, 1e-17, "eraEqeq94", "", status);
            var eqeq94 = erfa.eqeq94(2400000.5, 41234.0);
            (eqeq94).should.be.closeTo(0.5357758254609256894e-4, 1e-17);
        });
    });

    describe("#ee06a()", function (){
        it("Should return an angle in radians for equation of equinoxes", function (){
            //ee = eraEe06a(2400000.5, 53736.0);
            //vvd(ee, -0.8834195072043790156e-5, 1e-15, "eraEe06a", "", status);
            var ee06a = erfa.ee06a(2400000.5, 53736.0);
            (ee06a).should.be.closeTo(-0.8834195072043790156e-5, 1e-15);
        });
    });

});