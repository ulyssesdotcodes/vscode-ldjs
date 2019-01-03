let visuals = require('libs/oscillare.ldjs.js')

let clear = c.top("rectangle")


let vc = visuals(c)

let vol = visuals(c).vol(c.fp(2))
  .connect(c.chop("lag", {lag2: c.fp(0)}))

let sizex = c.chan(c.ip(0), vol)
let sizey = c.modp(c.seconds, c.fp(0.2))
let size = c.xyp(sizex, sizey)

let audiotop = c.top("chopto", { 
  chop: c.chopp([vc.ain(c.fp(0.9)).runT()]), 
  resolutionw: c.ip(1920), 
  resolutionh: c.ip(1080),
  "outputresolution": c.mp(9),
})

let rect = c.top("rectangle", { size })

let n = c.top("composite", { operand: c.mp(0) }).run([
  audiotop.runT(),
  rect.runT()
])

return [n.connect(c.top("out")).out()]