let visuals = require("libs/oscillare.ldjs.js")

let vc = visuals(c)

// let instanceop = c.sop("sphere")

// let dim = 4
// let dimi = c.ip(dim)
// let dimf = c.fp(dim)

// let sinwave = c.chop("wave", {
//     wavetype: c.mp(1),
//     // offset: c.fp(1)
// })

// let swc = c.chan0(sinwave);

// let parentchop = c.chop("sopto", {
//     sop: c.sopp([c.sop("box", {
//     divsx: dimi ,
//     divsy: dimi ,
//     divsz: dimi ,
//     dodivs: c.tp(true) ,
//     s: c.fp(2) ,
//     })
//     .c(c.sop("transform", {
//         r: c.xyzp(c.multp(c.fp(20), vc.secs(c.fp(0.5))), c.fp(45),c.fp(0))
//     }))
// ]),
// }).c(vc.runop(c.chop("math", { chopop: c.mp(1), align: c.mp(2), }), 
//     c.chop("noise", {
//         channelname: c.sp("tx ty tz") ,
//         amp: c.multp(c.fp(1), c.fp(2)),
//         right: c.mp(2),
//     })
//     .c(c.chop("trim", {
//     relative: c.mp(0),
//     start: c.fp(0),
//     end: c.fp(0)
//     }))
// ))


// let scale = parentchop
//     .c(vc.runop(c.chop("math", { chopop: c.mp(2), align: c.mp(7), }), 
//         c.chop("noise", {
//             channelname: c.sp("tx ty tz"),
//             timeslice: c.tp(true),
//             amp: c.fp(2)
//         })
//     ))
//     .c(c.chop("function", {  func: c.mp(1), }))
//     .c(c.chop("math", { chanop: c.mp(1), }))
//     .c(c.chop("math", {  gain: c.fp(0.1) , }))




// let cam = c.comp("camera")

// let lightmap = vc.noiset(vc.secs(c.fp(1)))
// .c(vc.palettemap(vc.buddhist, vc.secs(c.fp(0.4))))
// .c(vc.val(c.fp(0.2)))

// let render = vc.geoGeo(instanceop, parentchop, scale, cam, lightmap)
//     .c(vc.val(c.fp(3)))

// let clampoffset = (off, t) => c.multp(vc.floor(c.divp(c.modp(t, c.fp(1)), off)), off)
// let translatex = (t, clamp) => c.top("transform", {
//     t: c.xyp(c.multp(vc.floor(c.divp(c.modp(t, c.fp(1)), clamp)), clamp), c.fp(0)),
//     extend: c.mp(2),
// })

let changes = c.dat("table", {}, [], null, `Changes`)
let removed = 
    changes.c(c.dat("select", { extractrows: c.mp(5), rownames: c.sp("removed"), extractcols: c.mp(2), colindexstart: c.ip(1)}))
        .c(c.dat("convert", { how: c.mp(0) }))
let added = 
    changes.c(c.dat("select", { extractrows: c.mp(5), rownames: c.sp("added"), extractcols: c.mp(2), colindexstart: c.ip(1)}))
        .c(c.dat("convert", { how: c.mp(0) }))

let removedtop = vc.multops([
    c.top("constant", { color: c.rgbp(c.fp(1), c.fp(0), c.fp(0)) }),
    vc.removed(`Changes`)
]).c(vc.translatey(c.fp(-0.3)))

let addedtop = vc.multops([
    c.top("constant", { color: c.rgbp(c.fp(0), c.fp(1), c.fp(0)) }),
    vc.added(`Changes`)
]).c(vc.translatey(c.fp(0.3)))

let test = c.top("rectangle")  
    .c(c.top("edge"))
    
// commandcode = c.top("rectangle")

n = vc.addops([
    removedtop,
    addedtop
    // c.top("lumablur").run([render.c(vc.fade(c.fp(0.7))), c.top("noise")]), 
    // vc.lines(swc, c.fp(0.5)).c(vc.translatexclamp(vc.secs(c.fp(2)), c.fp(0.125))),
])

//n = c.top("rectangle")

return [n.connect(c.top("out")).out()]