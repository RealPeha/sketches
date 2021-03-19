import { vec2 } from '../Vec2.js'

const canvas = document.querySelector('#canvas')

const width = window.innerWidth
const height = window.innerHeight

canvas.width = width
canvas.height = height

const ctx = canvas.getContext('2d')
// ctx.fillStyle = "khaki";
// ctx.fillRect(0, 0, width, height);
ctx.fillStyle = '#fff'

let cards = []
let cardSpam = false
let mousePoint = null

const gravity = vec2(0, 0.1)

const baseImgUrl =
  'https://cdn2.bigcommerce.com/n-d57o0b/1kujmu/products/297/images'

const urls = [
    `${baseImgUrl}/924/2D__57497.1440113502.1280.1280.png`,
    `${baseImgUrl}/925/3C__99122.1440113509.1280.1280.png`,
    `${baseImgUrl}/926/4H__83243.1440113515.1280.1280.png`,
    `${baseImgUrl}/927/5S__90574.1440113521.1280.1280.png`,
    `${baseImgUrl}/928/6D__92916.1440113530.1280.1280.png`,
    `${baseImgUrl}/929/7C__93490.1440113539.1280.1280.png`,
    `${baseImgUrl}/930/8S__27839.1440113555.1280.1280.png`,
    `${baseImgUrl}/931/9D__67286.1440113561.1280.1280.png`,
    `${baseImgUrl}/932/10H__11470.1440113568.1280.1280.png`,
    `${baseImgUrl}/923/JC__86231.1440113428.1280.1280.png`,
    `${baseImgUrl}/934/QD__14920.1440113588.1280.1280.png`,
    `${baseImgUrl}/933/KH__01216.1440113580.1280.1280.png`,
    `${baseImgUrl}/935/AS__68652.1440113599.1280.1280.png`,
]

let images = urls.map(url => {
    return new Promise(resolve => {
        const img = new Image()
        img.src = url
        img.onload = () => {
            resolve(img)
        }
    })
})

const createCard = (pos, velocity, acceleration) => {
    cards.push({
        pos,
        velocity,
        acceleration,
        width: 106,
        height: 162,
        imageIndex: Math.floor(Math.random() * images.length),
    })
}

const random = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min))
}

canvas.addEventListener('mousedown', e => {
    const ifLeftClick = e.clientX < width / 2
    createCard(
        vec2(e.clientX, e.clientY),
        vec2(ifLeftClick ? 5 : -5, random(0, 10) - 10),
        vec2((ifLeftClick ? Math.random() : -Math.random()) / 10, 0),
    )
})

canvas.addEventListener('contextmenu', e => {
    e.preventDefault()
    cardSpam = !cardSpam
})

canvas.addEventListener('mousemove', e => {
    mousePoint = {
        x: e.clientX,
        y: e.clientY,
    }
})

const friction = 0.99

const update = () => {
    if (mousePoint && cardSpam) {
        createCard(
            vec2(mousePoint.x, mousePoint.y),
            vec2(Math.random() > 0.5 ? 5 : -5, random(0, 10) - 10),
            vec2((Math.random() > 0.5 ? -Math.random() : Math.random()) / 5, 0),
        )
    }

    const visibleCards = []

    cards.forEach(card => {
        if (card.pos.y >= height - card.height) {
            card.velocity.y *= -1
            card.pos.y = height - card.height
        }

        if (card.acceleration.length < 1) {
            card.acceleration.add(gravity)
        }

        card.velocity.add(card.acceleration).multiply(friction)

        card.pos.add(card.velocity)

        if (card.pos.x < width && card.pos.x > -card.width) {
            visibleCards.push(card)
        }
    })

    cards = visibleCards
}

const render = () => {
    cards.forEach(card => {
        ctx.drawImage(
            images[card.imageIndex],
            card.pos.x,
            card.pos.y,
            card.width,
            card.height,
        )
    })

    ctx.fillRect(0, 0, 100, 25)
    ctx.strokeText(`Cards: ${cards.length}`, 20, 20)
}

const loop = () => {
    update()
    render()

    requestAnimationFrame(loop)
}

Promise.all(images).then(imgs => {
    images = imgs
    requestAnimationFrame(loop)
})
