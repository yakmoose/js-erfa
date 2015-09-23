"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Angle Ops', function () {

    describe("#anp()", function () {
        it('Should return a number in the range of 0 <= a <= 2π', function () {

            //todo: this tes does not allow for float presicion issues
            //vvd(eraAnp(-0.1), 6.183185307179586477, 1e-12, "eraAnp", "", status); //vvd is the similar to
            var anp = erfa.anp(-0.1);
            anp.should.be.closeTo(6.183185307179586477, 1e-12);
        });
    });

    describe("#anpm()", function () {
        it('Should return a number in the range of -π <= a < +π', function () {
            var anpm = erfa.anpm(-4.0);
            anpm.should.be.closeTo(2.283185307179586477, 1e-12);
        });
    });

    describe("#a2af()", function () {
        it('Should return an angle decomposed into degrees, minutes, seconds etc', function () {

            var a2af = erfa.a2af(4, 2.345);
            (a2af.sign).should.equal('+');
            (a2af.degrees).should.equal(134);
            (a2af.minutes).should.equal(21);
            (a2af.seconds).should.equal(30);
            (a2af.fraction).should.equal(9706);


        });
    });

    describe("#a2tf()", function () {
        it('Should return an angle decomposed into degrees, minutes, seconds etc', function () {

            var a2tf = erfa.a2tf(4, -3.01234);
            (a2tf.sign).should.equal('-');
            (a2tf.degrees).should.equal(11);
            (a2tf.minutes).should.equal(30);
            (a2tf.seconds).should.equal(22);
            (a2tf.fraction).should.equal(6484);

        });
    });

    describe("#af2a()", function () {
        it('Should return an angle in radians', function () {

            var af2a = erfa.af2a('-', 45, 13, 27.2);
            (af2a).should.be.closeTo(-0.7893115794313644842, 1e-12);

        });
    });

    describe("#d2tf()", function () {
        it('Should return days decomposed into hours, minutes, seconds etc', function () {

            var d2tf = erfa.d2tf(4, -0.987654321);
            (d2tf.sign).should.equal('-');
            (d2tf.hours).should.equal(23);
            (d2tf.minutes).should.equal(42);
            (d2tf.seconds).should.equal(13);
            (d2tf.fraction).should.equal(3333);

        });
    });


    describe("#tf2d()", function () {
        it('Should return an angle in radians', function () {

            var tf2d = erfa.tf2d(' ', 23, 55, 10.9);
            (tf2d).should.be.closeTo(0.9966539351851851852, 1e-12);

        });
    });

    describe("#tf2a()", function () {
        it('Should return an angle in radians', function () {

            var tf2a = erfa.tf2a('+', 4, 58, 20.2);
            (tf2a).should.be.closeTo(1.301739278189537429, 1e-12);

        });
    });

});