let visuals = require("libs/oscillare.ldjs.js")

let vc = visuals(c)

const adata = vc.adata(c.fp(10))
    .c(vc.flowermod(vc.secs(c.fp(1))))
    .c(vc.scale(c.modp(vc.lowvc(c.fp(40)), c.fp(10))))
    .c(vc.fade(c.fp(0.97)))
    .c(vc.edgesc(c.fp(0)))
    .c(vc.palettemap(vc.neon, vc.lowvsc(c.fp(10))))

const flock = vc.flocking(c.fp(1), vc.volsc(c.fp(0.6)), vc.volsc(c.fp(10)))
        .c(vc.strobe(c.addp(c.modp(vc.secs(c.fp(5)), c.fp(0.5)), c.fp(0.5))))

// const cube = vc.geogeo()

const noiset = vc.noiset(vc.secs(c.fp(0.1)))
    .c(vc.scale(c.fp(0.5)))

const output = vc.multops([
    c.top("lumablur").run([
        adata,
        noiset
    ])
])
// .c(vc.fade(c.fp(0.97)))

// const mytext = vc.fullscreentext(vc.textdat("Gonna livecode some stuff for you", c.ip(1)))
//     .c(vc.translatee(c.fp(0.12), c.fp(-0.4), 1));

n = vc.overops([
    vc.changestop(`Changes`),
    output,
    // mytext
])

//n = c.top("rectangle")

return [n.connect(c.top("out")).out()]