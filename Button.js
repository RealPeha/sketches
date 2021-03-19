import EventEmitter from './EventEmitter.js'

class Button extends EventEmitter {
    constructor(element, title = '') {
        super()
        element.querySelector('span').innerText = title
        this.element = element
        this.backCircle = element.querySelector('div')
        this.isActive = false
        this.clickTimeout = null
        
        const rect = element.getBoundingClientRect()

        this.center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        }

        element.addEventListener('mousedown', () => {
            this.clickTimeout = setTimeout(() => this.emit('click'), 400)
        })

        element.addEventListener('mouseup', () => {
            clearTimeout(this.clickTimeout)
        })
    }

    enter() {
        if (!this.isActive) {
            this.isActive = true

            document.body.style.cursor = 'none'

            this.backCircle.style.top = '-15px'
            this.backCircle.style.right = '-15px'
            this.backCircle.style.bottom = '-15px'
            this.backCircle.style.left = '-15px'

            this.emit('enter')
        }
    }

    leave() {
        if (this.isActive) {
            this.isActive = false

            document.body.style.cursor = 'default'

            this.backCircle.style.top = '-2px'
            this.backCircle.style.right = '-2px'
            this.backCircle.style.bottom = '-2px'
            this.backCircle.style.left = '-2px'

            this.emit('leave')
        }
    }
}

export default Button
