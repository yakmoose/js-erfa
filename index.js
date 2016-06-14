(function () {
    "use strict";

    var LIBERFA = require('./lib/liberfa'),
        CONSTANTS = require('./src/constants'),
        calendar = require('./src/calendars'),
        astrometry = require('./src/astrometry'),
        fundamentalArguments = require('./src/fundamental-arguments'),
        ephemerides = require('./src/ephemerides'),
        precessionNutation = require('./src/precession-nutation'),
        rotationTime = require('./src/rotationTime'),
        spaceMotion = require('./src/space-motion'),
        starCatalogs = require('./src/star-catalogs'),
        galacticCoordinates =require('./src/galactic-coordinates'),
        geodeticGeocentric = require('./src/geodetic-geocentric'),
        timescales = require('./src/timescales'),
        angleOperations = require('./src/angle-operations'),
        vectorBuildRotations = require('./src/vector-build-rotations'),
        vectorCopyExtendExtract = require('./src/vector-copy-extend-extract'),
        vectorInitialisation = require('./src/vector-initialisation'),
        vectorRotation = require('./src/vector-rotations'),
        sphericalCartesian = require('./src/spherical-cartesian'),
        vectorOperations = require('./src/vector-operations'),
        ASTROM = require('./src/astrom'),
        LDBODY = require('./src/ldbody'),
        _ = require('lodash');


    var erfa = {
        _Module : LIBERFA,
        ASTROM : ASTROM,
        LDBODY: LDBODY,
        CONSTANTS: CONSTANTS
    };

    module.exports = _.assign(erfa,
      calendar, astrometry, ephemerides, fundamentalArguments,
      precessionNutation, rotationTime, spaceMotion, starCatalogs,
      galacticCoordinates, geodeticGeocentric, timescales, angleOperations, vectorBuildRotations,
      vectorCopyExtendExtract, vectorInitialisation, vectorRotation, sphericalCartesian, vectorOperations
    );


})();