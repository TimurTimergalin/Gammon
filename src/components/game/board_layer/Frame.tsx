import {boardHeight, frameWidth, sideWidth} from "../board_size_constants.ts";
import {frameColor} from "./color_constants.ts";

export const Frame = ({leftX, width}: { leftX: number, width: number }) => (
    <rect
        x={leftX - frameWidth / 2}
        y={sideWidth - frameWidth / 2}
        width={width + frameWidth}
        height={boardHeight - 2 * sideWidth + frameWidth}
        fill={"none"}
        stroke={frameColor}
        strokeWidth={frameWidth}
    />
)