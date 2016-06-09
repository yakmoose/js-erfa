"use strict";

var chai = require('chai'),
    should = chai.should(),
    SH = require('../src/struct-helper');

describe('Struct helpers', function () {

    describe("#flattenVector()", function () {
        it("should return what it gets if it's not an array", function () {
            (SH.flattenVector({})).should.deep.equal({});
        });

        it ("should get itself back if we pass in a flat array", function (){
            (SH.flattenVector([1,2,3])).should.deep.equal([1,2,3]);
        });

        it ("should a flattened array back if we pass in simple 2d array", function (){
            (SH.flattenVector([[1,2,3],[4,5,6],[7,8,9]])).should.deep.equal([1,2,3,4,5,6,7,8,9]);
        });
    });

    describe("#chunkArray()", function () {

        it("should return what it gets if it's not an array", function () {
            (SH.chunkArray({},1)).should.deep.equal({});
        });

        it ("we should get an empty array if the chunk size is 0", function (){
            (SH.chunkArray([1,2,3], 0)).should.deep.equal([]);
            [1,2,3].chunk(0).should.deep.equal([]);
        });

        it ("we should get an array of n chunks", function (){
            (SH.chunkArray([1,2,3], 1)).should.deep.equal([[1],[2],[3]]);
            [1,2,3].chunk(1).should.deep.equal([[1],[2],[3]]);

            (SH.chunkArray([1,2,3,4,5,6,7,8,9], 3)).should.deep.equal([[1,2,3],[4,5,6],[7,8,9]]);
            [1,2,3,4,5,6,7,8,9].chunk(3).should.deep.equal([[1,2,3],[4,5,6],[7,8,9]]);
        });

        it ("we should get an array of n chunks, this time we have an overlap", function (){
            (SH.chunkArray([1,2,3,4,5,6,7,8,9], 4)).should.deep.equal([[1,2,3,4] ,[5,6,7,8],[9]]);
            [1,2,3,4,5,6,7,8,9].chunk(4).should.deep.equal([[1,2,3,4] ,[5,6,7,8],[9]]);

        });

    });

});