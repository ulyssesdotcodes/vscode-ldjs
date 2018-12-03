function zip(arrs) {
    let shortest = arrs.reduce((acc, p) => acc.length < p.length ? acc : p)
    return shortest.map(function(_, i){
        return arrs.map(function(array){ return array[i]})
    })
}

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
    frag: (fragname, uniforms) => c.top("glslmulti", Object.assign({
            "resolutionw": c.ip(1920), 
            "resolutionh": c.ip(1080),
            "pixeldat": c.datp(c.dat("text", {"file" : c.sp("scripts/Visuals/" + fragname)})),
            "outputresolution": c.mp(9),
            "format": c.mp(4) 
        }, zip([Array(8).fill("uniname"), Array.from(Array(8).keys()), Object.keys(uniforms)]).reduce((acc, v) => { acc[v[0]+v[1]] = c.sp(v[2]); return acc; }, {})
        , zip([Array(8).fill("value"), Array.from(Array(8).keys()), Object.values(uniforms)]).reduce((acc, v) => { acc[v[0]+v[1]] = v[2]; return acc; }, {}))),
    adata: (v) => visuals(c).atex().connect(visuals(c).frag('audio_data.frag', {'i_volume': c.x4p(v)})),
    noiset: (t) => c.top("noise", {"t": c.xyzp(c.fp(0), c.fp(0), t)}),
    lines: (spacing, width) => visuals(c).frag("lines.frag", {"i_spacing": c.x4p(spacing), "i_width": c.x4p(width)}),
    shapes: (size, width, sides) => visuals(c).frag("shapes.frag", {"i_size": c.x4p(size), "i_width": c.x4p(width), "i_sides": c.x4p(sides)}),
    stringtheory: (time, angle, angle_delta, xoffset) =>
        visuals(c).frag("string_theory.frag", 
            { 
                "i_time": c.x4p(time), 
                "i_angle": c.x4p(angle), 
                "i_angle_delta": c.x4p(angle_delta === undefined ? c.fp(0.4) : angle_delta), 
                "i_xoff": c.x4p(xoffset === undefined ? c.fp(0) : xoffset)
            }),
    commandCode: (text) => c.top("text", {
        "resolutionw": c.ip(1920), 
        "resolutionh": c.ip(1080), 
        "fontsizey": c.fp(16), 
        "alignx": c.mp(0),
        "aligny": c.mp(0),
        "text": c.sp(text)
    })


})
//export const rect = (c) => c.tope("rectangle")
module.exports = visuals