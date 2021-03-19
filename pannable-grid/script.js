import { vec2 } from '../Vec2.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const width = document.body.clientWidth
const height = document.body.clientHeight
canvas.width = width
canvas.height = height

const mousePos = vec2(0, 0)
const mouseLastPos = vec2(0, 0)
const offset = vec2(0, 0)
const cellSize = 40
let drag = false
let zoomFactor = 2

canvas.addEventListener('mousedown', () => {
    drag = true
})

canvas.addEventListener('mouseup', () => {
    drag = false
})

canvas.addEventListener('mousemove', e => {
    mousePos.set(e.clientX, e.clientY)
})

const update = () => {
    if (drag) {
        offset.add(mousePos.clone().substract(mouseLastPos))
        mouseLastPos.set(mousePos)
    } else {
        mouseLastPos.set(mousePos)
    }

    ctx.setTransform(zoomFactor, 0, 0, zoomFactor, offset.x, offset.y)
}

const render = () => {
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.strokeStyle = 'red'

    const roundedOffset = vec2(
        -Math.round(offset.x / zoomFactor / cellSize) * cellSize,
        -Math.round(offset.y / zoomFactor / cellSize) * cellSize,
    )

    for (
        let y = roundedOffset.y;
        y < height / zoomFactor + roundedOffset.y + cellSize;
        y += cellSize
    ) {
        ctx.moveTo(-offset.x / zoomFactor, y)
        ctx.lineTo(width / zoomFactor + roundedOffset.x + cellSize, y)
    }

    ctx.stroke()
    ctx.beginPath()
    ctx.strokeStyle = 'black'

    for (
        let x = roundedOffset.x;
        x < width / zoomFactor + roundedOffset.x + cellSize;
        x += cellSize
    ) {
        ctx.moveTo(x, -offset.y / zoomFactor)
        ctx.lineTo(x, height / zoomFactor + roundedOffset.y + cellSize)
    }

    ctx.stroke()
}

const loop = () => {
    ctx.clearRect(
        -offset.x / zoomFactor,
        -offset.y / zoomFactor,
        width / zoomFactor,
        height / zoomFactor,
    )

    update()
    render()

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
