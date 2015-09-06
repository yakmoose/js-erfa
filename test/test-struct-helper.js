"use strict";

var chai = require('chai'),
    should = chai.should(),
    SH = require('../lib/struct-helper');

describe('Struct helpers', function () {

    describe("#flattenVector()", function () {
        it("should return what it gets if it's not an array", function () {
            (SH.flattenVector({})).should.deep.equal({});
        });

        it ("should get itself back if we pass in a flat array", function (){
            (SH.flattenVector([1,2,3])).should.deep.equal([1,2,3]);
        });

        it ("should a flattened array back if we pass in simple 2d array", function (){
            (SH.flattenVector([[1,2,3],[3,4,5],[7,8,9]])).should.deep.equal([1,2,3,3,4,5,7,8,9]);
        });
    });

});