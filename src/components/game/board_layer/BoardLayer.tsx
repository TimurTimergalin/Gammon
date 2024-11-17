import {gapWidth, middleX, pieceWidth, sideWidth} from "../dimensions/board_size_constants.ts";
import {Half} from "./Half.tsx";
import {Store} from "./Store.tsx";
import {Frame} from "./Frame.tsx";
import {Triangles} from "./Triangles.tsx";
import {MiddleLine} from "./MiddleLine.tsx";

export function BoardLayer() {
    return (
        <>
            <Store leftX={0}/>
            <Half leftX={sideWidth + pieceWidth}/>
            <Half leftX={middleX + gapWidth / 2}/>
            <Store leftX={middleX + gapWidth / 2 + sideWidth + 6 * pieceWidth}/>
            <MiddleLine/>
            <Triangles/>
            <Frame leftX={sideWidth} width={pieceWidth}/>
            <Frame leftX={sideWidth + pieceWidth + sideWidth} width={6 * pieceWidth}/>
            <Frame leftX={middleX + gapWidth / 2 + sideWidth} width={6 * pieceWidth}/>
            <Frame leftX={middleX + gapWidth / 2 + sideWidth + 6 * pieceWidth + sideWidth} width={pieceWidth}/>
        </>
    );
}