class Constraint {
    constructor(a, b, length) {
        this.a = a
        this.b = b
        this.length = length || a.pos.dist(b.pos)
    }

    update() {
        const { a, b } = this

        const dx = b.pos.x - a.pos.x
        const dy = b.pos.y - a.pos.y

        const currentLength = Math.sqrt(dx ** 2 + dy ** 2)
        const lengthDiff = (currentLength - this.length) / 2

        const offsetX = (lengthDiff * dx) / currentLength
        const offsetY = (lengthDiff * dy) / currentLength

        a.pos.add(offsetX, offsetY)
        b.pos.substract(offsetX, offsetY)
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.a.pos.x, this.a.pos.y)
        ctx.lineTo(this.b.pos.x, this.b.pos.y)
        ctx.stroke()
    }
}

export default Constraint
