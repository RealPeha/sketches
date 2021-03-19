import Cursor from './Cursor.js'
import Button from './Button.js'

const createSketch = (id, name) => ({ id, name })

const sketches = [
    createSketch('axes-clock', 'Axes Clock'),
    createSketch('broken-tiles', 'Broken Tiles'),
    createSketch('cards', 'Cards'),
    createSketch('chaining-spring', 'Chaining Spring'),
]

const goTo = link => {
    document.body.classList.add('hidden')

    document.body.addEventListener('transitionend', () => {
        window.location.href = link

        if (link.startsWith('#')) {
            window.location.reload()
        }
    })
}

setTimeout(() => document.body.classList.remove('hidden'), 0)

const sketchId = window.location.hash && window.location.hash.substring(1).trim()
const currentSketch = sketches.find(({ id }) => id === sketchId) || sketches[0]

const sketchMenu = document.querySelector('#sketch-menu')

sketches.forEach(sketch => {
    const link = document.createElement('a')
    link.href = `/${sketch.id}`
    link.classList.add('sketch-link')

    if (sketch.id === sketchId) {
        link.classList.add('active')
    }

    link.addEventListener('click', (e) => {
        e.preventDefault()

        goTo(`#${sketch.id}`)
    })

    sketchMenu.appendChild(link)
})

const cursor = new Cursor(document.querySelector('#pointer'), 20)
const button = new Button(document.querySelector('.circle-button'), currentSketch.name)
    .on('leave', () => {
        cursor.leave()

        document.body.style.backgroundColor = 'antiquewhite'
    })
    .on('enter', () => {
        cursor.enter()

        document.body.style.backgroundColor = 'indianred'
    })
    .on('click', () => {
        goTo(`/${currentSketch.id}`)
    })

const render = () => {
    cursor.render()

    const distToButton = Math.sqrt(
        (cursor.mouse.x - button.center.x) ** 2 +
      (cursor.mouse.y - button.center.y) ** 2,
    )

    if (distToButton <= 100) {
        button.enter()
    } else {
        button.leave()
    }

    requestAnimationFrame(render)
}

requestAnimationFrame(render)