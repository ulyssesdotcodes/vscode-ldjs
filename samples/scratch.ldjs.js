let visuals = require('libs/visuals.ldjs.js');

let i = 6;

let vc = visuals(c)

let clear = c.tope("rectangle")


// let spiralGeo = (inst, speed, sop) => {
//     let sgeo = sop.connect(vc.geo({
//         material: c.matp(c.mat("wireframe")), 
//         uniformScale: c.fp(0.1),
//         instanceop: c.chopp(poses),
//         instancing: c.tp(true),
//         instancetx: c.sp("tx"),
//         instancety: c.sp("ty"),
//         instancetz: c.sp("tz"),
//         instancerx: c.sp("rx"),
//         instancery: c.sp("ry"),
//         instancerz: c.sp("rz"),
//         instancesx: c.sp("sx"),
//         instancesy: c.sp("sy"),
//         instancesz: c.sp("sz"),
//     }))
//     let tx = c.chop("wave", {
//         channelname: c.sp("tx"), 
//         end: instances,
//         endunit: c.mp(1),
//          $ ocos 
//         (castf sampleIndex !* float 60 !+ instanceIter 0.2) !* ((instanceIter 10 !* float 0.1) !+ float 4)
//     let ty = waveC' (waveCNames ?~ str "ty") instances $ osin (castf sampleIndex !* float 60 !+ instanceIter 0.2) !* ((instanceIter 10 !* float 0.1) !+ float 4)
//     let tz = waveC' (waveCNames ?~ str "tz") instances $ instanceIter 10 !* float 1 !- float 50
//     let poses = c.chop("merge", {align: c.mp(7)}).run([tx, ty, tz].map((r) => r.runT()))
//     let instanceIter n = (castf sampleIndex !+ (speed !* float n) !% castf instances)
//     let centerCam t r = cam' ((camTranslate .~ t) . (camPivot .~ v3mult (float (-1)) t) . (camRotate .~ r))
//     return vc.render(sgeo);
//     //   (centerCam (v3 (float 0) (float 0) (float 5)) emptyV3)
// }

let sinct = (t, i, w) => c.cc((inputs) => 
    vc.multops([
        c.top("chopto", {"chop": 
            c.chopp(sinC(i, t , w))}).runT()
    ].concat(inputs)))


let n = //vc.render(c.sope("sphere").connect(vc.geo()))
    // vc.adata(c.fp(1))
    vc.lineLines(c.fp(4), c.fp(4), c.fp(32), c.sope("sphere"))
        .c(vc.fade(c.fp(0.9)))
    // .c(vc.val(c.fp(1)))
    // .c(sinct(vc.secs(c.fp(0.2)), vc.volc(c.fp(200)), c.fp(0)))
    // .c(vc.palettecycle(vc.neon, vc.secs(c.fp(1))))
    // .c(vc.mosaic(vc.secs(c.fp(1)), c.fp(50)))
    // .c(vc.sat(c.fp(5)))
    // .c(vc.val(vc.volc(c.fp(10))))
    // .c(vc.edgesc(vc.volc(c.fp(4))))
    // .c(vc.val(c.fp(0.2)))
    // .c(vc.fade(c.fp(0.97)))

return n.connect(c.tope("out")).out();