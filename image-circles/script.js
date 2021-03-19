import { vec2 } from '../Vec2.js'
import { r as random } from '../helpers.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const canvasImage = document.querySelector('#image')
const ctxImage = canvasImage.getContext('2d')

const width = document.body.clientWidth
const height = document.body.clientHeight
const halfWidth = width / 2
const halfHeight = height / 2
canvas.width = width
canvas.height = height

const imgUrl = 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'
const img = new Image()
img.src = imgUrl + '?' + new Date().getTime()
img.setAttribute('crossOrigin', '')

const mouse = vec2(0, 0)
const n = 50
const radius = 150
const circleRadius = 6.5
let circles = []

const pixel = (x, y) => {
    const pixelData = ctxImage.getImageData(x, y, 1, 1).data

    return {
        r: pixelData[0],
        g: pixelData[1],
        b: pixelData[2],
    }
}

const createCircle = (pos, expectedPos) => {
    circles.push({
        pos,
        expectedPos,
        offset: vec2(0, 0),
        velocity: vec2(0, 0),
        acceleration: vec2(0, 0),
        radius: circleRadius + Math.random() * 3,
    })
}

canvas.addEventListener('mousemove', e => {
    mouse.set(e.clientX, e.clientY)
})

const center = vec2(halfWidth, halfHeight)

canvas.addEventListener('contextmenu', e => e.preventDefault())

canvas.addEventListener('mousedown', e => {
    circles.forEach(circle => {
        const dist = circle.pos.dist(center)

        const dir = vec2(center.x - circle.pos.x, center.y - circle.pos.y)
            .normalize()
            .multiply(dist)

        if (e.which === 1) {
            circle.acceleration.add(dir)
        } else {
            circle.acceleration.add(dir.reverse())
        }
    })
})

const update = () => {
    circles.forEach(circle => {
    // const expectedDist = circle.pos.dist(circle.expectedPos);
        const expectedDistX = circle.expectedPos.x - circle.pos.x
        const expectedDistY = circle.expectedPos.y - circle.pos.y
        const expectedDist = Math.sqrt(expectedDistX ** 2 + expectedDistY ** 2)

        const dir = vec2(expectedDistX, expectedDistY)
            .normalize()
            .multiply(expectedDist > 30 ? 30 : expectedDist)

        // const dist = circle.pos.dist(mouse);
        const distX = circle.pos.x - mouse.x
        const distY = circle.pos.y - mouse.y
        const dist = Math.sqrt(distX ** 2 + distY ** 2)

        if (dist <= radius) {
            const dir = vec2(distX, distY)
                .normalize()
                .multiply(radius - dist)

            circle.velocity.add(dir)
        }

        circle.acceleration.add(dir)
        circle.velocity.add(circle.acceleration)
        circle.acceleration.multiply(0.7)
        circle.velocity.multiply(0.3)
        circle.pos.add(circle.velocity)
    })
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
    ctx.clearRect(0, 0, width, height)

    update()
    render()

    requestAnimationFrame(loop)
}

img.onload = () => {
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
            const offset = y % 2 === 0 ? circleRadius / 2 : 0
            createCircle(
                vec2(random(0, width), random(0, height)),
                vec2(
                    halfWidth - img.width / 4 + (x * img.width) / 2 / n - offset,
                    halfHeight - img.height / 4 + (y * img.height) / 2 / n,
                ),
            )
        }
    }

    canvasImage.width = img.width
    canvasImage.height = img.height
    ctxImage.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        halfWidth - img.width / 4,
        halfHeight - img.height / 4,
        img.width / 2,
        img.height / 2,
    )

    requestAnimationFrame(loop)
}
