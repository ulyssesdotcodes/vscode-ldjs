let visuals = require('libs/oscillare.ldjs.js')
let vc = visuals(c)

let audioin = c.chop("audiodevicein")

// let volume = 
//     audioin.c(c.chop("analyze", { function: c.mp(6), }))
//         .c(c.chop("math", { gain: c.fp(8) }))

// let volspeed = volume.c(c.chop("speed"))

let instanceNum = 32

let instanceainy =
    audioin.c(c.chop("resample", {
        method: c.mp(0),
        end:  c.fp(instanceNum),
        endunit: c.mp(1),
        timeslice: c.tp(false) ,
        relative: c.mp(0),
        method: c.mp(3),
    }))
    .c(c.chop("math", {
        gain:c.fp(20)
    }))
    .c(c.chop("rename", {
        renameto: c.sp("ty"),
    }))


let instancesx = c.chop("wave", {
    wavetype: c.mp(4),
    end: c.fp(instanceNum),
    endunit: c.mp(1),
    amp: c.fp(7),
    offset: c.fp(-0.26) , 
})
    .c(c.chop("rename", {
        renameto: c.sp("tx")
    }))


// let lagvol = volume.c(c.chop("lag", { lag1: c.fp(0.4) }))
// let volumechan = c.chan0(lagvol)

let instances = c.chop("merge").run([instanceainy, instancesx])

// let geometry = c.sop("sphere")
//     .c(c.sop("transform", {
//         scale: volumechan,
//     }))

// let render = vc.renderEasy(geometry, instances, {
//     r: c.xyzp(c.fp(0), c.fp(0), c.multp(c.chan0(volspeed), c.fp(100)))
// })

// let instances = c.chop("constant", {value0: c.fp(1)})

let geometry = c.sop("sphere")

let render = vc.renderEasy(geometry, instances, {})
 
let n = vc.sidebyside([c.top("videodevicein"), c.top("videodevicein", {
    device: c.sp("V1|||0x8020000005ac8514|||1|||0|||FaceTime HD Camera")
})])

n = render


return [n.connect(c.top("out")).out()]