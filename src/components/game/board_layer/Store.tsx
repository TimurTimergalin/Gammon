import {boardHeight, pieceWidth, sideWidth, standHeight, storeHeight} from "../board_size_constants.ts";
import {boardColor, sideColor, standColor} from "./color_constants.ts";

export const Store = ({leftX}: { leftX: number }) => (
    <>
        <rect
            x={leftX + sideWidth / 2}
            y={sideWidth / 2}
            width={pieceWidth + sideWidth}
            height={boardHeight - sideWidth}
            strokeWidth={sideWidth}
            stroke={sideColor}
            fill={boardColor}
        />
        <rect
            x={leftX + sideWidth - 0.5}
            y={sideWidth + storeHeight}
            width={pieceWidth + 1}
            height={standHeight}
            fill={standColor}
        />
        <rect
            x={leftX + sideWidth - 0.5}
            y={sideWidth + storeHeight + 2 * standHeight}
            width={pieceWidth + 1}
            height={standHeight}
            fill={standColor}
        />
    </>
)