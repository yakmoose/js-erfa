/* VectorMatrix/AngleOps */
/*void eraA2af(int ndp, double angle, char *sign, int idmsf[4]);
void eraA2tf(int ndp, double angle, char *sign, int ihmsf[4]);
int eraAf2a(char s, int ideg, int iamin, double asec, double *rad);
double eraAnp(double a);
double eraAnpm(double a);
void eraD2tf(int ndp, double days, char *sign, int ihmsf[4]);
int eraTf2a(char s, int ihour, int imin, double sec, double *rad);
int eraTf2d(char s, int ihour, int imin, double sec, double *days);
*/

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

            //todo: this tes does not allow for float presicion issues
            //vvd(eraAnpm(-4.0), 2.283185307179586477, 1e-12, "eraAnpm", "", status);
            var anpm = erfa.anpm(-4.0);
            anpm.should.be.closeTo(2.283185307179586477, 1e-12);
        });
    });

    describe("#a2af()", function () {
        it('Should return an angle decomposed into degrees, minutes, seconds etc', function () {

            //eraA2af(4, 2.345, &s, idmsf);
            //viv(s, '+', "eraA2af", "s", status);
            //viv(idmsf[0],  134, "eraA2af", "0", status);
            //viv(idmsf[1],   21, "eraA2af", "1", status);
            //viv(idmsf[2],   30, "eraA2af", "2", status);
            //viv(idmsf[3], 9706, "eraA2af", "3", status);

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

            // eraA2tf(4, -3.01234, &s, ihmsf);
            //viv((int)s, '-', "eraA2tf", "s", status);
            //viv(ihmsf[0],   11, "eraA2tf", "0", status);
            //viv(ihmsf[1],   30, "eraA2tf", "1", status);
            //viv(ihmsf[2],   22, "eraA2tf", "2", status);
            //viv(ihmsf[3], 6484, "eraA2tf", "3", status);

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

            //j = eraAf2a('-', 45, 13, 27.2, &a);
            //vvd(a, -0.7893115794313644842, 1e-12, "eraAf2a", "a", status);
            //viv(j, 0, "eraAf2a", "j", status);

            var af2a = erfa.af2a('-', 45, 13, 27.2);
            (af2a).should.be.closeTo(-0.7893115794313644842, 1e-12);

        });
    });

    describe("#d2tf()", function () {
        it('Should return days decomposed into hours, minutes, seconds etc', function () {

            //eraD2tf(4, -0.987654321, &s, ihmsf);
            //viv((int)s, '-', "eraD2tf", "s", status);
            //viv(ihmsf[0], 23, "eraD2tf", "0", status);
            //viv(ihmsf[1], 42, "eraD2tf", "1", status);
            //viv(ihmsf[2], 13, "eraD2tf", "2", status);
            //viv(ihmsf[3], 3333, "eraD2tf", "3", status);

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

            //j = eraTf2d(' ', 23, 55, 10.9, &d);
            //vvd(d, 0.9966539351851851852, 1e-12, "eraTf2d", "d", status);
            //viv(j, 0, "eraTf2d", "j", status);

            var tf2d = erfa.tf2d(' ', 23, 55, 10.9);
            (tf2d).should.be.closeTo(0.9966539351851851852, 1e-12);

        });
    });

    describe("#tf2a()", function () {
        it('Should return an angle in radians', function () {

            //j = eraTf2a('+', 4, 58, 20.2, &a);
            //vvd(a, 1.301739278189537429, 1e-12, "eraTf2a", "a", status);
            //viv(j, 0, "eraTf2a", "j", status);

            var tf2a = erfa.tf2a('+', 4, 58, 20.2);
            (tf2a).should.be.closeTo(1.301739278189537429, 1e-12);

        });
    });

});