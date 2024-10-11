export enum Color {
    WHITE= 0,
    BLACK
}

export function colorFill(color: Color) {
    return color === Color.WHITE ? "#f5ede6" : "#302d2a"
}

export function colorStroke(color: Color) {
    return color === Color.WHITE ? "#cfc2b6" : "#4d4641"
}

export function oppositeColor(color: Color) {
    return color === Color.BLACK ? Color.WHITE : Color.BLACK
}

