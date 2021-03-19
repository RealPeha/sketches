import { vec2 } from '../Vec2.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const width = window.innerWidth
const height = window.innerHeight

canvas.width = width
canvas.height = height

const halfWidth = width / 2
const squares = []
const screenOffset = vec2(0, 0)
const offsetFactor = 100
const radius = 50

const createSquare = (pos, size, withGravity = false, iteration = 0) => {
    squares.push({
        pos,
        velocity: vec2(0, 0),
        size,
        withGravity,
        iteration,
    })
}

const gravity = vec2(0, 0)

for (let x = -offsetFactor; x < width + offsetFactor; x += halfWidth) {
    for (let y = -offsetFactor; y < height + offsetFactor; y += halfWidth) {
        createSquare(vec2(x, y), halfWidth)
    }
}

canvas.addEventListener('mousedown', e => {
    const mouse = vec2(e.clientX, e.clientY)

    squares.forEach(square => {
        if (square.size <= 50) {
            const squareCenter = square.pos.clone().add(square.size / 2)
            const dist = squareCenter.dist(mouse)

            if (dist <= radius) {
                square.withGravity = true
                const angle = vec2(square.pos.x - mouse.x, square.pos.y - mouse.y)
                    .normalize()
                    .multiply(dist / 2)

                square.velocity.set(angle)
            }
        }
    })
})

canvas.addEventListener('mousemove', e => {
    const mouseX = e.clientX - screenOffset.x
    const mouseY = e.clientY - screenOffset.y

    screenOffset.set(
        Math.floor((mouseX * offsetFactor) / width - offsetFactor / 2),
        Math.floor((mouseY * offsetFactor) / width - offsetFactor / 2),
    )

    const square = squares.find(({ pos, size }) => {
        return (
            mouseX > pos.x &&
      mouseX < pos.x + size &&
      mouseY > pos.y &&
      mouseY < pos.y + size
        )
    })

    if (!square || square.iteration > 7) {
        return
    }

    const halfSquareSize = square.size / 2
    if (halfSquareSize > 2) {
        square.size = halfSquareSize
        square.iteration += 1

        createSquare(
            vec2(square.pos.x + halfSquareSize, square.pos.y),
            halfSquareSize,
            false,
            square.iteration,
        )
        createSquare(
            vec2(square.pos.x, square.pos.y + halfSquareSize),
            halfSquareSize,
            false,
            square.iteration,
        )
        createSquare(
            vec2(square.pos.x + halfSquareSize, square.pos.y + halfSquareSize),
            halfSquareSize,
            false,
            square.iteration,
        )
    }
})

const clear = () => {
    ctx.clearRect(0, 0, width, height)
}

const update = () => {
    squares.forEach(square => {
        if (square.withGravity) {
            square.velocity.add(gravity)
        }

        square.pos.add(square.velocity)
    })
}

const render = () => {
    squares.forEach(square => {
        ctx.fillStyle = `hsl(14, 82%, ${60 - square.iteration * 7}%)`
        ctx.fillRect(
            square.pos.x + screenOffset.x,
            square.pos.y + screenOffset.y,
            square.size + 1,
            square.size + 1,
        )
    })
}

const loop = () => {
    clear()
    update()
    render()

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)