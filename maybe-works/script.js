import { vec2 } from '../Vec2.js'
import { r } from '../helpers.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const width = document.body.clientWidth
const height = document.body.clientHeight
const halfHeight = height / 2
canvas.width = width
canvas.height = height
const gradient = ctx.createLinearGradient(0, halfHeight, width, halfHeight)

gradient.addColorStop(0, '#222')
gradient.addColorStop(0.25, '#2d2d2d')
gradient.addColorStop(0.54, '#3d3d3d')
gradient.addColorStop(0.77, '#222')

let prevPos = vec2(50, halfHeight)
const radius = 100

const l = (char, offsetX, offsetY, color = '#fff') => {
    prevPos.x += offsetX

    return {
        char,
        pos: vec2(r(1) === 0 ? -50 : width + 50, r(1) === 0 ? -50 : height + 50),
        expectedPos: prevPos.clone(),
        velocity: vec2(0, 0),
        acceleration: vec2(r(-2, 2), r(-2, 2)),
        color,
        offset: vec2(offsetX, offsetY),
    }
}

const text = [
    l('m', 0, 0),
    l('a', 60, 0),
    l('y', 40, 0),
    l('b', 38, 0),
    l('e', 40, 0),
    l('.', 35, 0),
    l('w', 20, 0, '#ff640c'),
    l('o', 55, 0, '#ff640c'),
    l('r', 40, 0, '#ff640c'),
    l('k', 28, 0, '#ff640c'),
    l('s', 40, 0, '#ff640c'),
]
const tiles = []

const createTile = (posX, posY, centerX, centerY, color = 'black') => {
    tiles.push({
        pos: vec2(width, 0),
        expectedPos: vec2(posX, posY),
        center: vec2(centerX, centerY),
        color,
        velocity: vec2(0, 0),
    })
}

createTile(width + 300, 0, width - 600, height, '#fff')
createTile(width + 300, 0, width - 600, 0, '#fff')
createTile(width + 410, 0, width - 650, height, '#ff640c')
createTile(width + 280, 0, width - 550, 0, '#222')
createTile(width + 380, 0, width - 590, height, '#222')
createTile(width + 240, 0, width - 500, 0, '#fff')
createTile(width + 360, 0, width - 550, height, '#fff')
createTile(width + 270, 0, width - 500, 0, '#ff640c')
createTile(width + 390, 0, width - 555, height, '#222')
createTile(width + 120, 0, width - 300, 0, '#fff')
createTile(width + 200, 0, width - 340, height, '#ff640c')
createTile(width + 260, 0, width - 350, 0, '#222')
createTile(width + 260, 0, width - 350, height, '#222')

canvas.addEventListener('mousemove', e => {
    const mouse = vec2(e.clientX, e.clientY)

    text.forEach(letter => {
        const dist = letter.pos.dist(mouse)

        if (dist <= radius) {
            const dir = vec2(letter.pos.x - mouse.x, letter.pos.y - mouse.y)
                .normalize()
                .divide(5)

            letter.acceleration.add(dir)
        }
    })
})

const update = () => {
    text.forEach(letter => {
        const dir = vec2(
            letter.expectedPos.x - letter.pos.x,
            letter.expectedPos.y - letter.pos.y,
        )

        if (dir.length > 1) {
            dir.normalize()
        }

        letter.velocity.add(dir)
        letter.velocity.add(letter.acceleration)
        letter.velocity.multiply(0.9)
        letter.acceleration.multiply(0.9)
        letter.pos.add(letter.velocity)
    })

    tiles.forEach(tile => {
        const dir = vec2(
            tile.expectedPos.x - tile.pos.x,
            tile.expectedPos.y - tile.pos.y,
        )

        if (dir.length > 1) {
            dir.normalize()
        }

        tile.velocity.add(dir)
        tile.velocity.multiply(0.94)
        tile.pos.add(tile.velocity)
    })
}

const render = () => {
    ctx.font = 'bold 70px sans-serif'
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 3

    text.forEach(letter => {
        ctx.fillStyle = letter.color

        ctx.fillText(letter.char, letter.pos.x, letter.pos.y)
    })

    ctx.shadowBlur = 15
    tiles.forEach(tile => {
        ctx.fillStyle = tile.color

        ctx.beginPath()
        ctx.moveTo(tile.pos.x, tile.pos.y)
        ctx.lineTo(tile.center.x, tile.center.y)
        ctx.lineTo(tile.pos.x, height)
        ctx.fill()
    })
}

const loop = () => {
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    update()
    render()

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
