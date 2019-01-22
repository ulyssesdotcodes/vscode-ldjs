let visuals = require('libs/oscillare.ldjs.js')
let vc = visuals(c)

let pal = vc.tealblue

// vc.lowv(c.fp(3)).c(c.chop("lag", {lag2: c.fp(0.2)}))

let outer = c.sop("torus", {
    rows: c.ip(32),
    cols: c.ip(32),

})
    // .c(c.sop("transform", {s: vc.cxyzp(c.chan0(vc.lowv().c(vc.lagdown(c.fp(0.2)))))}))

let scale = c.chop("math",{chopop: c.mp(3), 

}).run([vc.sinC(c.fp(1024), c.fp(0.5), c.fp(1)), vc.const1(c.fp(0.05))])
// c.chop("wave", {amp: c.fp(0.1), })

let cam = visuals(c).centerCam(c.fp(5), c.xyzp(c.fp(-30), visuals(c).secs(c.fp(30)), c.fp(0)))

let outerc = 
    c.chop("math", {chopop: c.mp(1), align: c.mp(7)}).run([
        c.chop("sopto", {sop: c.sopp([outer.runT()])}),
        c.chop("noise", {type: c.mp(0), t: c.xyzp(c.fp(0), c.fp(0), vc.secs(c.fp(30)))})
    ])

let lightsdim = c.chop("wave", {
        period: c.multp(c.fp(10), vc.mchan("s2a")),
        wavetype: c.mp(6),
        offset: c.fp(1),
        amp: c.fp(0.5),
    }).c(c.chop("timeslice"))

let n1 = vc.shapes(c.fp(3), c.fp(0.1), c.fp(0.2)).c(vc.repeatTxy(c.fp(20)))
let n2 = 
    //vc.torusGeo(c.sop("sphere").runT(), vc.adata(c.fp(1)).c(vc.palettemap(vc.bnw, vc.secs(c.fp(1)))))
    vc.multops([
        // vc.lines(c.fp(0.5), vc.volc()),
        vc.geoGeo(c.sop("sphere"), outerc, scale, cam, vc.adata(c.fp(1)).c(vc.palettemap(vc.bnw, c.fp(0.45))))
            .c(c.top("resolution",  {outputresolution: c.mp(9), resolutionw: c.ip(1920), resolutionh: c.ip(1080)}))
    ])
    // vc.overops([
    //     vc.flocking(c.fp(1), vc.volc(c.fp(8)), vc.lowvc(c.fp(8)))
    //         .c(c.top("blur", {size: c.ip(16)}))
    // ])
    //     .c(vc.fade(c.fp(0.97)))
let lightcode = 
    vc.addops([
        vc.commandcode(CommandCode),
        vc.adata(c.fp(0.3))
            .c(vc.rotate(vc.secs(c.fp(80))))
            .c(vc.littleplanet())
            .c(vc.scale(c.fp(0.5)))
            .c(vc.mosaic(vc.secs(c.fp(1)), c.fp(40)))
            .c(vc.translatex(c.fp(0.2)))
            .c(vc.translatey(c.fp(0.2)))
            .c(vc.mirrorx())
            .c(vc.mirrory())
            .c(vc.edgesc(c.fp(0.8)))
            .c(vc.palettecycle(pal, vc.secs(c.fp(3))))
            .c(vc.fade(c.fp(0.9)))
            .c(vc.strobe(c.fp(4)))
            .c(vc.fade(c.fp(0.2)))
            .c(vc.val(c.fp(0)))
])


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

// vc.const1(c.fp(1))
dmxes = dmxes.map(d => vc.dimdmx(dimmer, d))

return [n.connect(c.top("out")).out()]