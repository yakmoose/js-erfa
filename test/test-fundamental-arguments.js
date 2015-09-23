"use strict";

var assert = require('assert'),
    chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Fundamental Arguments', function () {
    describe("#fal03()", function () {
        it("Should return a number in radians", function () {

            var fal03 = erfa.fal03(0.80);
            (fal03).should.be.closeTo(5.132369751108684150, 1e-12);
        });
    });

    describe("#falp03()", function () {
        it("Should return a number in radians", function () {

            var falp03 = erfa.falp03(0.80);
            (falp03).should.be.closeTo(6.226797973505507345, 1e-12);
        });
    });

    describe("#faf03()", function () {
        it("Should return a number in radians", function () {

            var faf03 = erfa.faf03(0.80);
            (faf03).should.be.closeTo(0.2597711366745499518, 1e-12);
        });
    });

    describe('#fad03()', function () {
        it("should return a number in radians", function () {

            var fad03 = erfa.fad03(0.80);
            (fad03).should.be.closeTo(1.946709205396925672, 1e-12);
        });
    });

    describe('#faom03()', function () {
        it("Should return a number in radians", function () {

            var faom03 = erfa.faom03(0.80);
            (faom03).should.be.closeTo(-5.973618440951302183, 1e-12);
        });
    });

    describe('#fave03()', function () {
        it("Should return a number in radians", function () {

            var fave03 = erfa.fave03(0.80);
            (fave03).should.be.closeTo(3.424900460533758000, 1e-12);
        });
    });

    describe('#fae03()', function () {
        it("Should return a number in radians", function () {

            var fae03 = erfa.fae03(0.80);
            (fae03).should.be.closeTo(1.744713738913081846, 1e-12);
        });
    });

    describe('#fapa03()', function () {
        it("Should return a number in radians", function () {

            var fapa03 = erfa.fapa03(0.80);
            (fapa03).should.be.closeTo(0.1950884762240000000e-1, 1e-12);
        });
    });

    describe('#fame03()', function () {
        it("Should return a number in radians", function () {

            var fame03 = erfa.fame03(0.80);
            (fame03).should.be.closeTo(5.417338184297289661, 1e-12);
        });
    });

    describe('#fama03()', function () {
        it("Should return a number in radians", function () {

            var fama03 = erfa.fama03(0.80);
            (fama03).should.be.closeTo(3.275506840277781492, 1e-12);
        });
    });

    describe('#faju03()', function () {
        it("Should return a number in radians", function () {

            var faju03 = erfa.faju03(0.80);
            (faju03).should.be.closeTo(5.275711665202481138, 1e-12);
        });
    });

    describe('#fasa03()', function () {
        it("Should return a number in radians", function () {

            var fasa03 = erfa.fasa03(0.80);
            (fasa03).should.be.closeTo(5.371574539440827046, 1e-12);
        });
    });

    describe('#faur03()', function () {
        it("Should return a number in radians", function () {

            var faur03 = erfa.faur03(0.80);
            (faur03).should.be.closeTo(5.180636450180413523, 1e-12);
        });
    });

    describe('#fane03()', function () {
        it("Should return a number in radians", function () {

            var fane03 = erfa.fane03(0.80);
            (fane03).should.be.closeTo(2.079343830860413523, 1e-12);
        });
    });

});