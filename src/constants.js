(function () {
"use strict";

    var CONSTANTS = {
        /* Pi */
        ERFA_DPI: Math.PI,

        /* 2Pi */
        ERFA_D2PI: 2 * Math.PI,

        /* Radians to degrees */
        ERFA_DR2D: 57.29577951308232087679815,

        /* Degrees to radians */
        ERFA_DD2R: 1.745329251994329576923691e-2,

        /* Radians to arcseconds */
        ERFA_DR2AS: 206264.8062470963551564734,

        /* Arcseconds to radians */
        ERFA_DAS2R: 4.848136811095359935899141e-6,

        /* Seconds of time to radians */
        ERFA_DS2R: 7.272205216643039903848712e-5,

        /* Arcseconds in a full circle */
        ERFA_TURNAS: 1296000.0,

        /* Milliarcseconds to radians */
        ERFA_DMAS2R: 4.848136811095359935899141e-6 / 1e3,

        /* Length of tropical year B1900 (days) */
        ERFA_DTY: 365.242198781,

        /* Seconds per day. */
        ERFA_DAYSEC: 86400.0,

        /* Days per Julian year */
        ERFA_DJY: 365.25,

        /* Days per Julian century */
        ERFA_DJC: 36525.0,

        /* Days per Julian millennium */
        ERFA_DJM: 365250.0,

        /* Reference epoch (J2000.0), Julian Date */
        ERFA_DJ00: 2451545.0,

        /* Julian Date of Modified Julian Date zero */
        ERFA_DJM0: 2400000.5,

        /* Reference epoch (J2000.0), Modified Julian Date */
        ERFA_DJM00: 51544.5,

        /* 1977 Jan 1.0 as MJD */
        ERFA_DJM77: 43144.0,

        /* TT minus TAI (s) */
        ERFA_TTMTAI: 32.184,

        /* Astronomical unit (m) */
        ERFA_DAU: 149597870e3,

        /* Speed of light (m/s) */
        ERFA_CMPS: 299792458.0,

        /* Light time for 1 au (s) */
        ERFA_AULT: 499.004782,

        /* Speed of light (AU per day) */
        ERFA_DC: 86400.0 / 499.004782,

        /* L_G = 1 - d(TT)/d(TCG) */
        ERFA_ELG: 6.969290134e-10,

        /* L_B = 1 - d(TDB)/d(TCB), and TDB (s) at TAI 1977/1/1.0 */
        ERFA_ELB: 1.550519768e-8,
        ERFA_TDB0: -6.55e-5,

        /* Schwarzschild radius of the Sun (au) */
        /* = 2 * 1.32712440041e20 / (2.99792458e8)^2 / 1.49597870700e11 */
        ERFA_SRS: 1.97412574336e-8,

        /* ERFA_DINT(A) - truncate to nearest whole number towards zero (double) */
        ERFA_DINT: function (A) {return A < 0.0 ? Math.ceil(A) : Math.floor(A); },

        /* ERFA_DNINT(A) - round to nearest whole number (double) */
        ERFA_DNINT: function (A) { return A < 0.0 ? Math.ceil(A-0.5) : Math.floor(A+0.5); },

        /* ERFA_DSIGN(A,B) - magnitude of A with sign of B (double) */
        ERFA_DSIGN: function (A, B) { return B < 0.0 ? -Math.abs(A) : Math.abs(A); },

        /* max(A,B) - larger (most +ve) of two numbers (generic) */
        ERFA_GMAX: function (A, B) { return A > B ? A : B ;},

        /* min(A,B) - smaller (least +ve) of two numbers (generic) */
        ERFA_GMIN: function (A, B) { return A < B ? A : B;},

        /* Reference ellipsoids */
        ERFA_WGS84: 1,
        ERFA_GRS80: 2,
        ERFA_WGS72: 3,
    };

    module.exports = CONSTANTS;
})();