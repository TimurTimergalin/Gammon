import {pieceHeight, pieceWidth} from "../dimensions/board_size_constants.ts";
import {Color, colorFill, colorStroke} from "../../../common/color.ts";

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

export function SidePiece({x, y, color, className}: {
    x: number,
    y: number,
    color: Color,
    className?: string
}) {
    const borderWidth = 2
    const r = 4
    return (
        <rect
            x={x}
            y={y}
            width={pieceWidth - borderWidth / 2}
            height={pieceHeight - borderWidth / 2}
            rx={r}
            ry={r}
            strokeWidth={borderWidth}
            stroke={colorStroke(color)}
            fill={colorFill(color)}
            className={className === undefined ? "" : className}
        />
    )
}

