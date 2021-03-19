import { vec2 } from '../Vec2.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const width = document.body.clientWidth
const height = document.body.clientHeight
canvas.width = width
canvas.height = height

const pixelSize = 10
const text = 'Text'

const textCanvas = document.createElement('canvas')
const textCtx = textCanvas.getContext('2d')
textCanvas.width = document.body.clientWidth
textCanvas.height = 30
textCtx.font = '30px sans-serif'
textCtx.fillText(text, 0, textCanvas.height)

const gravity = vec2(0, 1)

const getPixel = (x, y) => {
    const pixelData = textCtx.getImageData(x, y, 1, 1).data

    return {
        r: pixelData[0],
        g: pixelData[1],
        b: pixelData[2],
        o: pixelData[3],
    }
}

const pixels = []

const createPixel = (x, y, expectedPos) => {
    pixels.push({
        pos: vec2(x, y),
        expectedPos,
    })
}

let y = 0

const next = () => {
    setTimeout(() => {
        for (let x = 0; x < textCtx.measureText(text).width; x++) {
            const { o: opacity } = getPixel(x, y)

            if (opacity > 180) {
                createPixel(x, -pixelSize, vec2(x, y))
            }
        }

        y++

        if (y < textCanvas.height) {
            next()
        }
    }, 50)
}

next()

const update = () => {
    pixels.forEach(pixel => {
        const dist = pixel.expectedPos.y - pixel.pos.y

        if (dist > 0) {
            pixel.pos.add(gravity)
        }
    })
}

const render = () => {
    pixels.forEach(pixel => {
        ctx.fillRect(
            pixel.pos.x * pixelSize,
            pixel.pos.y * pixelSize,
            pixelSize,
            pixelSize,
        )
    })
}

const loop = () => {
    ctx.clearRect(0, 0, width, height)

    update()
    render()

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
