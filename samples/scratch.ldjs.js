let visuals = require('libs/visuals.ldjs.js');

let i = 6;

let vc = visuals(c)

let clear = c.tope("rectangle")

let n = vc.rendered(c.sope("sphere").connect(vc.geo()))

    // vc.overops([
    //     vc.adata(c.fp(1)).connect(vc.mosaic(c.seconds, c.fp(30)))
    //         .c(vc.translatey(secs(c.fp(1))))
    //         .c(vc.palettemap(vc.tealcontrast, secs(c.fp(3))))
    //         .c(vc.val(c.fp(0.2)))
    //     , vc.shapes(c.fp(3), c.fp(0.2), c.fp(0.2))
    //         .c(vc.noisedisplace(c.seconds, c.multp(c.fp(10), vc.lowvc())))
    //         .c(vc.palettecycle(vc.darkestred, secs(c.fp(0.4))))
    //         .c(vc.val(c.fp(0.7)))
    //         .c(vc.edgesc(c.fp(0.7)))
    // ])
    // .c(vc.fade(c.fp(0.4)))

return n.connect(c.tope("out")).out();