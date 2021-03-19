import { vec2 } from '../Vec2.js'
import Joint from './Joint.js'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const width = document.body.clientWidth
const height = document.body.clientHeight
canvas.width = width
canvas.height = height

const mouse = vec2(350, 300)
const LEARING_RATE = 50
const SAMPLINGE_DISTANCE = 1

const rad = (deg) => (deg * Math.PI) / 180

const joints = []
const angles = []

for (let i = 0; i < 50; i++) {
    joints.push(new Joint(350, 300, 10))
    angles.push(0)
}

const forwardKinematics = () => {
    joints.forEach((joint, i) => {
        const prevJoint = joints[i - 1]

        joint.angle = rad(angles[i] || 0)

        if (prevJoint) {
            joint.update(prevJoint)
        }
    })

    return joints[joints.length - 1].pos
}

const getError = (target) => {
    const resPoint = forwardKinematics()

    const dist = resPoint.dist(target)

    return dist
}

const partialGradient = (target, i) => {
    const angle = angles[i]

    const err = getError(target, i)

    angles[i] += SAMPLINGE_DISTANCE

    const newErr = getError(target, i)

    angles[i] = angle

    return (newErr - err) / SAMPLINGE_DISTANCE
}

const inverseKinematics = (target) => {
    joints.forEach((joint, i) => {
        const gradient = partialGradient(target, i)

        angles[i] -= LEARING_RATE * gradient

        if (getError(target, i) < 5) {
            angles[i] += LEARING_RATE * gradient

            return
        }

        const prevJoint = joints[i - 1]

        if (prevJoint) {
            joint.update(prevJoint)
        }
    })
}

canvas.addEventListener('mousemove', (e) => {
    mouse.set(e.clientX, e.clientY)
})

const update = () => {
    inverseKinematics(mouse)
}

const render = () => {
    ctx.beginPath()

    joints.forEach((joint, i) => {
        const prevJoint = joints[i - 1]

        if (prevJoint) {
            ctx.moveTo(prevJoint.pos.x, prevJoint.pos.y)
            ctx.lineTo(joint.pos.x, joint.pos.y)
        }
    })

    ctx.stroke()
}

const loop = () => {
    ctx.clearRect(0, 0, width, height)

    update()
    render()

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
