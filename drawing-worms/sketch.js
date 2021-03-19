import { vec2 } from '../Vec2.js'
import { r } from '../helpers.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const canvasImage = document.querySelector('#image')
const ctxImage = canvasImage.getContext('2d')

const width = document.body.clientWidth
const height = document.body.clientHeight
canvas.width = width
canvas.height = height

const simplex = new SimplexNoise()

const pixel = (x, y) => {
    const pixelData = ctxImage.getImageData(x, y, 1, 1).data

    return {
        r: pixelData[0],
        g: pixelData[1],
        b: pixelData[2],
    }
}

const imgUrl = 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'
const img = new Image()
img.src = imgUrl + '?' + new Date().getTime()
img.setAttribute('crossOrigin', '')

const circles = []

const rnd = (min, max) => {
    return min + Math.random() * (max + 1 - min)
}

const createCircle = (x, y) => {
    circles.push({
        pos: vec2(x, y),
        prevPos: vec2(x, y),
        offset: vec2(0, 0),
        velocity: vec2(0, 0),
    })
}

for (let i = 0; i < 100; i++) {
    createCircle(r(0, width), r(0, height))
}

const update = () => {
    circles.forEach(circle => {
        circle.offset.x += rnd(-0.5, 0.5)
        const nX = simplex.noise2D(circle.offset.x, circle.offset.y) * 10

        circle.offset.y += rnd(-0.5, 0.5)
        const nY = simplex.noise2D(circle.offset.y, circle.offset.x) * 10

        circle.velocity.set(nX, nY)
        circle.prevPos.set(circle.pos)
        circle.pos.add(circle.velocity)
    })
}

const render = () => {
    ctx.lineWidth = 2

    circles.forEach(circle => {
        ctx.beginPath()
        const { r, g, b } = pixel(circle.pos.x, circle.pos.y)
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
        ctx.moveTo(circle.pos.x, circle.pos.y)
        ctx.lineTo(circle.prevPos.x, circle.prevPos.y)
        ctx.stroke()
    })
}

const loop = () => {
    update()
    render()

    requestAnimationFrame(loop)
}

img.onload = () => {
    canvasImage.width = img.width
    canvasImage.height = img.height
    ctxImage.drawImage(img, 0, 0, img.width, img.height)

    requestAnimationFrame(loop)
}
