import { vec2 } from '../Vec2.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const width = document.body.clientWidth
const height = document.body.clientHeight
canvas.width = width
canvas.height = height

const spring = 0.1
const friction = 0.75

const center = vec2(400, 200)

canvas.addEventListener('mousemove', e => {
    center.set(e.clientX, e.clientY)
})

const circle = {
    pos: vec2(0, 200),
    velocity: vec2(0, 0),
    r: 20,
}

const update = () => {
    const dir = center.clone().substract(circle.pos)

    const acceleration = dir.multiply(spring)

    circle.velocity.add(acceleration)
    circle.velocity.multiply(friction)
    circle.pos.add(circle.velocity)
}

const render = () => {
    ctx.beginPath()
    ctx.moveTo(center.x, center.y)
    ctx.lineTo(circle.pos.x, circle.pos.y)
    ctx.moveTo(circle.pos.x + circle.r, circle.pos.y)
    ctx.arc(circle.pos.x, circle.pos.y, circle.r, 0, 2 * Math.PI)
    ctx.stroke()
}

const loop = () => {
    ctx.clearRect(0, 0, width, height)

    update()
    render()

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
