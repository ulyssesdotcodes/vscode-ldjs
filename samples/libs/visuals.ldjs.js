const visuals = (c) => ({
    ain: (g) => c.chope("audiodevicein")
        .connect(c.chop("resample", {"timeslice": c.tp(false), "method": c.mp(0), "relative": c.mp(0), "end": c.fp(0.03)}))
        .connect(c.chop("math", {"gain": c.fp(g)})),
    aine: () => visuals(c).ain(1),
    atex: () => c.top("chopto", {"chop": c.chopp(visuals(c).aine())}),
    aspect: () => c.chope('audiodevicein').connect(c.chope('audiospectrum', {})),
    aspecttex: () => c.top("chopto", {"chop": c.chopp(visuals(c).aspect())}),
    analyze: (i) => c.chop('analyze', {"function": c.mp(i)}),
    vol: () => visuals(c).aine().connect(visuals(c).analyze(6)),
    volc: () => c.chan(c.ip(0), visuals(c).vol()),
    lowPass: () => c.chop("audiofilter", {"filter": c.mp(0)}),
    lowv: () => visuals(c).aine().connect(visuals(c).lowPass()).connect(visuals(c).analyze(6)),
    lowvc: () => c.chan(c.ip(0), visuals(c).lowv()),
    highPass: () => c.chop("audiofilter", {"filter": c.mp(1)}),
    highv: () => visuals(c).aine().connect(visuals(c).highPass()).connect(visuals(c).analyze(6)),
    highvc: () => c.chan(c.ip(0), visuals(c).highv()),
    bandPass: (b) => c.chop("audiofilter", {"filter": c.mp(2), "cutofflog": c.multp(b, c.fp(4.5))}),
    bandv: (b) => visuals(c).aine().connect(visuals(c).bandPass(b)).connect(visuals(c).analyze(6)),
    bandvc: (b) => c.chan(c.ip(0), visuals(c).bandv(b)),
    mchan: (chan) => c.chan(c.sp(chan), c.chope("midiinmap")),
    mchop: (chan) => c.chope("midiinmap").connect(c.chop("select", {"channames": c.sp(chan)})),
    frag: (fragname, uniforms) => c.top("glslmulti", {
            "resolution": c.whp(c.np(1920), c.np(1080)),
            "pixeldat": c.datp(c.dat("text", {"file" : c.sp("scripts/Visuals/" + fragname)})),
            "outputresolution": c.mp(9),
            "format": c.mp(4)
        })
})
//export const rect = (c) => c.tope("rectangle")
module.exports = visuals