/**
 * Created by john on 4/10/15.
 */
"use strict";

var chai = require('chai'),
    should = chai.should(),
    erfa = require('../index');

describe('Astrometry', function () {

    describe("#ab()", function () {
        it('Should apply aberration to transform natural direction into proper direction.', function () {

            var pnat = [
                  -0.76321968546737951,
                  -0.60869453983060384,
                  -0.21676408580639883
              ],
              v = [
                  2.1044018893653786e-5,
                  -8.9108923304429319e-5,
                  -3.8633714797716569e-5
              ],
              s = 0.99980921395708788,
              bm1 = 0.99999999506209258;

            var ppr = erfa.ab(pnat, v, s, bm1);

            (ppr[0]).should.be.closeTo(-0.7631631094219556269, 1e-12);
            (ppr[1]).should.be.closeTo(-0.6087553082505590832, 1e-12);
            (ppr[2]).should.be.closeTo(-0.2167926269368471279, 1e-12);


        });
    });

    describe("#apcg()", function () {
        it('Should prepare star-independent astrometry parameters for transformations ' +
          'between ICRS and GCRS coordinates', function () {

            var date1 = 2456165.5,
              date2 = 0.401182685,
              ebpv = [[0.901310875, -0.417402664, -0.180982288], [0.00742727954, 0.0140507459, 0.00609045792]],
              ehp = [0.903358544, -0.415395237, -0.180084014];


            var astrom = erfa.apcg(date1, date2, ebpv, ehp);

            (astrom.pmt).should.be.closeTo(12.65133794027378508, 1e-11);
            (astrom.eb[0]).should.be.closeTo(0.901310875, 1e-12);
            (astrom.eb[1]).should.be.closeTo(-0.417402664, 1e-12);
            (astrom.eb[2]).should.be.closeTo(-0.180982288, 1e-12);
            (astrom.eh[0]).should.be.closeTo(0.8940025429324143045, 1e-12);
            (astrom.eh[1]).should.be.closeTo(-0.4110930268679817955, 1e-12);
            (astrom.eh[2]).should.be.closeTo(-0.1782189004872870264, 1e-12);
            (astrom.em).should.be.closeTo(1.010465295811013146, 1e-12);
            (astrom.v[0]).should.be.closeTo(0.4289638897813379954e-4, 1e-16);
            (astrom.v[1]).should.be.closeTo(0.8115034021720941898e-4, 1e-16);
            (astrom.v[2]).should.be.closeTo(0.3517555123437237778e-4, 1e-16);
            (astrom.bm1).should.be.closeTo(0.9999999951686013336, 1e-12);
            (astrom.bpn[0][0]).should.be.closeTo(1.0, 0.0);
            (astrom.bpn[1][0]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[2][0]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[0][1]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[1][1]).should.be.closeTo(1.0, 0.0);
            (astrom.bpn[2][1]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[0][2]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[1][2]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[2][2]).should.be.closeTo(1.0, 0.0);

        });
    });

    describe('#apcg13()', function () {
        it('Should prepare star-independent astrometry parameters for transformations ' +
          'between ICRS and GCRS coordinates', function () {

            var date1 = 2456165.5,
              date2 = 0.401182685;

            var astrom = erfa.apcg13(date1, date2);

            (astrom.pmt).should.be.closeTo(12.65133794027378508, 1e-11);
            (astrom.eb[0]).should.be.closeTo(0.9013108747340644755, 1e-12);
            (astrom.eb[1]).should.be.closeTo(-0.4174026640406119957, 1e-12);
            (astrom.eb[2]).should.be.closeTo(-0.1809822877867817771, 1e-12);
            (astrom.eh[0]).should.be.closeTo(0.8940025429255499549, 1e-12);
            (astrom.eh[1]).should.be.closeTo(-0.4110930268331896318, 1e-12);
            (astrom.eh[2]).should.be.closeTo(-0.1782189006019749850, 1e-12);
            (astrom.em).should.be.closeTo(1.010465295964664178, 1e-12);
            (astrom.v[0]).should.be.closeTo(0.4289638897157027528e-4, 1e-16);
            (astrom.v[1]).should.be.closeTo(0.8115034002544663526e-4, 1e-16);
            (astrom.v[2]).should.be.closeTo(0.3517555122593144633e-4, 1e-16);
            (astrom.bm1).should.be.closeTo(0.9999999951686013498, 1e-12);
            (astrom.bpn[0][0]).should.be.closeTo(1.0, 0.0);
            (astrom.bpn[1][0]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[2][0]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[0][1]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[1][1]).should.be.closeTo(1.0, 0.0);
            (astrom.bpn[2][1]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[0][2]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[1][2]).should.be.closeTo(0.0, 0.0);
            (astrom.bpn[2][2]).should.be.closeTo(1.0, 0.0);

        });
    });

    describe('#apci()', function () {
        it('It should prepare star-independent astrometry parameters for transformations ' +
          'between ICRS and geocentric CIRS coordinates', function () {

            var date1 = 2456165.5,
              date2 = 0.401182685,
              ebpv = [[0.901310875, -0.417402664, -0.180982288],
                  [0.00742727954, 0.0140507459, 0.00609045792]],
              ehp = [0.903358544, -0.415395237, -0.180084014],

              x = 0.0013122272,
              y = -2.92808623e-5,
              s = 3.05749468e-8;

            var astrom = erfa.apci(date1, date2, ebpv, ehp, x, y, s);

            (astrom.pmt).should.be.closeTo(12.65133794027378508, 1e-11);
            (astrom.eb[0]).should.be.closeTo(0.901310875, 1e-12);
            (astrom.eb[1]).should.be.closeTo(-0.417402664, 1e-12);
            (astrom.eb[2]).should.be.closeTo(-0.180982288, 1e-12);
            (astrom.eh[0]).should.be.closeTo(0.8940025429324143045, 1e-12);
            (astrom.eh[1]).should.be.closeTo(-0.4110930268679817955, 1e-12);
            (astrom.eh[2]).should.be.closeTo(-0.1782189004872870264, 1e-12);
            (astrom.em).should.be.closeTo(1.010465295811013146, 1e-12);
            (astrom.v[0]).should.be.closeTo(0.4289638897813379954e-4, 1e-16);
            (astrom.v[1]).should.be.closeTo(0.8115034021720941898e-4, 1e-16);
            (astrom.v[2]).should.be.closeTo(0.3517555123437237778e-4, 1e-16);
            (astrom.bm1).should.be.closeTo(0.9999999951686013336, 1e-12);
            (astrom.bpn[0][0]).should.be.closeTo(0.9999991390295159156, 1e-12);
            (astrom.bpn[1][0]).should.be.closeTo(0.4978650072505016932e-7, 1e-12);
            (astrom.bpn[2][0]).should.be.closeTo(0.1312227200000000000e-2, 1e-12);
            (astrom.bpn[0][1]).should.be.closeTo(-0.1136336653771609630e-7, 1e-12);
            (astrom.bpn[1][1]).should.be.closeTo(0.9999999995713154868, 1e-12);
            (astrom.bpn[2][1]).should.be.closeTo(-0.2928086230000000000e-4, 1e-12);
            (astrom.bpn[0][2]).should.be.closeTo(-0.1312227200895260194e-2, 1e-12);
            (astrom.bpn[1][2]).should.be.closeTo(0.2928082217872315680e-4, 1e-12);
            (astrom.bpn[2][2]).should.be.closeTo(0.9999991386008323373, 1e-12);
        });
    });

    describe('#apci13()', function () {
        it('For a geocentric observer, prepare star-independent astrometry' +
          'parameters for transformations between ICRS and GCRS coordinates.', function () {

            var date1 = 2456165.5,
            date2 = 0.401182685;

            var ret = erfa.apci13(date1, date2);

            (ret.astrom.pmt, 12.65133794027378508, 1e-11);
            (ret.astrom.eb[0], 0.9013108747340644755, 1e-12);
            (ret.astrom.eb[1], -0.4174026640406119957, 1e-12);
            (ret.astrom.eb[2], -0.1809822877867817771, 1e-12);
            (ret.astrom.eh[0], 0.8940025429255499549, 1e-12);
            (ret.astrom.eh[1], -0.4110930268331896318, 1e-12);
            (ret.astrom.eh[2], -0.1782189006019749850, 1e-12);
            (ret.astrom.em, 1.010465295964664178, 1e-12);
            (ret.astrom.v[0], 0.4289638897157027528e-4, 1e-16);
            (ret.astrom.v[1], 0.8115034002544663526e-4, 1e-16);
            (ret.astrom.v[2], 0.3517555122593144633e-4, 1e-16);
            (ret.astrom.bm1, 0.9999999951686013498, 1e-12);
            (ret.astrom.bpn[0][0], 0.9999992060376761710, 1e-12);
            (ret.astrom.bpn[1][0], 0.4124244860106037157e-7, 1e-12);
            (ret.astrom.bpn[2][0], 0.1260128571051709670e-2, 1e-12);
            (ret.astrom.bpn[0][1], -0.1282291987222130690e-7, 1e-12);
            (ret.astrom.bpn[1][1], 0.9999999997456835325, 1e-12);
            (ret.astrom.bpn[2][1], -0.2255288829420524935e-4, 1e-12);
            (ret.astrom.bpn[0][2], -0.1260128571661374559e-2, 1e-12);
            (ret.astrom.bpn[1][2], 0.2255285422953395494e-4, 1e-12);
            (ret.astrom.bpn[2][2], 0.9999992057833604343, 1e-12);
            (ret.eo, -0.2900618712657375647e-2, 1e-12);

        });
    });


    describe('#apco()', function (){
       it('For a terrestrial observer, prepare star-independent astrometry' +
         'parameters for transformations between ICRS and observedcoordinates', function () {

           var date1 = 2456384.5,
                date2 = 0.970031644,
                ebpv = [
                        [-0.974170438, -0.211520082, -0.0917583024],
                        [0.00364365824, -0.0154287319, -0.00668922024]
                ],
           ehp = [ -0.973458265, -0.209215307, -0.0906996477],
           x = 0.0013122272,
           y = -2.92808623e-5,
           s = 3.05749468e-8,
           theta = 3.14540971,
           elong = -0.527800806,
           phi = -1.2345856,
           hm = 2738.0,
           xp = 2.47230737e-7,
           yp = 1.82640464e-6,
           sp = -3.01974337e-11,
           refa = 0.000201418779,
           refb = -2.36140831e-7;

           var astrom = erfa.apco(date1, date2, ebpv, ehp, x, y, s, theta, elong, phi, hm, xp, yp, sp, refa, refb);

           (astrom.pmt).should.be.closeTo(13.25248468622587269, 1e-11);
           (astrom.eb[0]).should.be.closeTo(-0.9741827110630897003, 1e-12);
           (astrom.eb[1]).should.be.closeTo(-0.2115130190135014340, 1e-12);
           (astrom.eb[2]).should.be.closeTo(-0.09179840186968295686, 1e-12);
           (astrom.eh[0]).should.be.closeTo(-0.9736425571689670428, 1e-12);
           (astrom.eh[1]).should.be.closeTo(-0.2092452125848862201, 1e-12);
           (astrom.eh[2]).should.be.closeTo(-0.09075578152261439954, 1e-12);
           (astrom.em).should.be.closeTo(0.9998233241710617934, 1e-12);
           (astrom.v[0]).should.be.closeTo(0.2078704985147609823e-4, 1e-16);
           (astrom.v[1]).should.be.closeTo(-0.8955360074407552709e-4, 1e-16);
           (astrom.v[2]).should.be.closeTo(-0.3863338980073114703e-4, 1e-16);
           (astrom.bm1).should.be.closeTo(0.9999999950277561600, 1e-12);
           (astrom.bpn[0][0]).should.be.closeTo(0.9999991390295159156, 1e-12);
           (astrom.bpn[1][0]).should.be.closeTo(0.4978650072505016932e-7, 1e-12);
           (astrom.bpn[2][0]).should.be.closeTo(0.1312227200000000000e-2, 1e-12);
           (astrom.bpn[0][1]).should.be.closeTo(-0.1136336653771609630e-7, 1e-12);
           (astrom.bpn[1][1]).should.be.closeTo(0.9999999995713154868, 1e-12);
           (astrom.bpn[2][1]).should.be.closeTo(-0.2928086230000000000e-4, 1e-12);
           (astrom.bpn[0][2]).should.be.closeTo(-0.1312227200895260194e-2, 1e-12);
           (astrom.bpn[1][2]).should.be.closeTo(0.2928082217872315680e-4, 1e-12);
           (astrom.bpn[2][2]).should.be.closeTo(0.9999991386008323373, 1e-12);
           (astrom.along).should.be.closeTo(-0.5278008060301974337, 1e-12);
           (astrom.xpl).should.be.closeTo(0.1133427418174939329e-5, 1e-17);
           (astrom.ypl).should.be.closeTo(0.1453347595745898629e-5, 1e-17);
           (astrom.sphi).should.be.closeTo(-0.9440115679003211329, 1e-12);
           (astrom.cphi).should.be.closeTo(0.3299123514971474711, 1e-12);
           (astrom.diurab).should.be.closeTo(0, 0);
           (astrom.eral).should.be.closeTo(2.617608903969802566, 1e-12);
           (astrom.refa).should.be.closeTo(0.2014187790000000000e-3, 1e-15);
           (astrom.refb).should.be.closeTo(-0.2361408310000000000e-6, 1e-18);



       });
    });
});