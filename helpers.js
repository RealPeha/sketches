export const r = (min, max = null) => {
    if (max === null) {
        return Math.floor(Math.random() * (min + 1))
    }

    return Math.floor(min + Math.random() * (max + 1 - min))
}

export const lerp = (start, end, t) => start * (1 - t) + end * t

export const clamp = (number, min, max) => Math.min(Math.max(number, min), max)
