import { vec2 } from '../Vec2.js'
import { r } from '../helpers.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const width = document.body.clientWidth
const height = document.body.clientHeight
canvas.width = width
canvas.height = height

const variants = []
let currentVariant = 0
let points = []
const mouse = vec2(0, 0)
let radius = 100
const friction = 0.2

const createPoint = pos => {
    const point = {
        pos,
        startPos: pos.clone(),
        velocity: vec2(0, 0),
        dist: Infinity,
    }
    points.push(point)

    return point
}

variants.push(() => {
    for (let x = 0; x < width / 1; x++) {
        createPoint(vec2(x * 1, height / 2 + Math.sin(x / 50) * 50))
    }
})

variants.push(() => {
    for (let x = 0; x < width / 2; x++) {
        createPoint(vec2(x * 2, height / 2 + r(-200, 200)))
    }
})

variants.push(() => {
    for (let x = 0; x < width / 2; x++) {
        createPoint(vec2(x * 2, height / 2))
    }
})

variants.push(() => {
    for (let x = 0; x < width; x++) {
        createPoint(vec2(r(0, width), r(0, height)))
    }
})

variants[currentVariant]()

canvas.addEventListener('mousemove', e => {
    mouse.set(e.clientX, e.clientY)
})

canvas.addEventListener('wheel', e => {
    if (e.deltaY > 0) {
        radius += 10
    } else {
        radius -= 10
    }
})

canvas.addEventListener('mousedown', () => {
    if (currentVariant < variants.length - 1) {
        currentVariant++
    } else {
        currentVariant = 0
    }

    points = []
    variants[currentVariant]()
})

const update = () => {
    points.forEach(point => {
        const distToStart = point.startPos.dist(point.pos)

        const posDir = vec2(
            point.startPos.x - point.pos.x,
            point.startPos.y - point.pos.y,
        )
            .normalize()
            .multiply(distToStart / 20)

        point.pos.add(posDir)

        const dist = point.pos.dist(mouse)

        if (dist <= radius) {
            point.dist = distToStart

            const dir = vec2(point.pos.x - mouse.x, point.pos.y - mouse.y)
                .normalize()
                .multiply((radius - dist) * 2)

            if (point.velocity.length < 10) {
                point.velocity.add(dir)
            }
        } else {
            point.dist = Infinity
        }

        point.velocity.multiply(friction)
        point.pos.add(point.velocity)
    })
}

const render = () => {
    for (let i = 1; i < points.length; i++) {
        const point = points[i]
        const prevPoint = points[i - 1]

        ctx.beginPath()
        const value = point.dist > 60 ? 60 : point.dist < 30 ? 30 : point.dist
        ctx.strokeStyle = `hsl(20, 100%, ${isFinite(point.dist) ? value : 100}%)`

        if (isFinite(point.dist) && point.dist > 50) {
            ctx.lineWidth = 2
        } else {
            ctx.lineWidth = 1
        }

        ctx.moveTo(prevPoint.pos.x, prevPoint.pos.y)
        ctx.lineTo(point.pos.x, point.pos.y)

        ctx.stroke()
    }
}

const loop = () => {
    ctx.fillRect(0, 0, width, height)

    update()
    render()

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
