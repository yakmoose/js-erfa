/**
 * Created by john on 4/10/15.
 */
"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Copy extend extract', function () {

    describe("#cp()", function () {
        it('Should Copy a p-vector.', function () {

            var p = [0.3, 1.2, -2.5];

            var c = erfa.cp(p);

            (c[0]).should.be.equal(0.3);
            (c[1]).should.be.equal(1.2);
            (c[2]).should.be.equal(-2.5);

        });
    });

    describe("#cpv", function (){
        it("Should copy a position/velocity vector.", function (){

            var pv = [
                [0.3, 1.2, -2.5],
                [-0.5, 3.1, 0.9]
            ];

            var ret = erfa.cpv(pv);

            (ret[0][0]).should.be.closeTo(0.3, 0.0);
            (ret[0][1]).should.be.closeTo(1.2, 0.0);
            (ret[0][2]).should.be.closeTo(-2.5, 0.0);

            (ret[1][0]).should.be.closeTo(-0.5, 0.0);
            (ret[1][1]).should.be.closeTo(3.1, 0.0);
            (ret[1][2]).should.be.closeTo(0.9, 0.0);
        });
    });

    describe("#cpr", function (){
        it("Should copy a position/velocity vector.", function (){

            var pv = [
                [2.0, 3.0, 2.0],
                [3.0, 2.0, 3.0],
                [3.0, 4.0, 5.0]
            ];

            var ret = erfa.cpv(pv);

            (ret[0][0]).should.be.closeTo(2.0, 0.0);
            (ret[0][1]).should.be.closeTo(3.0, 0.0);
            (ret[0][2]).should.be.closeTo(2.0, 0.0);

            (ret[1][0]).should.be.closeTo(3.0, 0.0);
            (ret[1][1]).should.be.closeTo(2.0, 0.0);
            (ret[1][2]).should.be.closeTo(3.0, 0.0);

            (ret[2][0]).should.be.closeTo(3.0, 0.0);
            (ret[2][1]).should.be.closeTo(4.0, 0.0);
            (ret[2][2]).should.be.closeTo(5.0, 0.0);
        });
    });

    describe("#p2pv", function (){
        it("Should extend a p-vector to a pv-vector by appending a zero velocity.", function (){

            var pv = [0.25, 1.2, 3.0];

            var ret = erfa.p2pv(pv);

            (ret[0][0]).should.be.closeTo(0.25, 0.0);
            (ret[0][1]).should.be.closeTo(1.2, 0.0);
            (ret[0][2]).should.be.closeTo(3.0, 0.0);

            (ret[1][0]).should.be.closeTo(0.0, 0.0);
            (ret[1][1]).should.be.closeTo(0.0, 0.0);
            (ret[1][2]).should.be.closeTo(0.0, 0.0);

        });
    });


    describe("#p2pv", function (){
        it("Should discard velocity component of a pv-vector.", function (){

            var pv = [
                    [0.3, 1.2, -2.5],
                    [-0.5, 3.1, 0.9]
                ];

            var ret = erfa.pv2p(pv);

            (ret[0]).should.be.closeTo(0.3, 0.0);
            (ret[1]).should.be.closeTo(1.2, 0.0);
            (ret[2]).should.be.closeTo(-2.5, 0.0);
            
        });
    });
});