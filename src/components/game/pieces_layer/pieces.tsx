import {pieceHeight} from "../board_size_constants.ts";
import {Color, colorFill, colorStroke} from "../color.ts";

const pieceWidth = 100
const borderWidth = 2

export function TopDownPiece({cx, cy, color, className}: {
    cx: number,
    cy: number,
    color: Color,
    className?: string
}) {
    return (
        <circle
            cx={cx}
            cy={cy}
            r={pieceWidth / 2 - borderWidth / 2}
            strokeWidth={borderWidth}
            stroke={colorStroke(color)}
            fill={colorFill(color)}
            className={className === undefined ? "" : className}
        />
    )
}

export function SidePiece({x, y, color}: {
    x: number,
    y: number,
    color: Color
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
            stroke={colorStroke(color)}
            fill={colorFill(color)}
        />
    )
}

