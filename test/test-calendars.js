"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Calendars', function () {

    describe("#cal2jd()", function () {
        it('Should return a julian date from a calendar date', function () {

            //j = eraCal2jd(2003, 06, 01, &djm0, &djm);
            //vvd(djm0, 2400000.5, 0.0, "eraCal2jd", "djm0", status);
            //vvd(djm,    52791.0, 0.0, "eraCal2jd", "djm", status);
            //viv(j, 0, "eraCal2jd", "j", status);

            var cal2jd = erfa.cal2jd(2003, 6, 1);
            (cal2jd.djm0).should.be.closeTo(2400000.5, 0.0);
            (cal2jd.djm).should.be.closeTo(52791.0, 0.0);
        });
    });

    describe("#epb()", function () {
        it('Should return Besselian Epoch from a Julian date', function () {

            //epb = eraEpb(2415019.8135, 30103.18648);
            //vvd(epb, 1982.418424159278580, 1e-12, "eraEpb", "", status);

            var epb = erfa.epb(2415019.8135, 30103.18648);
            (epb).should.be.closeTo(1982.418424159278580, 1e-12);

        });
    });

    describe("#epb2jd()", function () {
        it('Should return a Julian Date from Besselian Epoch', function () {

            //epb = 1957.3;
            //eraEpb2jd(epb, &djm0, &djm);
            //vvd(djm0, 2400000.5, 1e-9, "eraEpb2jd", "djm0", status);
            //vvd(djm, 35948.1915101513, 1e-9, "eraEpb2jd", "mjd", status);

            var epb2jd = erfa.epb2jd(1957.3);
            (epb2jd.djm0).should.be.closeTo(2400000.5, 1e-9);
            (epb2jd.djm).should.be.closeTo(35948.1915101513, 1e-9);

        });
    });


    describe("#epj2jd()", function () {
        it('Should return a Julian Date from a Julian Epoch', function () {

            //epj = 1996.8;
            //eraEpj2jd(epj, &djm0, &djm);
            //vvd(djm0, 2400000.5, 1e-9, "eraEpj2jd", "djm0", status);
            //vvd(djm,    50375.7, 1e-9, "eraEpj2jd", "mjd",  status);

            var epj2jd = erfa.epj2jd(1996.8);
            (epj2jd.djm0).should.be.closeTo(2400000.5, 1e-9);
            (epj2jd.djm).should.be.closeTo(50375.7, 1e-9);

        });
    });

    describe("#jd2cal()", function () {
        it('Should return a Gregorian year, month, day, and fraction of a day from a Julian Date', function () {

            //dj1 = 2400000.5;
            //dj2 = 50123.9999;
            //j = eraJd2cal(dj1, dj2, &iy, &im, &id, &fd);
            //viv(iy, 1996, "eraJd2cal", "y", status);
            //viv(im, 2, "eraJd2cal", "m", status);
            //viv(id, 10, "eraJd2cal", "d", status);
            //vvd(fd, 0.9999, 1e-7, "eraJd2cal", "fd", status);
            //viv(j, 0, "eraJd2cal", "j", status);

            var jd2cal = erfa.jd2cal(2400000.5, 50123.9999);
            (jd2cal.year).should.equal(1996);
            (jd2cal.month).should.equal(2);
            (jd2cal.day).should.equal(10);
            (jd2cal.fraction).should.be.closeTo(0.9999, 1e-7);

        });
    });

    //
    describe("#jdcalf()", function () {
        it('Should return a Gregorian year, month, day, and fraction of a day from a Julian Date', function () {

            //dj1 = 2400000.5;
            //dj2 = 50123.9999;
            //j = eraJdcalf(4, dj1, dj2, iydmf);
            //viv(iydmf[0], 1996, "eraJdcalf", "y", status);
            //viv(iydmf[1], 2, "eraJdcalf", "m", status);
            //viv(iydmf[2], 10, "eraJdcalf", "d", status);
            //viv(iydmf[3], 9999, "eraJdcalf", "f", status);
            //viv(j, 0, "eraJdcalf", "j", status);

            var jdcalf = erfa.jdcalf(4, 2400000.5, 50123.9999);
            (jdcalf.year).should.equal(1996);
            (jdcalf.month).should.equal(2);
            (jdcalf.day).should.equal(10);
            (jdcalf.fraction).should.equal(9999);

        });
    });
});