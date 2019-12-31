
let vc = visuals(c)

let instanceop = c.sop("sphere")

let dim = 4
let dimi = c.ip(dim)
let dimf = c.fp(dim)

// let sinwave = c.chop("wave", {
//     wavetype: c.mp(1),
//     // offset: c.fp(1)
// })

// let swc = c.chan0(sinwave);

let parentchop = c.chop("sopto", {
    sop: c.sopp([c.sop("box", {
    divsx: dimi ,
    divsy: dimi ,
    divsz: dimi ,
    dodivs: c.tp(true) ,
        s: c.fp(2) ,
    })
    .c(c.sop("transform", {
        r: c.xyzp(c.multp(c.fp(20), vc.secs(c.fp(0.5))), c.fp(45),c.fp(0))
    }))
]),
}).c(vc.runop(c.chop("math", { chopop: c.mp(1), align: c.mp(2), }), 
    c.chop("noise", {
        channelname: c.sp("tx ty tz") ,
        amp: c.multp(c.fp(1), c.fp(2)),
        right: c.mp(2),
    })
    .c(c.chop("trim", {
    relative: c.mp(0),
    start: c.fp(0),
    end: c.fp(0)
    }))
))


let scale = parentchop
    .c(vc.runop(c.chop("math", { chopop: c.mp(2), align: c.mp(7), }), 
        c.chop("noise", {
            channelname: c.sp("tx ty tz"),
            timeslice: c.tp(true),
            amp: c.fp(2)
        })
    ))
    .c(c.chop("function", {  func: c.mp(1), }))
    .c(c.chop("math", { chanop: c.mp(1), }))
    .c(c.chop("math", {  gain: c.fp(0.05) , }))




let cam = c.comp("camera")

let lightmap = vc.noiset(vc.secs(c.fp(1)))
    .c(vc.palettemap(vc.buddhist, vc.secs(c.fp(0.4))))
    .c(vc.val(c.fp(0.2)))

let render = vc.geoGeo(instanceop, parentchop, scale, cam, lightmap)
    .c(vc.val(c.fp(3)))

// let clampoffset = (off, t) => c.multp(vc.floor(c.divp(c.modp(t, c.fp(1)), off)), off)
// let translatex = (t, clamp) => c.top("transform", {
//     t: c.xyp(c.multp(vc.floor(c.divp(c.modp(t, c.fp(1)), clamp)), clamp), c.fp(0)),
//     extend: c.mp(2),
// })


// commandcode = c.top("rectangle")