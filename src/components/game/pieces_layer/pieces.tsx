import {pieceHeight} from "../size_constants";
import {Color} from "./color.ts";

const pieceWidth = 100
const borderWidth = 2

export function TopDownPiece({cx, cy, color, style}: {
    cx: number,
    cy: number,
    color: Color | null,
    style?: object
}) {
    return (
        <circle
            cx={cx}
            cy={cy}
            r={pieceWidth / 2 - borderWidth / 2}
            strokeWidth={borderWidth}
            stroke={color === Color.WHITE ? "#cfc2b6" : "#3e3834"}
            fill={color === Color.WHITE ? "#f5ede6" : "#302d2a"}
            style={style || {}}
        />
    )
}

export function SidePiece({x, y, color}: {
    x: number,
    y: number,
    color: Color | null
}) {
    const borderWidth = 2
    const cornerShift = 5
    const r = cornerShift - borderWidth / 2
    return (
        <path
            d={`M ${x + cornerShift} ${y + borderWidth / 2} 
            l ${pieceWidth - 2 * cornerShift} 0
            a ${r} ${r} 0 0 1 ${r} ${r} l 0 ${pieceHeight - 2 * cornerShift} a ${r} ${r} 0 0 1 ${-r} ${r}
            l ${-(pieceWidth - 2 * cornerShift)} 0
            a ${r} ${r} 0 0 1 ${-r} ${-r}
            l 0 ${-(pieceHeight - 2 * cornerShift)}
            a ${r} ${r} 0 0 1 ${r} ${-r}
            `}
            strokeWidth={borderWidth}
            stroke={color === Color.WHITE ? "#cfc2b6" : "#3e3834"}
            fill={color === Color.WHITE ? "#f5ede6" : "#302d2a"}
        />
    )
}

