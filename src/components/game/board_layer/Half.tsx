import {boardHeight, pieceWidth, sideWidth} from "../board_size_constants.ts";
import {boardColor, sideColor} from "./color_constants.ts";

export const Half = ({leftX}: { leftX: number }) => (
    <rect
        x={leftX + sideWidth / 2}
        y={sideWidth / 2}
        width={6 * pieceWidth + sideWidth}
        height={boardHeight - sideWidth}
        strokeWidth={sideWidth}
        stroke={sideColor}
        fill={boardColor}
    />
)