import {
    boardHeight,
    boardWidth,
    gapWidth,
    middleX,
    pieceHeight,
    pieceWidth,
    sideWidth
} from "./board_size_constants.ts";
import {Direction} from "../pieces_layer/direction.ts";
import {SideStack, TopDownStack} from "../pieces_layer/stacks.tsx";

export const getStackDirection = (i: number): Direction => {
    if (i < 12 || i >= 24 && i <= 26) {
        return Direction.DOWN
    }
    return Direction.UP
}

export const getStackType = (i: number) => {
    if (i == 24 || i == 26 || i == 27 || i == 29) {
        return SideStack
    }
    return TopDownStack
}

export const getTriangleLeft = (i: number) =>
    sideWidth + pieceWidth + sideWidth + i * pieceWidth + (i >= 6 ? sideWidth + gapWidth + sideWidth : 0)

export const getStackOriginX = (i: number): number => {
    if (i < 12) {
        return getTriangleLeft(i) + pieceWidth / 2
    }
    if (i < 24) {
        return getTriangleLeft(i - 12) + pieceWidth / 2
    }

    if (i == 24 || i == 27) {
        return sideWidth
    }
    if (i == 25 || i == 28) {
        return middleX
    }
    if (i == 26 || i == 29) {
        return boardWidth - sideWidth - pieceWidth
    }
    throw RangeError("getStackOriginX got unexpected argument " + i)
}

export const getStackOriginY = (i: number): number => {
    if (i < 12 || i == 25) {
        return sideWidth + pieceWidth / 2
    }
    if (i < 24 || i == 28) {
        return boardHeight - sideWidth - pieceWidth / 2
    }

    if (i == 24 || i == 26) {
        return sideWidth
    }
    if (i == 27 || i == 29) {
        return boardHeight - sideWidth - pieceHeight
    }
    throw RangeError("getStackOriginY got unexpected argument " + i)

}

export const getTopDownPieceY = (originY: number, direction: Direction, pieceNum: number, total: number) => {
    const dif = total > 7 ? pieceWidth / 4 : total > 4 ? pieceWidth / 2 : pieceWidth
    return originY + pieceNum * dif * direction
}

export const getSidePieceY = (originY: number, direction: Direction, pieceNum: number) => {
    return originY + pieceHeight * pieceNum * direction
}
