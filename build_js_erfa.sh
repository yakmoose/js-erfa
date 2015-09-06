#!/usr/bin/env bash
# This really needs to be a makefile or something, but works as advertised

emcc  \
--memory-init-file 0 \
-s EXPORTED_FUNCTIONS="['_eraA2af', '_eraA2tf', '_eraAb', '_eraAf2a', '_eraAnp', '_eraAnpm', '_eraApcg13','_eraApcg', '_eraApci13', '_eraApci', '_eraApco13', '_eraApco', '_eraApcs13', '_eraApcs', '_eraAper13','_eraAper', '_eraApio13', '_eraApio', '_eraAtci13', '_eraAtciq', '_eraAtciqn', '_eraAtciqz', '_eraAtco13','_eraAtic13', '_eraAticq', '_eraAticqn', '_eraAtio13', '_eraAtioq', '_eraAtoc13', '_eraAtoi13', '_eraAtoiq','_eraBi00', '_eraBp00', '_eraBp06', '_eraBpn2xy', '_eraC2i00a', '_eraC2i00b', '_eraC2i06a', '_eraC2ibpn','_eraC2ixy', '_eraC2ixys', '_eraC2s', '_eraC2t00a', '_eraC2t00b', '_eraC2t06a', '_eraC2tcio', '_eraC2teqx','_eraC2tpe', '_eraC2txy', '_eraCal2jd', '_eraCp', '_eraCpv', '_eraCr', '_eraD2dtf', '_eraD2tf', '_eraDat', '_eraDtdb','_eraDtf2d', '_eraEe00a', '_eraEe00b', '_eraEe00', '_eraEe06a', '_eraEect00', '_eraEform', '_eraEo06a','_eraEors', '_eraEpb2jd', '_eraEpb', '_eraEpj2jd', '_eraEpj', '_eraEpv00', '_eraEqeq94', '_eraEra00','_eraFad03', '_eraFae03', '_eraFaf03', '_eraFaju03', '_eraFal03', '_eraFalp03', '_eraFama03','_eraFame03', '_eraFane03', '_eraFaom03', '_eraFapa03', '_eraFasa03', '_eraFaur03', '_eraFave03','_eraFk52h', '_eraFk5hip', '_eraFk5hz', '_eraFw2m', '_eraFw2xy', '_eraG2icrs', '_eraGc2gd', '_eraGc2gde', '_eraGd2gc','_eraGd2gce', '_eraGmst00', '_eraGmst06', '_eraGmst82', '_eraGst00a', '_eraGst00b', '_eraGst06a','_eraGst06', '_eraGst94', '_eraH2fk5', '_eraHfk5z', '_eraIcrs2g', '_eraIr', '_eraJd2cal', '_eraJdcalf', '_eraLd','_eraLdn', '_eraLdsun', '_eraNum00a', '_eraNum00b', '_eraNum06a', '_eraNumat', '_eraNut00a', '_eraNut00b','_eraNut06a', '_eraNut80', '_eraNutm80', '_eraObl06', '_eraObl80', '_eraP06e', '_eraP2pv', '_eraP2s', '_eraPap','_eraPas', '_eraPb06', '_eraPdp', '_eraPfw06', '_eraPlan94', '_eraPmat00', '_eraPmat06', '_eraPmat76','_eraPm', '_eraPmp', '_eraPmpx', '_eraPmsafe', '_eraPn00a', '_eraPn00b', '_eraPn00', '_eraPn06a','_eraPn06', '_eraPn', '_eraPnm00a', '_eraPnm00b', '_eraPnm06a', '_eraPnm80', '_eraPom00', '_eraPpp','_eraPpsp', '_eraPr00', '_eraPrec76', '_eraPv2p', '_eraPv2s', '_eraPvdpv', '_eraPvm', '_eraPvmpv', '_eraPvppv','_eraPvstar', '_eraPvtob', '_eraPvu', '_eraPvup', '_eraPvxpv', '_eraPxp', '_eraRefco', '_eraRm2v', '_eraRv2m','_eraRx', '_eraRxp', '_eraRxpv', '_eraRxr', '_eraRy', '_eraRz', '_eraS00a', '_eraS00b', '_eraS00','_eraS06a', '_eraS06', '_eraS2c', '_eraS2p', '_eraS2pv', '_eraS2xpv', '_eraSepp', '_eraSeps', '_eraSp00','_eraStarpm', '_eraStarpv', '_eraSxp', '_eraSxpv', '_eraTaitt', '_eraTaiut1', '_eraTaiutc', '_eraTcbtdb','_eraTcgtt', '_eraTdbtcb', '_eraTdbtt', '_eraTf2a', '_eraTf2d', '_eraTr', '_eraTrxp', '_eraTrxpv', '_eraTttai','_eraTttcg', '_eraTttdb', '_eraTtut1', '_eraUt1tai', '_eraUt1tt', '_eraUt1utc', '_eraUtctai', '_eraUtcut1','_eraXy06', '_eraXys00a', '_eraXys00b', '_eraXys06a', '_eraZp', '_eraZpv', '_eraZr']"\
\
 a2af.c a2tf.c ab.c af2a.c anp.c anpm.c apcg13.c \
