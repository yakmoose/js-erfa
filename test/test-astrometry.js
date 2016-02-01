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


  describe('#apco()', function () {
    it('For a terrestrial observer, prepare star-independent astrometry' +
      'parameters for transformations between ICRS and observedcoordinates', function () {

      var date1 = 2456384.5,
        date2 = 0.970031644,
        ebpv = [
          [-0.974170438, -0.211520082, -0.0917583024],
          [0.00364365824, -0.0154287319, -0.00668922024]
        ],
        ehp = [-0.973458265, -0.209215307, -0.0906996477],
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

  describe('#apco13()', function () {
    it('Should For a terrestrial observer, prepare star-independent astrometry' +
      ' parameters for transformations between ICRS and observed coordinates', function () {

      var utc1 = 2456384.5,
        utc2 = 0.969254051,
        dut1 = 0.1550675,
        elong = -0.527800806,
        phi = -1.2345856,
        hm = 2738.0,
        xp = 2.47230737e-7,
        yp = 1.82640464e-6,
        phpa = 731.0,
        tc = 12.8,
        rh = 0.59,
        wl = 0.55;

      var ret = erfa.apco13(utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);

      (ret.astrom.pmt).should.be.closeTo(13.25248468622475727, 1e-11);
      (ret.astrom.eb[0]).should.be.closeTo(-0.9741827107321449445, 1e-12);
      (ret.astrom.eb[1]).should.be.closeTo(-0.2115130190489386190, 1e-12);
      (ret.astrom.eb[2]).should.be.closeTo(-0.09179840189515518726, 1e-12);
      (ret.astrom.eh[0]).should.be.closeTo(-0.9736425572586866640, 1e-12);
      (ret.astrom.eh[1]).should.be.closeTo(-0.2092452121602867431, 1e-12);
      (ret.astrom.eh[2]).should.be.closeTo(-0.09075578153903832650, 1e-12);
      (ret.astrom.em).should.be.closeTo(0.9998233240914558422, 1e-12);
      (ret.astrom.v[0]).should.be.closeTo(0.2078704986751370303e-4, 1e-16);
      (ret.astrom.v[1]).should.be.closeTo(-0.8955360100494469232e-4, 1e-16);
      (ret.astrom.v[2]).should.be.closeTo(-0.3863338978840051024e-4, 1e-16);
      (ret.astrom.bm1).should.be.closeTo(0.9999999950277561368, 1e-12);
      (ret.astrom.bpn[0][0]).should.be.closeTo(0.9999991390295147999, 1e-12);
      (ret.astrom.bpn[1][0]).should.be.closeTo(0.4978650075315529277e-7, 1e-12);
      (ret.astrom.bpn[2][0]).should.be.closeTo(0.001312227200850293372, 1e-12);
      (ret.astrom.bpn[0][1]).should.be.closeTo(-0.1136336652812486604e-7, 1e-12);
      (ret.astrom.bpn[1][1]).should.be.closeTo(0.9999999995713154865, 1e-12);
      (ret.astrom.bpn[2][1]).should.be.closeTo(-0.2928086230975367296e-4, 1e-12);
      (ret.astrom.bpn[0][2]).should.be.closeTo(-0.001312227201745553566, 1e-12);
      (ret.astrom.bpn[1][2]).should.be.closeTo(0.2928082218847679162e-4, 1e-12);
      (ret.astrom.bpn[2][2]).should.be.closeTo(0.9999991386008312212, 1e-12);
      (ret.astrom.along).should.be.closeTo(-0.5278008060301974337, 1e-12);
      (ret.astrom.xpl).should.be.closeTo(0.1133427418174939329e-5, 1e-17);
      (ret.astrom.ypl).should.be.closeTo(0.1453347595745898629e-5, 1e-17);
      (ret.astrom.sphi).should.be.closeTo(-0.9440115679003211329, 1e-12);
      (ret.astrom.cphi).should.be.closeTo(0.3299123514971474711, 1e-12);
      (ret.astrom.diurab).should.be.closeTo(0, 0);
      (ret.astrom.eral).should.be.closeTo(2.617608909189066140, 1e-12);
      (ret.astrom.refa).should.be.closeTo(0.2014187785940396921e-3, 1e-15);
      (ret.astrom.refb).should.be.closeTo(-0.2361408314943696227e-6, 1e-18);
      (ret.eo).should.be.closeTo(-0.003020548354802412839, 1e-14);
      (ret.status).should.equal(0);

    });
  });

  describe('#apcs', function () {
    it('Should For an observer whose geocentric position and velocity are known,' +
      ' prepare star-independent astrometry parameters for transformations between ICRS and GCRS', function () {

      var date1 = 2456384.5,
        date2 = 0.970031644,
        pv = [
          [-1836024.09, 1056607.72, -5998795.26],
          [-77.0361767, -133.310856, 0.0971855934]
        ],
        ebpv = [
          [-0.974170438, -0.211520082, -0.0917583024],
          [0.00364365824, -0.0154287319, -0.00668922024]
        ],
        ehp = [-0.973458265, -0.209215307, -0.0906996477];

      var astrom = erfa.apcs(date1, date2, pv, ebpv, ehp);

      (astrom.pmt).should.be.closeTo(13.25248468622587269, 1e-11);
      (astrom.eb[0]).should.be.closeTo(-0.9741827110630456169, 1e-12);
      (astrom.eb[1]).should.be.closeTo(-0.2115130190136085494, 1e-12);
      (astrom.eb[2]).should.be.closeTo(-0.09179840186973175487, 1e-12);
      (astrom.eh[0]).should.be.closeTo(-0.9736425571689386099, 1e-12);
      (astrom.eh[1]).should.be.closeTo(-0.2092452125849967195, 1e-12);
      (astrom.eh[2]).should.be.closeTo(-0.09075578152266466572, 1e-12);
      (astrom.em).should.be.closeTo(0.9998233241710457140, 1e-12);
      (astrom.v[0]).should.be.closeTo(0.2078704985513566571e-4, 1e-16);
      (astrom.v[1]).should.be.closeTo(-0.8955360074245006073e-4, 1e-16);
      (astrom.v[2]).should.be.closeTo(-0.3863338980073572719e-4, 1e-16);
      (astrom.bm1).should.be.closeTo(0.9999999950277561601, 1e-12);
      (astrom.bpn[0][0]).should.be.closeTo(1, 0);
      (astrom.bpn[1][0]).should.be.closeTo(0, 0);
      (astrom.bpn[2][0]).should.be.closeTo(0, 0);
      (astrom.bpn[0][1]).should.be.closeTo(0, 0);
      (astrom.bpn[1][1]).should.be.closeTo(1, 0);
      (astrom.bpn[2][1]).should.be.closeTo(0, 0);
      (astrom.bpn[0][2]).should.be.closeTo(0, 0);
      (astrom.bpn[1][2]).should.be.closeTo(0, 0);
      (astrom.bpn[2][2]).should.be.closeTo(1, 0);

    });
  });

  describe('#apcs13()', function () {
    it('Should  For an observer whose geocentric position and velocity are known,' +
      'prepare star-independent astrometry parameters for transformations between ICRS and GCRS', function () {

      var date1 = 2456165.5,
        date2 = 0.401182685,
        pv = [
          [-6241497.16, 401346.896, -1251136.04],
          [-29.264597, -455.021831, 0.0266151194]
        ];

      var astrom = erfa.apcs13(date1, date2, pv);

      (astrom.pmt).should.be.closeTo(12.65133794027378508, 1e-11);
      (astrom.eb[0]).should.be.closeTo(0.9012691529023298391, 1e-12);
      (astrom.eb[1]).should.be.closeTo(-0.4173999812023068781, 1e-12);
      (astrom.eb[2]).should.be.closeTo(-0.1809906511146821008, 1e-12);
      (astrom.eh[0]).should.be.closeTo(0.8939939101759726824, 1e-12);
      (astrom.eh[1]).should.be.closeTo(-0.4111053891734599955, 1e-12);
      (astrom.eh[2]).should.be.closeTo(-0.1782336880637689334, 1e-12);
      (astrom.em).should.be.closeTo(1.010428384373318379, 1e-12);
      (astrom.v[0]).should.be.closeTo(0.4279877278327626511e-4, 1e-16);
      (astrom.v[1]).should.be.closeTo(0.7963255057040027770e-4, 1e-16);
      (astrom.v[2]).should.be.closeTo(0.3517564000441374759e-4, 1e-16);
      (astrom.bm1).should.be.closeTo(0.9999999952947981330, 1e-12);
      (astrom.bpn[0][0]).should.be.closeTo(1, 0);
      (astrom.bpn[1][0]).should.be.closeTo(0, 0);
      (astrom.bpn[2][0]).should.be.closeTo(0, 0);
      (astrom.bpn[0][1]).should.be.closeTo(0, 0);
      (astrom.bpn[1][1]).should.be.closeTo(1, 0);
      (astrom.bpn[2][1]).should.be.closeTo(0, 0);
      (astrom.bpn[0][2]).should.be.closeTo(0, 0);
      (astrom.bpn[1][2]).should.be.closeTo(0, 0);
      (astrom.bpn[2][2]).should.be.closeTo(1, 0);

    });
  });


  describe('#aper()', function () {
    it('Should ', function () {
      var astrom = new erfa.ASTROM(),
        theta = 5.678;

      astrom.along = 1.234;

      var ret = erfa.aper(theta, astrom);

      (ret.eral).should.be.closeTo(6.912000000000000000, 1e-12);

    });
  });


  describe('#aper13()', function () {
    it('Should ', function () {
      var astrom = new erfa.ASTROM(),
        ut11 = 2456165.5,
        ut12 = 0.401182685;

      astrom.along = 1.234;

      var ret = erfa.aper13(ut11, ut12, astrom);

      (ret.eral).should.be.closeTo(3.316236661789694933, 1e-12);

    });
  });

  describe('#apio()', function () {
    it('Should, For a terrestrial observer, prepare star-independent astrometry' +
      'parameters for transformations between CIRS and observed coordinates', function () {

      var sp = -3.01974337e-11,
        theta = 3.14540971,
        elong = -0.527800806,
        phi = -1.2345856,
        hm = 2738.0,
        xp = 2.47230737e-7,
        yp = 1.82640464e-6,
        refa = 0.000201418779,
        refb = -2.36140831e-7;

      var astrom = erfa.apio(sp, theta, elong, phi, hm, xp, yp, refa, refb);

      (astrom.along).should.be.closeTo(-0.5278008060301974337, 1e-12);
      (astrom.xpl).should.be.closeTo(0.1133427418174939329e-5, 1e-17);
      (astrom.ypl).should.be.closeTo(0.1453347595745898629e-5, 1e-17);
      (astrom.sphi).should.be.closeTo(-0.9440115679003211329, 1e-12);
      (astrom.cphi).should.be.closeTo(0.3299123514971474711, 1e-12);
      (astrom.diurab).should.be.closeTo(0.5135843661699913529e-6, 1e-12);
      (astrom.eral).should.be.closeTo(2.617608903969802566, 1e-12);
      (astrom.refa).should.be.closeTo(0.2014187790000000000e-3, 1e-15);
      (astrom.refb).should.be.closeTo(-0.2361408310000000000e-6, 1e-18);

    });
  });

  describe('#apio13()', function () {
    it('Should For a terrestrial observer, prepare star-independent astrometry' +
      ' parameters for transformations between CIRS and observed coordinates', function () {

      var utc1 = 2456384.5,
        utc2 = 0.969254051,
        dut1 = 0.1550675,
        elong = -0.527800806,
        phi = -1.2345856,
        hm = 2738.0,
        xp = 2.47230737e-7,
        yp = 1.82640464e-6,
        phpa = 731.0,
        tc = 12.8,
        rh = 0.59,
        wl = 0.55;

      var ret = erfa.apio13(utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);

      (ret.astrom.along).should.be.closeTo(-0.5278008060301974337, 1e-12);
      (ret.astrom.xpl).should.be.closeTo(0.1133427418174939329e-5, 1e-17);
      (ret.astrom.ypl).should.be.closeTo(0.1453347595745898629e-5, 1e-17);
      (ret.astrom.sphi).should.be.closeTo(-0.9440115679003211329, 1e-12);
      (ret.astrom.cphi).should.be.closeTo(0.3299123514971474711, 1e-12);
      (ret.astrom.diurab).should.be.closeTo(0.5135843661699913529e-6, 1e-12);
      (ret.astrom.eral).should.be.closeTo(2.617608909189066140, 1e-12);
      (ret.astrom.refa).should.be.closeTo(0.2014187785940396921e-3, 1e-15);
      (ret.astrom.refb).should.be.closeTo(-0.2361408314943696227e-6, 1e-18);
      (ret.status).should.equal(0);


    });
  });

  describe('#atci13()', function () {
    it('Transform ICRS star data, epoch J2000.0, to CIRS', function () {
      var rc = 2.71,
        dc = 0.174,
        pr = 1e-5,
        pd = 5e-6,
        px = 0.1,
        rv = 55.0,
        date1 = 2456165.5,
        date2 = 0.401182685;

      var ret = erfa.atci13(rc, dc, pr, pd, px, rv, date1, date2);

      (ret.ri).should.be.closeTo(2.710121572969038991, 1e-12);
      (ret.di).should.be.closeTo(0.1729371367218230438, 1e-12);
      (ret.eo).should.be.closeTo(-0.002900618712657375647, 1e-14);

    });
  });

  describe('#atciq()', function () {
    it('Should do a quick ICRS, epoch J2000.0, to CIRS transformation, given precomputed' +
      'star-independent astrometry parameters', function () {

      var date1 = 2456165.5,
        date2 = 0.401182685;

      var ast = erfa.apci13(date1, date2);

      var rc = 2.71,
        dc = 0.174,
        pr = 1e-5,
        pd = 5e-6,
        px = 0.1,
        rv = 55.0;

      var ret = erfa.atciq(rc, dc, pr, pd, px, rv, ast.astrom);

      (ret.ri).should.be.closeTo(2.710121572969038991, 1e-12);
      (ret.di).should.be.closeTo(0.1729371367218230438, 1e-12);

    });
  });

  describe('#atciqn()', function () {
    it('Should do a Quick ICRS, epoch J2000.0, to CIRS transformation , given precomputed ' +
      'star-independent astrometry parameters plus a list of light- ' +
      'deflecting bodies', function () {

      var date1 = 2456165.5,
        date2 = 0.401182685;

      var apci13 = erfa.apci13(date1, date2);

      var rc = 2.71,
        dc = 0.174,
        pr = 1e-5,
        pd = 5e-6,
        px = 0.1,
        rv = 55.0;

      var b = [new erfa.LDBODY(), new erfa.LDBODY(), new erfa.LDBODY()];

      b[0].bm = 0.00028574;
      b[0].dl = 3e-10;
      b[0].pv = [
        [-7.81014427, -5.60956681, -1.98079819],
        [0.0030723249, -0.00406995477, -0.00181335842]
      ];

      b[1].bm = 0.00095435;
      b[1].dl = 3e-9;
      b[1].pv = [
        [0.738098796, 4.63658692, 1.9693136],
        [-0.00755816922, 0.00126913722, 0.000727999001]
      ];

      b[2].bm = 1.0;
      b[2].dl = 6e-6;
      b[2].pv = [
        [-0.000712174377, -0.00230478303, -0.00105865966],
        [6.29235213e-6, -3.30888387e-7, -2.96486623e-7]
      ];


      var ret = erfa.atciqn(rc, dc, pr, pd, px, rv, apci13.astrom, 3, b);

      (ret.ri).should.be.closeTo(2.710122008105325582, 1e-12);
      (ret.di).should.be.closeTo(0.1729371916491459122, 1e-12);


    });
  });

  describe('#atciqz()', function () {
    it('Quick ICRS to CIRS transformation, given precomputed star-independent astrometry ' +
      'parameters, and assuming zero parallax and proper motion', function () {

      var date1 = 2456165.5,
        date2 = 0.401182685,
        apci13 = erfa.apci13(date1, date2),
        rc = 2.71,
        dc = 0.174;

      var ret = erfa.atciqz(rc, dc, apci13.astrom);

      (ret.ri).should.be.closeTo(2.709994899247599271, 1e-12);
      (ret.di).should.be.closeTo(0.1728740720983623469, 1e-12);

    });
  });

  describe('#atco13()', function () {
    it('Should convert ICRS RA,Dec to observed place', function () {
      var rc = 2.71,
        dc = 0.174,
        pr = 1e-5,
        pd = 5e-6,
        px = 0.1,
        rv = 55.0,
        utc1 = 2456384.5,
        utc2 = 0.969254051,
        dut1 = 0.1550675,
        elong = -0.527800806,
        phi = -1.2345856,
        hm = 2738.0,
        xp = 2.47230737e-7,
        yp = 1.82640464e-6,
        phpa = 731.0,
        tc = 12.8,
        rh = 0.59,
        wl = 0.55;

      var ret = erfa.atco13(rc, dc, pr, pd, px, rv,
        utc1, utc2, dut1, elong, phi, hm, xp, yp,
        phpa, tc, rh, wl);

      (ret.aob).should.be.closeTo(0.09251774485358230653, 1e-12);
      (ret.zob).should.be.closeTo(1.407661405256767021, 1e-12);
      (ret.hob).should.be.closeTo(-0.09265154431403157925, 1e-12);
      (ret.dob).should.be.closeTo(0.1716626560075591655, 1e-12);
      (ret.rob).should.be.closeTo(2.710260453503097719, 1e-12);
      (ret.eo).should.be.closeTo(-0.003020548354802412839, 1e-14);
      (ret.status).should.equal(0);
    });
  });

  describe('#atic13()', function () {
    it('Should transform star RA,Dec from geocentric CIRS to ICRS astrometric.', function () {

      var ri = 2.710121572969038991,
          di = 0.1729371367218230438,
          date1 = 2456165.5,
          date2 = 0.401182685;

      var ret = erfa.atic13(ri, di, date1, date2);

      (ret.rc).should.be.closeTo(2.710126504531374930, 1e-12);
      (ret.dc).should.be.closeTo(0.1740632537628342320, 1e-12);
      (ret.eo).should.be.closeTo(-0.002900618712657375647, 1e-14);
      
    });
  });

  describe('#aticq13', function () {
    it('Should dp a quick CIRS RA,Dec to ICRS astrometric place conversion, given the star-independent ' +
      'astrometry parameters', function () {

      var date1 = 2456165.5,
          date2 = 0.401182685;

      var apci13 = erfa.apci13(date1, date2);

      var ri = 2.710121572969038991,
          di = 0.1729371367218230438;

      var ret = erfa.aticq(ri, di, apci13.astrom);

      (ret.rc).should.be.closeTo(2.710126504531374930, 1e-12);
      (ret.dc).should.be.closeTo(0.1740632537628342320, 1e-12);



    });
  });

  describe('#aticqn()', function () {
    it('should perform a quick CIRS to ICRS astrometric place transformation, ' +
      'given the star-independent astrometry parameters plus a list of ' +
      'light-deflecting bodies', function () {

      var date1 = 2456165.5,
          date2 = 0.401182685;

      var apci13 = erfa.apci13(date1, date2);

      var ri = 2.709994899247599271,
        di = 0.1728740720983623469;

      var b = [ new erfa.LDBODY(), new erfa.LDBODY(), new erfa.LDBODY()];

      b[0].bm = 0.00028574;
      b[0].dl = 3e-10;
      b[0].pv = [
        [-7.81014427, -5.60956681, -1.98079819],
        [0.0030723249, -0.00406995477, -0.00181335842]
      ];

      b[1].bm = 0.00095435;
      b[1].dl = 3e-9;
      b[1].pv = [
        [0.738098796, 4.63658692, 1.9693136],
        [-0.00755816922, 0.00126913722, 0.000727999001]
      ];

      b[2].bm = 1.0;
      b[2].dl = 6e-6;
      b[2].pv = [
        [-0.000712174377, -0.00230478303, -0.00105865966],
        [6.29235213e-6, -3.30888387e-7, -2.96486623e-7]
      ];

      var ret = erfa.aticqn(ri, di, apci13.astrom, 3, b);

      (ret.rc).should.be.closeTo(2.709999575032685412, 1e-12);
      (ret.dc).should.be.closeTo(0.1739999656317778034, 1e-12);

    });
  });

  describe('#atio13()', function () {
    it('Should convert CIRS RA,Dec to observed place', function () {

      var ri = 2.710121572969038991,
          di = 0.1729371367218230438,
          utc1 = 2456384.5,
          utc2 = 0.969254051,
          dut1 = 0.1550675,
          elong = -0.527800806,
          phi = -1.2345856,
          hm = 2738.0,
          xp = 2.47230737e-7,
          yp = 1.82640464e-6,
          phpa = 731.0,
          tc = 12.8,
          rh = 0.59,
          wl = 0.55;

      var ret = erfa.atio13(ri, di, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);

      (ret.aob).should.be.closeTo(0.09233952224794989993, 1e-12);
      (ret.zob).should.be.closeTo(1.407758704513722461, 1e-12);
      (ret.hob).should.be.closeTo(-0.09247619879782006106, 1e-12);
      (ret.dob).should.be.closeTo(0.1717653435758265198, 1e-12);
      (ret.rob).should.be.closeTo(2.710085107986886201, 1e-12);
      (ret.status).should.equal(0);

    });
  });

  describe('#atioq()', function () {
    it('Should quick CIRS to observed place transformation.', function () {
      var utc1 = 2456384.5,
          utc2 = 0.969254051,
          dut1 = 0.1550675,
          elong = -0.527800806,
          phi = -1.2345856,
          hm = 2738.0,
          xp = 2.47230737e-7,
          yp = 1.82640464e-6,
          phpa = 731.0,
          tc = 12.8,
          rh = 0.59,
          wl = 0.55;

      var apio13 = erfa.apio13(utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);

      var ri = 2.710121572969038991,
          di = 0.1729371367218230438;

      var ret = erfa.atioq(ri, di, apio13.astrom);

      (ret.aob).should.be.closeTo(0.09233952224794989993, 1e-12);
      (ret.zob).should.be.closeTo(1.407758704513722461, 1e-12);
      (ret.hob).should.be.closeTo(-0.09247619879782006106, 1e-12);
      (ret.dob).should.be.closeTo(0.1717653435758265198, 1e-12);
      (ret.rob).should.be.closeTo(2.710085107986886201, 1e-12);

    });
  });

  describe('#atoc13()', function () {
    it('Should calculate the observed place at a groundbased site to to ICRS astrometric RA,Dec.', function () {

      var utc1 = 2456384.5,
          utc2 = 0.969254051,
          dut1 = 0.1550675,
          elong = -0.527800806,
          phi = -1.2345856,
          hm = 2738.0,
          xp = 2.47230737e-7,
          yp = 1.82640464e-6,
          phpa = 731.0,
          tc = 12.8,
          rh = 0.59,
          wl = 0.55,
          ob1, ob2, ret;

      ob1 = 2.710085107986886201;
      ob2 = 0.1717653435758265198;

      ret = erfa.atoc13("R", ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);
      (ret.rc).should.be.closeTo(2.709956744661000609, 1e-12);
      (ret.dc).should.be.closeTo(0.1741696500895398562, 1e-12);
      (ret.status).should.equal(0);

      ob1 = -0.09247619879782006106;
      ob2 = 0.1717653435758265198;
      ret = erfa.atoc13("H", ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);
      (ret.rc).should.be.closeTo(2.709956744661000609, 1e-12);
      (ret.dc).should.be.closeTo(0.1741696500895398562, 1e-12);
      (ret.status).should.equal(0);

      ob1 = 0.09233952224794989993;
      ob2 = 1.407758704513722461;
      ret = erfa.atoc13("A", ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);
      (ret.rc).should.be.closeTo(2.709956744661000609, 1e-12);
      (ret.dc).should.be.closeTo(0.1741696500895398565, 1e-12);
      (ret.status).should.equal(0);

    });
  });

  describe('#eraAtoi13()', function () {
    it('Should calculate Observed place to CIRS', function () {

      var utc1 = 2456384.5,
          utc2 = 0.969254051,
          dut1 = 0.1550675,
          elong = -0.527800806,
          phi = -1.2345856,
          hm = 2738.0,
          xp = 2.47230737e-7,
          yp = 1.82640464e-6,
          phpa = 731.0,
          tc = 12.8,
          rh = 0.59,
          wl = 0.55,
          ob1, ob2, ret;

      ob1 = 2.710085107986886201;
      ob2 = 0.1717653435758265198;
      ret = erfa.atoi13( "R", ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);
      (ret.ri).should.be.closeTo(2.710121574449135955, 1e-12);
      (ret.di).should.be.closeTo(0.1729371839114567725, 1e-12);
      (ret.status).should.equal(0);

      ob1 = -0.09247619879782006106;
      ob2 = 0.1717653435758265198;
      ret = erfa.atoi13( "H", ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);
      (ret.ri).should.be.closeTo(2.710121574449135955, 1e-12);
      (ret.di).should.be.closeTo(0.1729371839114567725, 1e-12);
      (ret.status).should.equal(0);

      ob1 = 0.09233952224794989993;
      ob2 = 1.407758704513722461;
      ret = erfa.atoi13( "A", ob1, ob2, utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);
      (ret.ri).should.be.closeTo(2.710121574449135955, 1e-12);
      (ret.di).should.be.closeTo(0.1729371839114567728, 1e-12);
      (ret.status).should.equal(0);

    });
  });
});