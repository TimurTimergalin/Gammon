import {gapWidth, pieceWidth, sideWidth} from "./board_size_constants.ts";

export const getTriangleLeft = (i: number) =>
    sideWidth + pieceWidth + sideWidth + i * pieceWidth + (i >= 6 ? sideWidth + gapWidth + sideWidth : 0)