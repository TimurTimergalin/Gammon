export type PointEvent = MouseEvent | TouchEvent
export const pointX = (ev: PointEvent) => {
    if ("clientX" in ev) {
        return ev.clientX
    } else {
        return ev.changedTouches[ev.changedTouches.length - 1].clientX
    }
}
export const pointY = (ev: PointEvent) => {
    if ("clientY" in ev) {
        return ev.clientY
    } else {
        return ev.changedTouches[ev.changedTouches.length - 1].clientY
    }
}
export const isPrimary = (ev: PointEvent) => {
    if ("button" in ev) {
        return ev.button === 0
    }
    return true
}