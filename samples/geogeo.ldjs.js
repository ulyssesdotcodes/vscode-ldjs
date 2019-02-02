let outer = c.sop("torus", {
    rows: c.ip(32) ,
    cols: c.ip(32) ,
})

let outerc = c.chop("sopto", {
    sop: c.sopp([outer]),
})

let scale = vc.const1(c.fp(1))

let cam = visuals(c).centerCam(c.fp(5), c.xyzp(c.fp(-30), visuals(c).secs(c.fp(30)), c.fp(0)))

let lightmap = vc.adata(c.fp(1))

let n = vc.geoGeo(c.sop("sphere"), outerc, scale, cam, lightmap)