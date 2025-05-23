import {boardHeight, pieceWidth, sideWidth} from "../dimensions/board_size_constants";
import {boardColor, sideColor} from "./color_constants";

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