apcg.c apci13.c apci.c apco13.c apco.c apcs13.c apcs.c aper13.c \
aper.c apio13.c apio.c atci13.c atciq.c atciqn.c atciqz.c atco13.c \
atic13.c aticq.c aticqn.c atio13.c atioq.c atoc13.c atoi13.c atoiq.c \
bi00.c bp00.c bp06.c bpn2xy.c c2i00a.c c2i00b.c c2i06a.c c2ibpn.c \
c2ixy.c c2ixys.c c2s.c c2t00a.c c2t00b.c c2t06a.c c2tcio.c c2teqx.c \
c2tpe.c c2txy.c cal2jd.c cp.c cpv.c cr.c d2dtf.c d2tf.c dat.c dtdb.c \
dtf2d.c ee00a.c ee00b.c ee00.c ee06a.c eect00.c eform.c eo06a.c \
eors.c epb2jd.c epb.c epj2jd.c epj.c epv00.c eqeq94.c era00.c \
fad03.c fae03.c faf03.c faju03.c fal03.c falp03.c fama03.c \
fame03.c fane03.c faom03.c fapa03.c fasa03.c faur03.c fave03.c \
fk52h.c fk5hip.c fk5hz.c fw2m.c fw2xy.c g2icrs.c gc2gd.c gc2gde.c gd2gc.c \
gd2gce.c gmst00.c gmst06.c gmst82.c gst00a.c gst00b.c gst06a.c \
gst06.c gst94.c h2fk5.c hfk5z.c icrs2g.c ir.c jd2cal.c jdcalf.c ld.c \
ldn.c ldsun.c num00a.c num00b.c num06a.c numat.c nut00a.c nut00b.c \
nut06a.c nut80.c nutm80.c obl06.c obl80.c p06e.c p2pv.c p2s.c pap.c \
pas.c pb06.c pdp.c pfw06.c plan94.c pmat00.c pmat06.c pmat76.c \
pm.c pmp.c pmpx.c pmsafe.c pn00a.c pn00b.c pn00.c pn06a.c \
pn06.c pn.c pnm00a.c pnm00b.c pnm06a.c pnm80.c pom00.c ppp.c \
ppsp.c pr00.c prec76.c pv2p.c pv2s.c pvdpv.c pvm.c pvmpv.c pvppv.c \
pvstar.c pvtob.c pvu.c pvup.c pvxpv.c pxp.c refco.c rm2v.c rv2m.c \
rx.c rxp.c rxpv.c rxr.c ry.c rz.c s00a.c s00b.c s00.c \
s06a.c s06.c s2c.c s2p.c s2pv.c s2xpv.c sepp.c seps.c sp00.c \
starpm.c starpv.c sxp.c sxpv.c taitt.c taiut1.c taiutc.c tcbtdb.c \
tcgtt.c tdbtcb.c tdbtt.c tf2a.c tf2d.c tr.c trxp.c trxpv.c tttai.c \
tttcg.c tttdb.c ttut1.c ut1tai.c ut1tt.c ut1utc.c utctai.c utcut1.c \
xy06.c xys00a.c xys00b.c xys06a.c zp.c zpv.c zr.c -o erfa.js