import { vec2 } from '../Vec2.js'
import { r as random } from '../helpers.js'

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

const mouse = vec2(0, 0)
let circles = []
let drawCircles = false

const rnd = (min, max) => {
    return min + Math.random() * (max + 1 - min)
}

const createCircle = (x, y) => {
    circles.push({
        pos: vec2(x, y),
        offset: vec2(0, 0),
        velocity: vec2(0, 0),
        radius: random(10, 15),
    })
}

canvas.addEventListener('mousemove', e => {
    mouse.set(e.clientX, e.clientY)
})

canvas.addEventListener('mousedown', () => {
    drawCircles = true
})

canvas.addEventListener('mouseup', () => {
    drawCircles = false
})

const update = () => {
    if (drawCircles) {
        for (let i = 0; i < 10; i++) {
            createCircle(mouse.x, mouse.y)
        }
    }

    const moveCircles = []

    circles.forEach(circle => {
        circle.radius -= rnd(0.1, 0.15)

        if (circle.radius <= 0) {
            return
        }

        moveCircles.push(circle)

        circle.offset.x += rnd(-0.5, 0.5)
        const nX = simplex.noise2D(circle.pos.x, circle.pos.y) * circle.offset.x

        circle.offset.y += rnd(-0.5, 0.5)
        const nY = simplex.noise2D(circle.pos.y, circle.pos.x) * circle.offset.y

        circle.velocity.add(nX, nY)

        circle.velocity.multiply(0.9)
        circle.pos.add(circle.velocity)
    })

    circles = moveCircles
}

const render = () => {
    circles.forEach(circle => {
        ctx.beginPath()
        const { r, g, b } = pixel(circle.pos.x, circle.pos.y)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, Math.PI * 2)
        ctx.fill()
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
