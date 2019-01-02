let visuals = require('libs/visuals.ldjs.js');

let i = 6;

let vc = visuals(c)

let clear = c.top("rectangle")

let sinct = (t, i, w) => c.cc((inputs) => 
    vc.multops([
        c.top("chopto", {"chop": 
            c.chopp([vc.sinC(i, t , w)])}).runT()
    ].concat(inputs)))

let tapbeat = (i, g) => {
  let beat = visuals(c).const1(i).c(c.chop("logic", {preop: c.ip(5)}))
  let beathold = c.chop("hold").run([
          c.chop("speed").run([visuals(c).const1(c.fp(1)), beat])
                .c(c.chop("delay", {delay: c.fp(1), delayunit: c.mp(1)})), 
        beat].c(c.chop("null", {cooktype: c.mp(2)})))
  let beattrail = 
        c.chop("trail", {
                wlength: c.fp(8), 
                wlengthunit: c.mp(1), 
                capture: c.mp(1)}).run([beathold])
        .c(c.chop("delete", {
                delsamples: c.tp(true), 
                condition: c.mp(5),  
                inclvalue1:c.bp(false)}))
  let bps = c.chop("math", {postop: c.mp(5), gain: g})
        .c(c.chop("analyze", {function: c.mp(1)}).run(beatrail))
  let beataccum = c.chop("speed").run([bps, beat])
  let finalbeat = 
        beataccum 
            .c(c.chop("limit", {
              max: c.fp(1), 
              type: c.mp(2), 
              min: c.fp(0)})) 
            .c(c.chop("logic", {
              boundmax: c.fp(0.08), 
              preop: c.mp(5), 
              convert: c.mp(2)}))
  return {beatpulse: finalbeat, bps: bps}
}

// tapbeatm9 = tapbeat((mchan("b9"), (c.powp(c.fp(2), (c.floor(c.multp(c.subp(mchan("s1a"), c.fp(0.5)), c.fp(4)))
// // tapbeatm9sec = beatseconds tapbeatm9

// // beatramp :: Beat -> Tree CHOP
// beatramp beat = c.chop("speed", {resetcondition: c.mp(2)}).run([beat.bps, beat.beatpulse])

// beatxcount :: Float -> Tree CHOP -> Beat -> Tree CHOP
// beatxcount x reset (Beat beat _) = countCHOP ((countCHOPoutput ?~ int 1) . (countCHOPlimitmax ?~ float (x - 1))) [beat, reset]

// beatxpulse :: Float -> Tree CHOP -> Beat -> Tree CHOP
// beatxpulse x reset = logicCHOP (logicCHOPpreop ?~ int 6) . (:[]) . beatxcount x reset

// beatxramp :: Float -> Tree CHOP -> Beat -> Tree CHOP
// beatxramp x reset beat@(Beat bpulse bps) = speedCHOP id [bps & mathCHOP (mathCHOPgain ?~ float (1/x)) . (:[]), beatxpulse x reset beat]

// beatseconds :: Beat -> Tree Float
// beatseconds b = seconds !* (chan0f $ bps b)

// beatsecondschop :: Beat -> Tree CHOP
// beatsecondschop b = speedCHOP id [bps b]

let n = //vc.render(c.sope("sphere").connect(vc.geo()))
//     vc.adata(c.fp(2))
    vc.addops([
    vc.adata(c.fp(2))
//     vc.flocking(c.fp(1), vc.volc(), c.fp(3))
//     vc.torusGeo(c.sop("sphere"), vc.adata(c.fp(1)))
//     vc.torusGeo(c.sop("sphere"))
//         .c(vc.fade(c.fp(0.9)))
    .c(vc.val(c.fp(1)))
//     .c(sinct(vc.secs(c.fp(0.2)), vc.volc(c.fp(200)), c.fp(0)))
    .c(vc.palettecycle(vc.purplish, vc.secs(c.fp(1))))
//     .c(vc.mosaic(vc.secs(c.fp(1)), c.fp(50)))
    .c(vc.sat(c.fp(5)))
//     .c(vc.val(vc.volc(c.fp(10))))
//     .c(vc.edgesc(vc.volc(c.fp(4))))
    .c(vc.val(c.fp(0.4)))
//     .c(vc.fade(vc.mchan("s1")))
    .c(vc.fade(c.fp(0.98))),
    vc.commandcode({CommandCode}),
    ])

return n.connect(c.tope("out")).out();