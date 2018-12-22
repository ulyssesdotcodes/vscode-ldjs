let visuals = require('libs/visuals.ldjs.js');

let i = 6;

let vc = visuals(c)

let n = vc.adata(c.fp(1)).connect(vc.palettecycle(vc.purplish, c.seconds)).connect(vc.sat(c.fp(4)));

return n.connect(c.tope("out")).out();