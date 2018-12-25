let visuals = require('libs/visuals.ldjs.js');

let i = 6;

let vc = visuals(c)

let clear = c.tope("rectangle")

let sinC = (i, phase, off) => c.chop("wave", {"channelname": c.sp("rz"), "end": i, "endunit": c.mp(1), phase, offset: off})
let scaleC = (i, n) => c.chop("wave", {
    names: c.sp("sx"), 
    "end" : i, 
    "endunit": c.mp(1), 
    "wavetype": c.mp(4), 
    "period": i, 
    "amplitude": n
})

//  let sidesTorus = (sides, scale) => c.sop("torus", {
//      orientation: c.np(2),
//      rows: c.np(10),
//       (torusColumns ?~ sides) . (torusRadius .~ v2 (scale !* float 1) (scale !* float 0.5)))

//  lineLines width scale inst sop =
//    let
//      instances = casti inst !+ int 2
//    in
//      lineGeo (mathCHOP (mathCHOPgain ?~ scale) [ain]) (sinC instances) (scaleC instances $ float 0.1) (scaleC instances $ float 0.1) sop width instances wireframeM

//  lineGeo ty rz sx sy sop width instances mat =
//    let
//      ain = mathCHOP (mathCHOPgain ?~ float 10) [audioIn]
//      sgeo = instanceGeo' ((geoMat ?~ mat)) poses (outS $ sop)
//      poses = mergeC' (mergeCAlign ?~ int 7) [tx, ty', rz & renameC (str "rz"), sx & renameC (str "sx"), sy & renameC (str "sy")]
//      tx = waveC' (waveCNames ?~ str "tx") instances $ ((castf (sampleIndex !* casti width !* int 2)) !/ castf instances) !- width
//      ty' = ty & resampleC' ((resampleEnd ?~ instances) . (resampleRate ?~ instances)) False & renameC (str "ty")
//      centerCam t r = cam' ((camTranslate .~ t) . (camPivot .~ v3mult (float (-1)) t) . (camRotate .~ r))
//      volume = analyze (int 6) ain
//      volc = chan0f volume
//    in
//      render [sgeo] (centerCam (v3 (float 0) (float 0) (float 50)) emptyV3)

//  spiralGeo inst speed sop =
//    let
//      sgeo = instanceGeo' ((geoMat ?~ wireframeM) . (geoUniformScale ?~ float 0.1)) poses (outS $ sop)
//      instances = casti $ inst
//      poses = mergeC' (mergeCAlign ?~ int 7) [ty, tx, tz]
//      instanceIter n = (castf sampleIndex !+ (speed !* float n) !% castf instances)
//      tx = waveC' (waveCNames ?~ str "tx") instances $ ocos (castf sampleIndex !* float 60 !+ instanceIter 0.2) !* ((instanceIter 10 !* float 0.1) !+ float 4)
//      ty = waveC' (waveCNames ?~ str "ty") instances $ osin (castf sampleIndex !* float 60 !+ instanceIter 0.2) !* ((instanceIter 10 !* float 0.1) !+ float 4)
//      tz = waveC' (waveCNames ?~ str "tz") instances $ instanceIter 10 !* float 1 !- float 50
//      centerCam t r = cam' ((camTranslate .~ t) . (camPivot .~ v3mult (float (-1)) t) . (camRotate .~ r))
//    in
//      render [sgeo] (centerCam (v3 (float 0) (float 0) (float 5)) emptyV3)




let n = //vc.rendered(c.sope("sphere").connect(vc.geo()))
    vc.multops([
    c.top("chopto", {"chop": c.chopp(sinC(c.fp(100), vc.secs(c.fp(0.3)), c.fp(0.9)))})
    , vc.noiset(vc.secs(c.fp(0.5)))
        .c(vc.val(c.fp(0.1)))
])
    .c(vc.palettecycle(vc.neon, vc.secs(c.fp(1))))
    .c(vc.mosaic(vc.secs(c.fp(1)), c.fp(30)))
    .c(vc.sat(c.fp(5)))
    .c(vc.val(vc.volc(c.fp(10))))
    .c(vc.edgesc(vc.volc(c.fp(4))))
    .c(vc.val(c.fp(0.2)))
    .c(vc.fade(c.fp(0.98)))

return n.connect(c.tope("out")).out();