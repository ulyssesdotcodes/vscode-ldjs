let visuals = require('libs/visuals.ldjs.js');

let i = 6;

let vc = visuals(c)

let n = 
    vc.adata(c.fp(1))
        .connect(vc.edgesc(c.fp(2)))
        .connect(vc.palettemap(vc.tealcontrast, c.seconds));

return n.connect(c.tope("out")).out();