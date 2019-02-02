let dmxes = new Array(16).fill(vc.genericrgbdmx(vc.rgbc(vc.mchan("s2a"), vc.mchan("s2b"), vc.mchan("s2c"))))

dmxes = vc.palettedmxlist(dmxes, pal, vc.secs(c.multp(c.fp(10), vc.mchan("s2b"))))
let dimmer = c.chop("math", {chopop: c.mp(3)}).run([
    vc.mchop("s1c"),
    c.chop("cross", {
    cross: vc.mchan("s1b")
}).run([
    vc.lowv().c(vc.lagdown(c.fp(0.2))),
    lightsdim
])
])
dmxes = dmxes.map(d => vc.dimdmx(dimmer, d))