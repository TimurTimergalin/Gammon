import {boardHeight, gapWidth, middleX, pieceWidth, sideWidth} from "../board_size_constants.ts";
import {gapColor} from "./color_constants.ts";
import {Half} from "./Half.tsx";
import {Store} from "./Store.tsx";
import {Frame} from "./Frame.tsx";
import {Triangles} from "./PointUpTriangle.tsx";

export function BoardLayer() {
    return (
        <>
            <Store leftX={0}/>
            <Half leftX={sideWidth + pieceWidth}/>
            <Half leftX={middleX + gapWidth / 2}/>
            <Store leftX={middleX + gapWidth / 2 + sideWidth + 6 * pieceWidth}/>

            <line
                x1={middleX}
                y1={0}
                x2={middleX}
                y2={boardHeight}
                stroke={gapColor}
                strokeWidth={gapWidth + 1}
            />
            <Triangles />
            <Frame leftX={sideWidth} width={pieceWidth}/>
            <Frame leftX={sideWidth + pieceWidth + sideWidth} width={6 * pieceWidth}/>
            <Frame leftX={middleX + gapWidth / 2 + sideWidth} width={6 * pieceWidth}/>
            <Frame leftX={middleX + gapWidth / 2 + sideWidth + 6 * pieceWidth + sideWidth} width={pieceWidth}/>
        </>
    );
}