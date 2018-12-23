let visuals = require('libs/visuals.ldjs.js');

let i = 6;

let vc = visuals(c)

// let n = palette(vc.tealcontrast)
let n = 
    vc.adata(c.fp(1))
        .connect(vc.palettemap(vc.darkestred, c.multp(c.fp(0.1), c.seconds)))
        .connect(vc.sat(c.fp(4)));

// palettemap' f p@(Palette _ o) t = frag' f "palette_map.frag" [("uOffset", xV4 o), ("uSamples", xV4 $ float 16)] [t, palette p]

// palettemap = palettemap' id

return n.connect(c.tope("out")).out();