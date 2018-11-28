let visuals = require('libs/visuals.ldjs.js');

return c.top("rectangle", {"size": c.xyp(visuals(c).mchan("s1a"), c.fp(0.2))}).connect(c.tope('out')).out();