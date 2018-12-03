let visuals = require('libs/visuals.ldjs.js');

// let lines = (spacing, width) => visuals(c).frag("lines.frag", {"i_spacing": c.x4p(spacing), "i_width": c.x4p(width)})

// let shapes = (size, width, sides) => visuals(c).frag("shapes.frag", {"i_size": c.x4p(size), "i_width": c.x4p(width), "i_sides": c.x4p(sides)})

// let stringtheory = (time, angle, angle_delta, xoffset) =>
//     visuals(c).frag("string_theory.frag", 
//         { 
//             "i_time": c.x4p(time), 
//             "i_angle": c.x4p(angle), 
//             "i_angle_delta": c.x4p(angle_delta === undefined ? c.fp(0.4) : angle_delta), 
//             "i_xoff": c.x4p(xoffset === undefined ? c.fp(0) : xoffset)
//         })

let commandCode = (text) => c.top("text", {
    "resolutionw": c.ip(1920), 
    "resolutionh": c.ip(1080), 
    "fontsizey": c.fp(16), 
    "alignx": c.mp(0),
    "aligny": c.mp(0),
    "text": c.sp(text)
})

return n({CommandCode}).out()