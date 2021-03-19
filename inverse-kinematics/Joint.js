import Vec2, { vec2 } from '../Vec2.js'

class Joint {
    constructor(x, y, len = 25) {
        this.pos = vec2(x, y)
        this.angle = 0
        this.len = len
    }

    update(joint) {
        this.pos = joint.pos.clone().add(Vec2.fromAngle(joint.angle, this.len))
    }
}

export default Joint
