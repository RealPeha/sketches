import { vec2 } from '../Vec2.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const width = document.body.clientWidth
const height = document.body.clientHeight

canvas.width = width
canvas.height = height

const mouse = vec2(0, 0)
const n = 120
const radius = 100
let circles = []

for (let y = 0; y < n; y++) {
    circles[y] = []

    for (let x = 0; x < n; x++) {
        circles[y].push({
            pos: vec2(0, 0),
            // expectedPos: vec2(
            //   halfWidth - width / 4 + (x * width) / 2 / n,
            //   halfHeight - height / 4 + (y * height) / 2 / n
            // ),
            expectedPos: vec2((x * width) / n, (y * height) / n),
            offset: vec2(0, 0),
            velocity: vec2(0, 0),
            acceleration: vec2(0, 0),
        })
    }
}

canvas.addEventListener('mousemove', e => {
    mouse.set(e.clientX, e.clientY)
})

const update = () => {
    circles.forEach(line =>
        line.forEach(circle => {
            const expectedDist = circle.pos.dist(circle.expectedPos)

            const dir = vec2(
                circle.expectedPos.x - circle.pos.x,
                circle.expectedPos.y - circle.pos.y,
            )
                .normalize()
                .multiply(expectedDist > 20 ? 20 : expectedDist)

            const dist = circle.pos.dist(mouse)

            if (dist <= radius) {
                const dir = vec2(circle.pos.x - mouse.x, circle.pos.y - mouse.y)
                    .normalize()
                    .multiply(Math.abs(radius - dist))

                circle.pos.add(dir)
                circle.acceleration.set(0)
            }

            circle.acceleration.add(dir)
            circle.velocity.add(circle.acceleration)
            circle.acceleration.multiply(0.75)
            circle.velocity.multiply(0.3)
            circle.pos.add(circle.velocity)
        }),
    )
}

const render = () => {
    ctx.beginPath()

    ctx.moveTo(circles[0][0].pos.x, circles[0][0].pos.y)
    for (let i = 0; i < circles.length; i++) {
        for (let j = 0; j < circles[i].length; j++) {
            const circle = circles[i][j]
            ctx.moveTo(circle.pos.x, circle.pos.y)

            if (circles[i + 1]) {
                const bottomCircle = circles[i + 1][j]
                ctx.lineTo(bottomCircle.pos.x, bottomCircle.pos.y)
            }

            if (circles[i][j + 1]) {
                const rightCircle = circles[i][j + 1]
                ctx.lineTo(rightCircle.pos.x, rightCircle.pos.y)
            }
        }
    }

    ctx.stroke()
}

const loop = () => {
    ctx.clearRect(0, 0, width, height)

    update()
    render()

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
