import { vec3 } from '../Vec3.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const width = window.innerWidth
const height = window.innerHeight

canvas.width = width
canvas.height = height

const createLetter = (pos, letter) => {
    return {
        pos,
        letter,
        offset: vec3(0, 0, 0),
    }
}

const lettersList = ['Л', 'О', 'Х', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Й']

const letters = []
let radius = 150
let z = 50
const mouse = vec3(width / 2, height / 2, z)

for (let i = 0; i < width / 30; i++) {
    for (let j = 0; j < height / 30; j++) {
        letters.push(
            createLetter(
                vec3(i * 30, j * 30, 0),
                lettersList[Math.floor(Math.random() * lettersList.length)],
            ),
        )
    }
}

canvas.addEventListener('mousemove', e => {
    mouse.set(e.clientX, e.clientY, z)
})

canvas.addEventListener('wheel', e => {
    if (e.deltaY > 0) {
        radius += 10
    } else {
        radius -= 10
    }
})

const update = () => {
    letters.forEach(letter => {
        const dist = letter.pos.dist(mouse)

        const dir = vec3(
            letter.pos.x - mouse.x,
            letter.pos.y - mouse.y,
            letter.pos.z - mouse.z,
        )
            .normalize()
            .multiply(radius - dist)

        if (dist <= radius) {
            letter.offset.set(dir)
        } else {
            letter.offset.set(0)
        }
    })
}

const render = () => {
    letters.forEach(letter => {
        const letterX = letter.pos.x + letter.offset.x
        const letterY = letter.pos.y + letter.offset.y

        ctx.globalAlpha = 0.15
        ctx.beginPath()
        ctx.moveTo(letter.pos.x, letter.pos.y)
        ctx.lineTo(letterX, letterY)
        ctx.stroke()
        ctx.globalAlpha = 1

        const fontSize = Math.abs(letter.offset.z)

        ctx.font = `${fontSize < 20 ? 20 : fontSize * 0.6}px serif`

        ctx.fillText(
            letter.letter,
            letterX - ctx.measureText(letter.letter).width / 2,
            letterY,
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
