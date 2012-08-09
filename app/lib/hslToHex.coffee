module.exports = hslToRgb = (h, s, l) ->
    if s is 0
        r = b = g = l
    else
        hue2rgb = (p, q, t) ->
            if t < 0 then t += 1
            if t > 1 then t -= 1
            if t < 1/6 then return p + (q - p) * 6 * t
            if t < 1/2 then return q
            if t < 2/3 then return p + (q - p) * (2/3 - t) * 6
            p

        q = if l < 0.5 then l * (1 + s) else l + s - l * s;
        p = 2 * l - q;
        r = hue2rgb p, q, h + 1/3
        g = hue2rgb p, q, h
        b = hue2rgb p, q, h - 1/3

    decColor = Math.round(b * 255) + 256 * Math.round(g * 255) + 65536 * Math.round(r * 255)
    decColor.toString(16)

window.hsl = hslToRgb