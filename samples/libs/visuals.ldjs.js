function zip(arrs) {
    let shortest = arrs.reduce((acc, p) => acc.length < p.length ? acc : p)
    return shortest.map(function(_, i){
        return arrs.map(function(array){ return array[i]})
    })
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const compose = (...fns) =>
  fns.reduceRight((prevFn, nextFn) =>
    (...args) => nextFn(prevFn(...args)),
    value => value
  );

let hex = (h) => hexToRgb(h)
let rgb = (r, g, b) => ({ r: r, g: g, b: b })

const visuals = (c) => ({
    ain: (g) => c.chope("audiodevicein")
        .connect(c.chop("resample", {"timeslice": c.tp(false), "method": c.mp(0), "relative": c.mp(0), "end": c.fp(0.03)}))
        .connect(c.chop("math", {"gain": g})),
    aine: (v) => visuals(c).ain(v == undefined ? c.fp(1) : v),
    atex: (v) => c.top("chopto", {"chop": c.chopp(visuals(c).ain(v))}),
    aspect: () => c.chope('audiodevicein').connect(c.chope('audiospectrum', {})),
    aspecttex: () => c.top("chopto", {"chop": c.chopp(visuals(c).aspect().out())}),
    analyze: (i) => c.chop('analyze', {"function": c.mp(i)}),
    vol: (v) => visuals(c).ain(v).connect(visuals(c).analyze(6)),
    volc: (v) => c.chan(c.ip(0), visuals(c).vol(v)),
    lowPass: () => c.chop("audiofilter", {"filter": c.mp(0)}),
    lowv: (v) => visuals(c).ain(v).connect(visuals(c).lowPass()).connect(visuals(c).analyze(6)),
    lowvc: (v) => c.chan(c.ip(0), visuals(c).lowv(v)),
    highPass: () => c.chop("audiofilter", {"filter": c.mp(1)}),
    highv: (v) => visuals(c).ain().connect(visuals(c).highPass()).connect(visuals(c).analyze(6)),
    highvc: (v) => c.chan(c.ip(0), visuals(c).highv()),
    bandPass: (b) => c.chop("audiofilter", {"filter": c.mp(2), "cutofflog": c.multp(b, c.fp(4.5))}),
    bandv: (b, v) => visuals(c).ain(v).connect(visuals(c).bandPass(b)).connect(visuals(c).analyze(6)),
    bandvc: (b, v) => c.chan(c.ip(0), visuals(c).bandv(b)),
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
    adata: (v) => visuals(c).atex(v).connect(visuals(c).frag('audio_data.frag', {'i_volume': c.x4p(c.fp(1))})),
    noiset: (t) => c.top("noise", {"t": c.xyzp(c.fp(0), c.fp(0), t)}),
    lines: (spacing, width) => visuals(c).frag("lines.frag", {"i_spacing": c.x4p(spacing), "i_width": c.x4p(width)}),
    shapes: (sides, size, width) => visuals(c).frag("shapes.frag", {"i_size": c.x4p(size), "i_width": c.x4p(width), "i_sides": c.x4p(sides)}),
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
    }),
    crosshatch: () => visuals(c).frag("crosshatch.frag", {}),
    flowermod: (s) => visuals(c).frag("flower_mod.frag", {"uSeconds": c.x4p(s)}),
    lumidots: () => visuals(c).frag("lumidots.frag", {}),
    mosaic: (t, s) => visuals(c).frag("mosaic.frag", {"uTime" : c.x4p(t), "uScale" : c.x4p(s)}),
    noisedisplace: (t, d) => visuals(c).frag("noise_displace.frag", {"uTime": c.x4p(t), "uDisplacement": c.x4p(d)}),
    transform: (extra) => c.top("transform", extra),
    rotate: (r) => visuals(c).transform({"rotate": r}),
    translate: (x, y) => visuals(c).transform({"t": c.xyp(x, y), "extend": c.mp(3)}),
    translatex: (x) => visuals(c).translate(x, c.fp(0)),
    translatey: (y) => visuals(c).translate(c.fp(0), y),
    val: (v) => c.top("hsvadjust", {"valuemult": v}),
    transformscale: (f, x, y, e) => visuals(c).transform(Object.assign({
        "extend": c.mp(e),
        "s": c.xyp(c.powp(x, c.fp(-1)), c.powp(y, c.fp(-1)))
    }, f)),
    scale: (xy) => visuals(c).transformscale({}, xy, xy, 1),
    rgbsplit: (s) => visuals(c).frag("rgbsplit.frag", {"uFrames": c.x4p(s)}),
    repeatT: (x, y) => transformscale({}, x, y, 3),
    strobe: (s) => visuals(c).frag("strobe.frag", {"uSpeed": c.x4p(s), "uTime": c.x4p(c.seconds)}),

    const1: (v) => c.chop("constant", {"name0": c.sp("const"), "value0": v}),
    constc: (namevals) => c.chop("constant", namevals.reduce(function(map, val, idx) {
        map["name" + idx] = c.sp(val.name)
        map["value" + idx] = c.fp(val.value)
        return map
    }, {})),

    rgbc: (color) => visuals(c).constc([
        {name: "r", value: color.r / 255},
        {name: "g", value: color.g / 255},
        {name: "b", value: color.b / 255}
    ]),
    rgbt: (color) => c.top("chopto", {"chop": c.chopp(visuals(c).rgbc(color).runT()), "dataformat": c.mp(2) }),
    palette: (colors) => 
        c.top("chopto", {
            "chop":
                c.chopp(c.chope("merge")
                    .run(colors.map((col) => visuals(c).rgbc(col).runT()))
                    .connect(c.chop("shuffle", {"method": c.mp(2), "nval": c.ip(3)}))),
            "dataformat": c.mp(2)
        }),

    palettemap: (p, o) => 
        c.insertconn(
            visuals(c).frag("palette_map.frag", {"uOffset": c.x4p(o), "uSamples": c.x4p(c.fp(16))}), 
            [], 
            [visuals(c).palette(p).runT()]),
    palettecycle: (palette, s) => {
        let palettechop = c.chop("cross", {"cross": c.modp(s, c.fp(palette.length))}).run(palette.map((col) => visuals(c).rgbc(col).runT()))
        let palettet = c.top("chopto", {"chop": c.chopp(palettechop), "dataformat": c.mp(2)})
        return c.cc((inputs) => 
            c.top("composite", {"operand": c.mp(27)}).run([palettet.runT()].concat(inputs))
        )
    },

    tealcontrast:[rgb(188, 242, 246), rgb(50, 107, 113), rgb(211, 90, 30), rgb(209, 122, 43), rgb(188, 242, 246)],
    purplish:[rgb(150, 110, 100), rgb(223, 143, 67), rgb(76, 73, 100, ), rgb(146, 118, 133), rgb(165, 148, 180)],
    sunset:[rgb(185, 117, 19), rgb(228, 187, 108), rgb(251, 162, 1), rgb(255, 243, 201)],
    coolpink:[rgb(215, 40, 26), rgb(157, 60, 121), rgb(179, 83, 154), rgb(187, 59, 98)],
    darkestred:[rgb(153, 7, 17), rgb(97, 6, 11), rgb(49, 7, 8), rgb(13, 7, 7), rgb(189, 5, 13)],
    nature:[rgb(63, 124, 7), rgb(201, 121, 66), rgb(213, 101, 23), rgb(177, 201, 80), rgb(180, 207, 127)],
    greenpurple:[rgb(42, 4, 74), rgb(11, 46, 89), rgb(13, 103, 89), rgb(122, 179, 23), rgb(160, 197, 95)],
    tealblue:[rgb(188, 242, 246), rgb(50, 107, 113), rgb(188, 242, 246), rgb(165, 148, 180)],
    neon: ["A9336B", "5F2F88", "CB673D", "87BB38"].map(hexToRgb),
    fire: ["F07F13", "800909", "F27D0C", "FDCF58"].map(hexToRgb),
    buddhist: ["0000FF", "FFFF00", "FF0000", "FFFFFF", "FF9800"].map(hexToRgb),
    flower: ["000E00", "003D00", "E4A900", "FEDEEF", "C99CB8"].map(hexToRgb),
    bluepink: ["F2C6F2", "F8F0F0", "A6D1FF", "3988E1", "4C8600"].map(hexToRgb),
    lime: ["FF4274", "DCD549", "ABDFAB", "437432", "033B45"].map(hexToRgb),

    sat: (s) => c.top("hsvadjust", {"saturationmult": s}),
    edgesc: (original) => c.cc((inputs) => 
        c.top("composite", {"operand": c.mp(0)})
            .run([
                inputs[0].connect(c.tope("edge")), 
                inputs[0].connect(c.top("level", {"opacity": original}))
            ])),
    addops: (nodes) => c.top("composite", { "operand":c.mp(0)}).run(nodes.map((n) => n.runT())),
    multops: (nodes) => c.top("composite", { "operand":c.mp(27)}).run(nodes.map((n) => n.runT())),
    overops: (nodes) => c.top("composite", { "operand":c.mp(31)}).run(nodes.map((n) => n.runT())),
    fadeops: (idx, ops) => c.top("switch", { "blend": c.tp(true), "index": bounce(idx, 0.4)}).run(ops.map(o => o.runT())),
    bounce: (fp, i) => c.absp(c.subp(c.modp(fp, c.fp(i * 2)), c.fp(1))),

    fadeops: (idx, ops) => c.top("switch", { "blend": c.tp(true), "index": bounce(idx, 0.4)}).run(ops.map(o => o.runT())),

    triggercount: (l, f) => f.connect(c.chop("count", {
        "threshold": c.tp(true),
        "threshup": c.fp(0.5),
        "limitmax": c.fp(l),
        "output": c.mp(1)
    })),

    littleplanet: () => visuals(c).frag("little_planet.frag", {}),

    triggerops: (f, inputs) => c.top("switch", {
        "index": c.chan(c.ip(0), visuals(c).triggercount(inputs.length - 1, f))
    }).run(inputs.map((i) => i.runT())),

    fade: (opacity) => c.cc((inputs) => 
        c.feedbackChain(c.cc((fbinputs) => 
            c.top("composite", {"operand": c.mp(0)})
                .run(inputs.concat([
                    c.top("level", {"opacity": opacity}).run(fbinputs)
                ])))).run(inputs)),
    secs: (m) => c.multp(c.seconds, m),
    floor: (f) => c.funcp("math.floor")(f),

    geo: () => c.comp("geometry", {externaltox: c.sp("toxes/Visuals/geo.tox")}),
    rendered: (g) => c.top("render", {
        "lights": c.compp(c.compe("light")),
        "geometry": c.compp(g),
        "camera": c.compp(c.compe("camera"))
    })
})
//export const rect = (c) => c.tope("rectangle")
module.exports = visuals