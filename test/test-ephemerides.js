"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Ephemerides', function () {

    describe("#epv00()", function () {
        it('Should return Earth position and velocity, heliocentric and barycentric, with ' +
            'respect to the Barycentric Celestial Reference System', function () {


            var epv00 = erfa.epv00(2400000.5, 53411.52501161);

            (epv00.pvh[0][0]).should.be.closeTo(-0.7757238809297706813, 1e-14);
            (epv00.pvh[0][1]).should.be.closeTo(0.5598052241363340596, 1e-14);
            (epv00.pvh[0][2]).should.be.closeTo(0.2426998466481686993, 1e-14);

            (epv00.pvh[1][0]).should.be.closeTo(-0.1091891824147313846e-1, 1e-15);
            (epv00.pvh[1][1]).should.be.closeTo(-0.1247187268440845008e-1, 1e-15);
            (epv00.pvh[1][2]).should.be.closeTo(-0.5407569418065039061e-2, 1e-15);

            (epv00.pvb[0][0]).should.be.closeTo(-0.7714104440491111971, 1e-14);
            (epv00.pvb[0][1]).should.be.closeTo(0.5598412061824171323, 1e-14);
            (epv00.pvb[0][2]).should.be.closeTo(0.2425996277722452400, 1e-14);

            (epv00.pvb[1][0]).should.be.closeTo(-0.1091874268116823295e-1, 1e-15);
            (epv00.pvb[1][1]).should.be.closeTo(-0.1246525461732861538e-1, 1e-15);
            (epv00.pvb[1][2]).should.be.closeTo(-0.5404773180966231279e-2, 1e-15);

            (epv00.status).should.equal(0);

        });
    });

    describe("#plan94()", function () {
        it('It should return an approximate heliocentric position and velocity of a nominated major planet', function () {

            var plan94;

            plan94 = erfa.plan94(2400000.5, 1e6, 0);
            (plan94.x).should.be.closeTo(0, 0);
            (plan94.y).should.be.closeTo(0, 0);
            (plan94.z).should.be.closeTo(0, 0);
            (plan94.vx).should.be.closeTo(0, 0);
            (plan94.vy).should.be.closeTo(0, 0);
            (plan94.vz).should.be.closeTo(0, 0);
            (plan94.status).should.equal(-1);

            plan94 = erfa.plan94(2400000.5, 1e6, 10);
            (plan94.status).should.equal(-1);

            plan94 = erfa.plan94(2400000.5, -320000, 3);
            (plan94.x).should.be.closeTo(0.9308038666832975759, 1e-11);
            (plan94.y).should.be.closeTo(0.3258319040261346000, 1e-11);
            (plan94.z).should.be.closeTo(0.1422794544481140560, 1e-11);
            (plan94.vx).should.be.closeTo(-0.6429458958255170006e-2, 1e-11);
            (plan94.vy).should.be.closeTo(0.1468570657704237764e-1, 1e-11);
            (plan94.vz).should.be.closeTo(0.6406996426270981189e-2, 1e-11);
            (plan94.status).should.equal(1);

            plan94 = erfa.plan94(2400000.5, 43999.9, 1);
            (plan94.x).should.be.closeTo(0.2945293959257430832, 1e-11);
            (plan94.y).should.be.closeTo(-0.2452204176601049596, 1e-11);
            (plan94.z).should.be.closeTo(-0.1615427700571978153, 1e-11);
            (plan94.vx).should.be.closeTo(0.1413867871404614441e-1, 1e-11);
            (plan94.vy).should.be.closeTo(0.1946548301104706582e-1, 1e-11);
            (plan94.vz).should.be.closeTo(0.8929809783898904786e-2, 1e-11);
            (plan94.status).should.equal(0);

        });
    });

});