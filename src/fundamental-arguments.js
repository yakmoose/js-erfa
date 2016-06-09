(function () {
  "use strict";

  var LIBERFA = require('../lib/liberfa');

  module.exports = {
    //Fundamental arguments
    /** double eraFal03(double t); */
    fal03: LIBERFA.cwrap('eraFal03', 'number', ['number']),
    /** double eraFalp03(double t); */
    falp03: LIBERFA.cwrap('eraFalp03', 'number', ['number']),
    /** double eraFaf03(double t); */
    faf03: LIBERFA.cwrap('eraFaf03', 'number', ['number']),
    /** double eraFad03(double t); */
    fad03: LIBERFA.cwrap('eraFad03', 'number', ['number']),
    /** double eraFaom03(double t); */
    faom03: LIBERFA.cwrap('eraFaom03', 'number', ['number']),
    /** double eraFave03(double t); */
    fave03: LIBERFA.cwrap('eraFave03', 'number', ['number']),
    /** double eraFae03(double t); */
    fae03: LIBERFA.cwrap('eraFae03', 'number', ['number']),
    /** double eraFapa03(double t); */
    fapa03: LIBERFA.cwrap('eraFapa03', 'number', ['number']),
    /** double eraFame03(double t); */
    fame03: LIBERFA.cwrap('eraFame03', 'number', ['number']),
    /** double eraFama03(double t); */
    fama03: LIBERFA.cwrap('eraFama03', 'number', ['number']),
    /** double eraFaju03(double t); */
    faju03: LIBERFA.cwrap('eraFaju03', 'number', ['number']),
    /** double eraFasa03(double t); */
    fasa03: LIBERFA.cwrap('eraFasa03', 'number', ['number']),
    /** double eraFaur03(double t); */
    faur03: LIBERFA.cwrap('eraFaur03', 'number', ['number']),
    /** double eraFane03(double t); */
    fane03: LIBERFA.cwrap('eraFane03', 'number', ['number']),
  }

})();