"use strict";

var chai = require('chai'),
  should = chai.should(),
  erfa = require('../index');

describe('Precession / Nutation', function () {

  describe("#bi00()", function () {
    it('Should return the frame bias components of IAU 2000 precession-nutation models (part of MHB2000 with additions).', function () {

      var ret = erfa.bi00();

      (ret.dpsibi).should.be.closeTo(-0.2025309152835086613e-6, 1e-12);
      (ret.depsbi).should.be.closeTo(-0.3306041454222147847e-7, 1e-12);
      (ret.dra).should.be.closeTo(-0.7078279744199225506e-7, 1e-12);

    });
  });

  describe("#bp00()", function () {
    it('Should calculate the frame bias and precession, IAU 2000.', function () {

      var ret = erfa.bp00(2400000.5, 50123.9999);


      (ret.rb[0][0]).should.be.closeTo(0.9999999999999942498, 1e-12);
      (ret.rb[0][1]).should.be.closeTo(-0.7078279744199196626e-7, 1e-16);
      (ret.rb[0][2]).should.be.closeTo(0.8056217146976134152e-7, 1e-16);
      (ret.rb[1][0]).should.be.closeTo(0.7078279477857337206e-7, 1e-16);
      (ret.rb[1][1]).should.be.closeTo(0.9999999999999969484, 1e-12);
      (ret.rb[1][2]).should.be.closeTo(0.3306041454222136517e-7, 1e-16);
      (ret.rb[2][0]).should.be.closeTo(-0.8056217380986972157e-7, 1e-16);
      (ret.rb[2][1]).should.be.closeTo(-0.3306040883980552500e-7, 1e-16);
      (ret.rb[2][2]).should.be.closeTo(0.9999999999999962084, 1e-12);

      (ret.rp[0][0]).should.be.closeTo(0.9999995504864048241, 1e-12);
      (ret.rp[0][1]).should.be.closeTo(0.8696113836207084411e-3, 1e-14);
      (ret.rp[0][2]).should.be.closeTo(0.3778928813389333402e-3, 1e-14);
      (ret.rp[1][0]).should.be.closeTo(-0.8696113818227265968e-3, 1e-14);
      (ret.rp[1][1]).should.be.closeTo(0.9999996218879365258, 1e-12);
      (ret.rp[1][2]).should.be.closeTo(-0.1690679263009242066e-6, 1e-14);
      (ret.rp[2][0]).should.be.closeTo(-0.3778928854764695214e-3, 1e-14);
      (ret.rp[2][1]).should.be.closeTo(-0.1595521004195286491e-6, 1e-14);
      (ret.rp[2][2]).should.be.closeTo(0.9999999285984682756, 1e-12);

      (ret.rbp[0][0]).should.be.closeTo(0.9999995505175087260, 1e-12);
      (ret.rbp[0][1]).should.be.closeTo(0.8695405883617884705e-3, 1e-14);
      (ret.rbp[0][2]).should.be.closeTo(0.3779734722239007105e-3, 1e-14);
      (ret.rbp[1][0]).should.be.closeTo(-0.8695405990410863719e-3, 1e-14);
      (ret.rbp[1][1]).should.be.closeTo(0.9999996219494925900, 1e-12);
      (ret.rbp[1][2]).should.be.closeTo(-0.1360775820404982209e-6, 1e-14);
      (ret.rbp[2][0]).should.be.closeTo(-0.3779734476558184991e-3, 1e-14);
      (ret.rbp[2][1]).should.be.closeTo(-0.1925857585832024058e-6, 1e-14);
      (ret.rbp[2][2]).should.be.closeTo(0.9999999285680153377, 1e-12);

    });
  });

  describe("#bp06()", function () {
    it('Should calculate the frame bias and precession, IAU 2006.', function () {

      var ret = erfa.bp06(2400000.5, 50123.9999);


      (ret.rb[0][0]).should.be.closeTo(0.9999999999999942497, 1e-12);
      (ret.rb[0][1]).should.be.closeTo(-0.7078368960971557145e-7, 1e-14);
      (ret.rb[0][2]).should.be.closeTo(0.8056213977613185606e-7, 1e-14);
      (ret.rb[1][0]).should.be.closeTo(0.7078368694637674333e-7, 1e-14);
      (ret.rb[1][1]).should.be.closeTo(0.9999999999999969484, 1e-12);
      (ret.rb[1][2]).should.be.closeTo(0.3305943742989134124e-7, 1e-14);
      (ret.rb[2][0]).should.be.closeTo(-0.8056214211620056792e-7, 1e-14);
      (ret.rb[2][1]).should.be.closeTo(-0.3305943172740586950e-7, 1e-14);
      (ret.rb[2][2]).should.be.closeTo(0.9999999999999962084, 1e-12);

      (ret.rp[0][0]).should.be.closeTo(0.9999995504864960278, 1e-12);
      (ret.rp[0][1]).should.be.closeTo(0.8696112578855404832e-3, 1e-14);
      (ret.rp[0][2]).should.be.closeTo(0.3778929293341390127e-3, 1e-14);
      (ret.rp[1][0]).should.be.closeTo(-0.8696112560510186244e-3, 1e-14);
      (ret.rp[1][1]).should.be.closeTo(0.9999996218880458820, 1e-12);
      (ret.rp[1][2]).should.be.closeTo(-0.1691646168941896285e-6, 1e-14);
      (ret.rp[2][0]).should.be.closeTo(-0.3778929335557603418e-3, 1e-14);
      (ret.rp[2][1]).should.be.closeTo(-0.1594554040786495076e-6, 1e-14);
      (ret.rp[2][2]).should.be.closeTo(0.9999999285984501222, 1e-12);

      (ret.rbp[0][0]).should.be.closeTo(0.9999995505176007047, 1e-12);
      (ret.rbp[0][1]).should.be.closeTo(0.8695404617348208406e-3, 1e-14);
      (ret.rbp[0][2]).should.be.closeTo(0.3779735201865589104e-3, 1e-14);
      (ret.rbp[1][0]).should.be.closeTo(-0.8695404723772031414e-3, 1e-14);
      (ret.rbp[1][1]).should.be.closeTo(0.9999996219496027161, 1e-12);
      (ret.rbp[1][2]).should.be.closeTo(-0.1361752497080270143e-6, 1e-14);
      (ret.rbp[2][0]).should.be.closeTo(-0.3779734957034089490e-3, 1e-14);
      (ret.rbp[2][1]).should.be.closeTo(-0.1924880847894457113e-6, 1e-14);
      (ret.rbp[2][2]).should.be.closeTo(0.9999999285679971958, 1e-12);
    });
  });

  describe("#bpn2xy()", function () {
      it('Should extract from the bias-precession-nutation matrix the X,Y coordinates of the Celestial Intermediate Pole', function () {

        var rbpn = [
          [9.999962358680738e-1, -2.516417057665452e-3, -1.093569785342370e-3],
          [2.516462370370876e-3, 9.999968329010883e-1, 4.006159587358310e-5],
          [1.093465510215479e-3, -4.281337229063151e-5, 9.999994012499173e-1]
        ];

        var ret = erfa.bpn2xy(rbpn);

        (ret.x).should.be.closeTo(1.093465510215479e-3, 1e-12);
        (ret.y).should.be.closeTo(-4.281337229063151e-5, 1e-12);

      });
    });

  describe("#c2i00a()", function () {
    it('Should form the celestial-to-intermediate matrix for a given date using the IAU 2000A precession-nutation model', function () {

      var ret = erfa.c2i00a(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999998323037165557, 1e-12);
      (ret[0][1]).should.be.closeTo(0.5581526348992140183e-9, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.5791308477073443415e-3, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.2384266227870752452e-7, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991917405258, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4020594955028209745e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5791308472168152904e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4020595661591500259e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998314954572304, 1e-12);

    });
  });

  describe("#c2i00b()", function () {
    it('Should form the celestial-to-intermediate matrix for a given date using the IAU 2000B precession-nutation model', function () {

      var ret = erfa.c2i00b(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999998323040954356, 1e-12);
      (ret[0][1]).should.be.closeTo(0.5581526349131823372e-9, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.5791301934855394005e-3, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.2384239285499175543e-7, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991917574043, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4020552974819030066e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5791301929950208873e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4020553681373720832e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998314958529887, 1e-12);

    });
  });

  describe("#c2i06a()", function () {
    it('Should convert form the celestial-to-intermediate matrix for a given date using the IAU 2006 precession and IAU 2000A nutation models', function () {

      var ret = erfa.c2i06a(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999998323037159379, 1e-12);
      (ret[0][1]).should.be.closeTo(0.5581121329587613787e-9, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.5791308487740529749e-3, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.2384253169452306581e-7, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991917467827, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4020579392895682558e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5791308482835292617e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4020580099454020310e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998314954628695, 1e-12);

    });
  });

  describe("#c2ibpn()", function () {
    it('Should form the celestial-to-intermediate matrix for a given date given the bias-precession-nutation matrix. IAU 2000', function () {

      var rbpn = [
        [9.999962358680738e-1, -2.516417057665452e-3, -1.093569785342370e-3],
        [2.516462370370876e-3, 9.999968329010883e-1, 4.006159587358310e-5],
        [1.093465510215479e-3, -4.281337229063151e-5, 9.999994012499173e-1]
      ];

      var ret = erfa.c2ibpn(2400000.5, 50123.9999, rbpn);

      (ret[0][0]).should.be.closeTo(0.9999994021664089977, 1e-12);
      (ret[0][1]).should.be.closeTo(-0.3869195948017503664e-8, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.1093465511383285076e-2, 1e-12);

      (ret[1][0]).should.be.closeTo(0.5068413965715446111e-7, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999990835075686, 1e-12);
      (ret[1][2]).should.be.closeTo(0.4281334246452708915e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(0.1093465510215479000e-2, 1e-12);
      (ret[2][1]).should.be.closeTo(-0.4281337229063151000e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999994012499173103, 1e-12);


    });
  });

  describe("#c2ixy()", function () {
    it('Should Form the celestial to intermediate-frame-of-date matrix for a given date when the CIP X,Y coordinates are known. IAU 2000', function () {

      var x = 0.5791308486706011000e-3,
          y = 0.4020579816732961219e-4;

      var ret = erfa.c2ixy(2400000.5, 53736, x, y);

      (ret[0][0]).should.be.closeTo(0.9999998323037157138, 1e-12);
      (ret[0][1]).should.be.closeTo(0.5581526349032241205e-9, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.5791308491611263745e-3, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.2384257057469842953e-7, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991917468964, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4020579110172324363e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5791308486706011000e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4020579816732961219e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998314954627590, 1e-12);


    });
  });


  describe("#c2ixys()", function () {
    it('Should form the celestial to intermediate-frame-of-date matrix given the CIP X,Y and the CIO locator s', function () {

      var x =  0.5791308486706011000e-3,
          y =  0.4020579816732961219e-4,
          s = -0.1220040848472271978e-7;

      var ret = erfa.c2ixys(x, y, s);

      (ret[0][0]).should.be.closeTo(0.9999998323037157138, 1e-12);
      (ret[0][1]).should.be.closeTo(0.5581984869168499149e-9, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.5791308491611282180e-3, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.2384261642670440317e-7, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991917468964, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4020579110169668931e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5791308486706011000e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4020579816732961219e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998314954627590, 1e-12);

    });
  });


  describe("#c2t00a()", function () {
    it('Should form the celestial to terrestrial matrix given the date, the UT1 and the polar motion, using the IAU 2000A nutation model', function () {

      var tta = 2400000.5,
          uta = 2400000.5,
          ttb = 53736.0,
          utb = 53736.0,
          xp = 2.55060238e-7,
          yp = 1.860359247e-6;

      var ret = erfa.c2t00a(tta, ttb, uta, utb, xp, yp);

      (ret[0][0]).should.be.closeTo(-0.1810332128307182668, 1e-12);
      (ret[0][1]).should.be.closeTo(0.9834769806938457836, 1e-12);
      (ret[0][2]).should.be.closeTo(0.6555535638688341725e-4, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.9834768134135984552, 1e-12);
      (ret[1][1]).should.be.closeTo(-0.1810332203649520727, 1e-12);
      (ret[1][2]).should.be.closeTo(0.5749801116141056317e-3, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5773474014081406921e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.3961832391770163647e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998325501692289, 1e-12);

    });
  });


  describe("#c2t00b()", function () {
    it('Should form the celestial-to-intermediate matrix for a given date using the IAU 2000B precession-nutation model.', function () {

      var tta = 2400000.5,
          uta = 2400000.5,
          ttb = 53736.0,
          utb = 53736.0,
          xp = 2.55060238e-7,
          yp = 1.860359247e-6;

      var ret = erfa.c2t00b(tta, ttb, uta, utb, xp, yp);

      (ret[0][0]).should.be.closeTo(-0.1810332128439678965, 1e-12);
      (ret[0][1]).should.be.closeTo(0.9834769806913872359, 1e-12);
      (ret[0][2]).should.be.closeTo(0.6555565082458415611e-4, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.9834768134115435923, 1e-12);
      (ret[1][1]).should.be.closeTo(-0.1810332203784001946, 1e-12);
      (ret[1][2]).should.be.closeTo(0.5749793922030017230e-3, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5773467471863534901e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.3961790411549945020e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998325505635738, 1e-12);

    });
  });


  describe("#c2t06a()", function () {
    it('Should form the celestial to terrestrial matrix given the date, the UT1 and the polar motion, using the IAU 2006 precession and IAU 2000A', function () {

      var tta = 2400000.5,
        uta = 2400000.5,
        ttb = 53736.0,
        utb = 53736.0,
        xp = 2.55060238e-7,
        yp = 1.860359247e-6;

      var ret = erfa.c2t06a(tta, ttb, uta, utb, xp, yp);

      (ret[0][0]).should.be.closeTo(-0.1810332128305897282, 1e-12);
      (ret[0][1]).should.be.closeTo(0.9834769806938592296, 1e-12);
      (ret[0][2]).should.be.closeTo(0.6555550962998436505e-4, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.9834768134136214897, 1e-12);
      (ret[1][1]).should.be.closeTo(-0.1810332203649130832, 1e-12);
      (ret[1][2]).should.be.closeTo(0.5749800844905594110e-3, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5773474024748545878e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.3961816829632690581e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998325501747785, 1e-12);

    });
  });


  describe("#c2tcio()", function () {
    it('Should assemble the celestial to terrestrial matrix from CIO-based components', function () {

      var rc2i = [[0.9999998323037164738, 0.5581526271714303683e-9, -0.5791308477073443903e-3],
                  [-0.2384266227524722273e-7, 0.9999999991917404296, -0.4020594955030704125e-4],
                  [0.5791308472168153320e-3, 0.4020595661593994396e-4, 0.9999998314954572365]], 
          era = 1.75283325530307,
          rpom = [[0.9999999999999674705, -0.1367174580728847031e-10, 0.2550602379999972723e-6], 
                  [0.1414624947957029721e-10, 0.9999999999982694954, -0.1860359246998866338e-5], 
                  [-0.2550602379741215275e-6, 0.1860359247002413923e-5, 0.9999999999982369658]];


      var ret = erfa.c2tcio(rc2i, era, rpom);

      (ret[0][0]).should.be.closeTo(-0.1810332128307110439, 1e-12);
      (ret[0][1]).should.be.closeTo(0.9834769806938470149, 1e-12);
      (ret[0][2]).should.be.closeTo(0.6555535638685466874e-4, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.9834768134135996657, 1e-12);
      (ret[1][1]).should.be.closeTo(-0.1810332203649448367, 1e-12);
      (ret[1][2]).should.be.closeTo(0.5749801116141106528e-3, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5773474014081407076e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.3961832391772658944e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998325501691969, 1e-12);
      
    });
  });
//


  describe("#c2teqx()", function () {
    it('Should assemble the celestial to terrestrial matrix from equinox-based components', function () {

      var rbpn = [[0.9999989440476103608, -0.1332881761240011518e-2, -0.5790767434730085097e-3],
                  [0.1332858254308954453e-2, 0.9999991109044505944, -0.4097782710401555759e-4],
                  [0.5791308472168153320e-3, 0.4020595661593994396e-4, 0.9999998314954572365]],
          gst = 1.754166138040730516,
          rpom = [[0.9999999999999674705, -0.1367174580728847031e-10, 0.2550602379999972723e-6],
                  [0.1414624947957029721e-10, 0.9999999999982694954, -0.1860359246998866338e-5],
                  [-0.2550602379741215275e-6, 0.1860359247002413923e-5, 0.9999999999982369658]];

      var ret = erfa.c2teqx(rbpn, gst, rpom);

      (ret[0][0]).should.be.closeTo(-0.1810332128528685730, 1e-12);
      (ret[0][1]).should.be.closeTo(0.9834769806897685071, 1e-12);
      (ret[0][2]).should.be.closeTo(0.6555535639982634449e-4, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.9834768134095211257, 1e-12);
      (ret[1][1]).should.be.closeTo(-0.1810332203871023800, 1e-12);
      (ret[1][2]).should.be.closeTo(0.5749801116126438962e-3, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5773474014081539467e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.3961832391768640871e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998325501691969, 1e-12);

    });
  });


  describe("#c2tpe()", function () {
    it('Should form the celestial to terrestrial matrix given the date, the UT1, the nutation and the polar motion. IAU 2000.', function () {

      var tta = 2400000.5,
          uta = 2400000.5,
          ttb = 53736.0,
          utb = 53736.0,
          deps = 0.4090789763356509900,
          dpsi = -0.9630909107115582393e-5,
          xp = 2.55060238e-7,
          yp = 1.860359247e-6;

      var ret = erfa.c2tpe(tta, ttb, uta, utb, dpsi, deps, xp, yp);

      (ret[0][0]).should.be.closeTo(-0.1813677995763029394, 1e-12);
      (ret[0][1]).should.be.closeTo(0.9023482206891683275, 1e-12);
      (ret[0][2]).should.be.closeTo(-0.3909902938641085751, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.9834147641476804807, 1e-12);
      (ret[1][1]).should.be.closeTo(-0.1659883635434995121, 1e-12);
      (ret[1][2]).should.be.closeTo(0.7309763898042819705e-1, 1e-12);

      (ret[2][0]).should.be.closeTo(0.1059685430673215247e-2, 1e-12);
      (ret[2][1]).should.be.closeTo(0.3977631855605078674, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9174875068792735362, 1e-12);

    });
  });

  describe("#c2txy()", function () {
    it('Should form the celestial to terrestrial matrix given the date, the UT1, the CIP coordinates and the polar motion. IAU 2000', function () {

      var tta = 2400000.5,
          uta = 2400000.5,
          ttb = 53736.0,
          utb = 53736.0,
          x = 0.5791308486706011000e-3,
          y = 0.4020579816732961219e-4,
          xp = 2.55060238e-7,
          yp = 1.860359247e-6;

      var ret = erfa.c2txy(tta, ttb, uta, utb, x, y, xp, yp);

      (ret[0][0]).should.be.closeTo(-0.1810332128306279253, 1e-12);
      (ret[0][1]).should.be.closeTo(0.9834769806938520084, 1e-12);
      (ret[0][2]).should.be.closeTo(0.6555551248057665829e-4, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.9834768134136142314, 1e-12);
      (ret[1][1]).should.be.closeTo(-0.1810332203649529312, 1e-12);
      (ret[1][2]).should.be.closeTo(0.5749800843594139912e-3, 1e-12);

      (ret[2][0]).should.be.closeTo(0.5773474028619264494e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(0.3961816546911624260e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999998325501746670, 1e-12);

    });
  });

  describe("#eo06a()", function () {
    it('Should slove equation of the origins, IAU 2006 precession and IAU 2000A nutation.', function () {

      var ret = erfa.eo06a(2400000.5, 53736.0);

      (ret).should.be.closeTo(-0.1332882371941833644e-2, 1e-15);
      
    });
  });


  describe("#eors()", function () {
    it('should solve Equation of the origins, given the classical NPB matrix and the quantity', function () {

      var rnpb = [[0.9999989440476103608, -0.1332881761240011518e-2, -0.5790767434730085097e-3],
                  [0.1332858254308954453e-2, 0.9999991109044505944, -0.4097782710401555759e-4],
                  [0.5791308472168153320e-3, 0.4020595661593994396e-4, 0.9999998314954572365]],
          s = -0.1220040848472271978e-7;

      var ret = erfa.eors(rnpb, s);

      (ret).should.be.closeTo(-0.1332882715130744606e-2, 1e-14);

    });
  });

  describe("#fw2m()", function () {
    it('Should form rotation matrix given the Fukushima-Williams angles.', function () {

      var gamb = -0.2243387670997992368e-5,
          phib =  0.4091014602391312982,
          psi  = -0.9501954178013015092e-3,
          eps  =  0.4091014316587367472;

      var ret = erfa.fw2m(gamb, phib, psi, eps);

      (ret[0][0]).should.be.closeTo(0.9999995505176007047, 1e-12);
      (ret[0][1]).should.be.closeTo(0.8695404617348192957e-3, 1e-12);
      (ret[0][2]).should.be.closeTo(0.3779735201865582571e-3, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.8695404723772016038e-3, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999996219496027161, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.1361752496887100026e-6, 1e-12);

      (ret[2][0]).should.be.closeTo(-0.3779734957034082790e-3, 1e-12);
      (ret[2][1]).should.be.closeTo(-0.1924880848087615651e-6, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999999285679971958, 1e-12);

    });
  });


  describe("#fw2xy()", function () {
    it('Should calculate CIP X,Y given Fukushima-Williams bias-precession-nutation angles', function () {

      var gamb = -0.2243387670997992368e-5,
          phib =  0.4091014602391312982,
          psi  = -0.9501954178013015092e-3,
          eps  =  0.4091014316587367472;

      var ret = erfa.fw2xy(gamb, phib, psi, eps);

      (ret.x).should.be.closeTo(-0.3779734957034082790e-3, 1e-14);
      (ret.y).should.be.closeTo(-0.1924880848087615651e-6, 1e-14);

    });
  });

  describe("#num00a()", function () {
    it('Should form the matrix of nutation for a given date, IAU 2000A model', function () {

      var ret = erfa.num00a(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999999999536227949, 1e-12);
      (ret[0][1]).should.be.closeTo(0.8836238544090873336e-5, 1e-12);
      (ret[0][2]).should.be.closeTo(0.3830835237722400669e-5, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.8836082880798569274e-5, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991354655028, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4063240865362499850e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(-0.3831194272065995866e-5, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4063237480216291775e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999999991671660338, 1e-12);

    });
  });

  describe("#num00b()", function () {
    it('Should form the matrix of nutation for a given date, IAU 2000B model', function () {

      var ret = erfa.num00b(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999999999536069682, 1e-12);
      (ret[0][1]).should.be.closeTo(0.8837746144871248011e-5, 1e-12);
      (ret[0][2]).should.be.closeTo(0.3831488838252202945e-5, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.8837590456632304720e-5, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991354692733, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4063198798559591654e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(-0.3831847930134941271e-5, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4063195412258168380e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999999991671806225, 1e-12);

    });
  });

  describe("#num06a()", function () {
    it('Should form the matrix of nutation for a given date, IAU 2006/2000A model', function () {

      var ret = erfa.num06a(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999999999536227668, 1e-12);
      (ret[0][1]).should.be.closeTo(0.8836241998111535233e-5, 1e-12);
      (ret[0][2]).should.be.closeTo(0.3830834608415287707e-5, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.8836086334870740138e-5, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991354657474, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4063240188248455065e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(-0.3831193642839398128e-5, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4063236803101479770e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999999991671663114, 1e-12);

    });
  });
  
  //
  describe("#numat()", function () {
    it('Should form the matrix of nutation.', function () {

      var epsa =  0.4090789763356509900,
          dpsi = -0.9630909107115582393e-5,
          deps =  0.4063239174001678826e-4;

      var ret = erfa.numat(epsa, dpsi, deps);

      (ret[0][0]).should.be.closeTo(0.9999999999536227949, 1e-12);
      (ret[0][1]).should.be.closeTo(0.8836239320236250577e-5, 1e-12);
      (ret[0][2]).should.be.closeTo(0.3830833447458251908e-5, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.8836083657016688588e-5, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991354654959, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4063240865361857698e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(-0.3831192481833385226e-5, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4063237480216934159e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999999991671660407, 1e-12);

    });
  });

  describe("#nut00a()", function () {
    it('Should form Nutation, IAU 2000A model (MHB2000 luni-solar and planetary nutation with free core nutation omitted)', function () {

      var ret = erfa.nut00a(2400000.5, 53736.0);

      (ret.dpsi).should.be.closeTo(-0.9630909107115518431e-5, 1e-13);
      (ret.deps).should.be.closeTo(0.4063239174001678710e-4, 1e-13);

    });
  });

  describe("#nut00b()", function () {
    it('Should form nutation, IAU 2000B model', function () {

      var ret = erfa.nut00b(2400000.5, 53736.0);

      (ret.dpsi).should.be.closeTo(-0.9632552291148362783e-5, 1e-13);
      (ret.deps).should.be.closeTo(0.4063197106621159367e-4, 1e-13);

    });
  });

  describe("#nut06a()", function () {
    it('should form IAU 2000A nutation with adjustments to match the IAU 2006 precession', function () {

      var ret = erfa.nut06a(2400000.5, 53736.0);

      (ret.dpsi).should.be.closeTo(-0.9630912025820308797e-5, 1e-13);
      (ret.deps).should.be.closeTo(0.4063238496887249798e-4, 1e-13);

    });
  });

  describe("#nut80()", function () {
    it('should form nutation, IAU 1980 model', function () {

      var ret = erfa.nut80(2400000.5, 53736.0);

      (ret.dpsi).should.be.closeTo(-0.9643658353226563966e-5, 1e-13);
      (ret.deps).should.be.closeTo(0.4060051006879713322e-4, 1e-13);

    });
  });

  describe("#nutm80()", function () {
    it('Should form the matrix of nutation for a given date, IAU 1980 model.', function () {

      var ret = erfa.nutm80(2400000.5, 53736.0);

      (ret[0][0]).should.be.closeTo(0.9999999999534999268, 1e-12);
      (ret[0][1]).should.be.closeTo(0.8847935789636432161e-5, 1e-12);
      (ret[0][2]).should.be.closeTo(0.3835906502164019142e-5, 1e-12);

      (ret[1][0]).should.be.closeTo(-0.8847780042583435924e-5, 1e-12);
      (ret[1][1]).should.be.closeTo(0.9999999991366569963, 1e-12);
      (ret[1][2]).should.be.closeTo(-0.4060052702727130809e-4, 1e-12);

      (ret[2][0]).should.be.closeTo(-0.3836265729708478796e-5, 1e-12);
      (ret[2][1]).should.be.closeTo(0.4060049308612638555e-4, 1e-12);
      (ret[2][2]).should.be.closeTo(0.9999999991684415129, 1e-12);

    });
  });

  describe("#Obl06()", function () {
    it('Should calculate mean obliquity of the ecliptic, IAU 2006 precession model', function () {

      var ret = erfa.Obl06(2400000.5, 54388.0);

      ret.should.be.closeTo(0.4090749229387258204, 1e-14);

    });
  });

  describe("#Obl80()", function () {
    it('Should calculate mean obliquity of the ecliptic, IAU 2006 precession model', function () {

      var ret = erfa.Obl80(2400000.5, 54388.0);

      ret.should.be.closeTo(0.4090751347643816218, 1e-14);

    });
  });


  describe("#s00()", function () {
    it('Should calculate The CIO locator s, positioning the Celestial Intermediate Origin on the equator of the Celestial Intermediate Pole, given the CIP\'s X,Y coordinates', function () {

      var ret = erfa.s00(2400000.5, 53736.0, 0.5791308486706011000e-3, 0.4020579816732961219e-4);

      ret.should.be.closeTo(-0.1220036263270905693e-7, 1e-18);

    });
  });

  describe("#s00a()", function () {
    it('Should calculate the CIO locator s, positioning the Celestial Intermediate Origin on the equator of the Celestial Intermediate Pole, using the IAU 2000A precession-nutation model.', function () {

      var ret = erfa.s00a(2400000.5, 52541.0);

      ret.should.be.closeTo(-0.1340684448919163584e-7, 1e-18);

    });
  });

  describe("#s00b()", function () {
    it('Should calculate the CIO locator s, positioning the Celestial Intermediate Origin on the equator of the Celestial Intermediate Pole, using the IAU 2000B precession-nutation model.', function () {

      var ret = erfa.s00b(2400000.5, 52541.0);

      ret.should.be.closeTo(-0.1340695782951026584e-7, 1e-18);

    });
  });

  describe("#s06()", function () {
    it('Should calculate The CIO locator s, positioning the Celestial Intermediate Origin on the equator of the Celestial Intermediate Pole, given the CIP\'s X,Y coordinates.  Compatible with IAU 2006/2000A precession-nutation.', function () {

      var ret = erfa.s06(2400000.5, 53736.0, 0.5791308486706011000e-3, 0.4020579816732961219e-4);

      ret.should.be.closeTo(-0.1220032213076463117e-7, 1e-18);
    });
  });

  describe("#s06a()", function () {
    it('Should calculate The CIO locator s, positioning the Celestial Intermediate Origin on the equator of the Celestial Intermediate Pole, using the IAU 2006 precession and IAU 2000A nutation models.', function () {

      var ret = erfa.s06a(2400000.5, 52541.0);

      ret.should.be.closeTo(-0.1340680437291812383e-7, 1e-18);

    });
  });

  describe("#sp00()", function () {
    it('Should calculate The TIO locator s\', positioning the Terrestrial Intermediate Origin on the equator of the Celestial Intermediate Pole.', function () {

      var ret = erfa.sp00(2400000.5, 52541.0);

      ret.should.be.closeTo(-0.6216698469981019309e-11, 1e-12);

    });
  });

});