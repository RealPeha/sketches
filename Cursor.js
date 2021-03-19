import { lerp } from './helpers.js'

class Cursor {
    constructor(element, radius, movement = 0.2) {
        element.style.width = `${radius}px`
        element.style.height = `${radius}px`

        this.movement = movement
        this.radius = radius
        this.element = element
        this.prevMouse = { x: 0, y: 0 }
        this.mouse = { x: -20, y: -20 }
        this.styles = {
            scale: 1,
            opacity: 1,
        }
        document.addEventListener('mousemove', this.setMouse.bind(this))
    }

    setMouse(e) {
        this.mouse.x = e.clientX
        this.mouse.y = e.clientY
    }

    enter() {
        this.styles.scale = 3
        this.styles.opacity = 0.85
    }

    leave() {
        this.styles.scale = 1
        this.styles.opacity = 1
    }

    render() {
        this.prevMouse.x = lerp(
            this.prevMouse.x,
            this.mouse.x - this.radius / 2,
            this.movement,
        )
        this.prevMouse.y = lerp(
            this.prevMouse.y,
            this.mouse.y - this.radius / 2,
            this.movement,
        )

        const { x, y } = this.prevMouse

        this.element.style.opacity = this.styles.opacity
        this.element.style.transform = `translate(${x}px, ${y}px) scale(${this.styles.scale})`
    }
}

export default Cursor
