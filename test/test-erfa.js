/**
 * Created by john on 4/10/15.
 */
"use strict";

var chai = require('chai'),
  should = chai.should(),
  erfa = require('../index'),
  LIBERFA = require('../lib/liberfa');

describe('Exports have functions', function () {

  var erfaExports = Object.getOwnPropertyNames(LIBERFA).filter(function (prop) {
    return /^_era/.test(prop);
  });

  erfaExports.forEach(function (erfaExport) {
    describe("#" + erfaExport +"()", function () {
      var name = erfaExport.replace(/^_era/,'').toLocaleLowerCase();

      it (erfaExport + ' should have property ' + name, function (){
        (erfa).should.have.ownProperty(name);
      });

      it(name + ' should be a function', function (){
        (erfa[name]).should.be.a('function');
      });

    });
  });

});
