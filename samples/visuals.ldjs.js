const visuals = (c) => ({
    ain: (g) => c.chope("audiodevicein")
        .connect(c.chop("resample", {"timeslice": c.tp(false), "method": c.mp(0), "relative": c.mp(0), "end": c.fp(0.03)}))
        .connect(c.chop("math", {"gain": c.fp(g)})),
    aine: () => visuals(c).ain(1),
    atex: () => c.top("chopto", {"chop": c.chopp(visuals(c).aine())}),
    aspect: () => c.chope('audiodevicein').connect(c.chope('audiospectrum', {})),
    aspecttex: () => c.top("chopto", {"chop": c.chopp(visuals(c).aspect())}),
    analyze: (i) => c.chop('analyze', {"function": c.mp(i)}),
    volume: () => visuals(c).ain.connect(visuals(c).analyze(6))
})
//export const rect = (c) => c.tope("rectangle")
module.exports = visuals