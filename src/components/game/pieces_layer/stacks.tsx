import {pieceHeight, pieceWidth} from "../dimensions/board_size_constants.ts";
import {SidePiece, TopDownPiece} from "./pieces.js";
import {Direction} from "./direction.ts";
import styled, {css, keyframes} from "styled-components";

import {PieceState} from "../common/game_state/piece_placement.ts";

interface StackProps {
    pieces: PieceState[]
    direction: Direction,
    originX: number,
    originY: number,
}

const AligningTopDownPiece = styled(TopDownPiece)`
    transition: cy .2s
`

const homingTopDownAnimation = (xFrom: number, yFrom: number, xTo: number, yTo: number) => {
    const keyframe = keyframes`
        from {
            cx: ${xFrom};
            cy: ${yFrom};
        }
        to {
            cx: ${xTo};
            cy: ${yTo};
        }
    }
    `
    return css`
        animation: ${keyframe} .2s linear;
    `
}

const homingSidePieceAnimation = (xFrom: number, yFrom: number, xTo: number, yTo: number) => {
    const keyframe = keyframes`
        from {
            x: ${xFrom};
            y: ${yFrom};
        }
        to {
            x: ${xTo};
            y: ${yTo};
        }
    }
    `
    return css`
        animation: ${keyframe} .2s linear;
    `
}

const HomingTopDownPiece = styled(TopDownPiece)<{
    cx: number,
    cy: number,
    fromX: number,
    fromY: number
}>`
    ${props => homingTopDownAnimation(props.fromX, props.fromY, props.cx, props.cy)}
`
const HomingSidePiece = styled(SidePiece)<{
    x: number,
    y: number,
    fromX: number,
    fromY: number
}>`
    ${props => homingSidePieceAnimation(props.fromX, props.fromY, props.x, props.y)}
`


export const TopDownStack = ({pieces, direction, originX, originY}: StackProps) => {
    const quantity = pieces.length
    const dif = quantity > 7 ? pieceWidth / 4 : quantity > 4 ? pieceWidth / 2 : pieceWidth
    const finalPieces = []

    let i = 0
    for (const piece of pieces) {
        const toX = originX
        const toY = originY + i * dif * direction
        if (piece.from !== undefined) {
            finalPieces.push(
                <HomingTopDownPiece color={piece.color} cx={toX} cy={toY} fromX={piece.from.x} fromY={piece.from.y}/>
            )
        } else {
            finalPieces.push(
                <AligningTopDownPiece color={piece.color} cx={toX} cy={toY}/>
            )
        }
        ++i
    }
    return (
        <>
            {finalPieces}
        </>
    )
}

export const SideStack = ({pieces, direction, originX, originY}: StackProps) => {
    const finalPieces = []
    let i = 0

    for (const piece of pieces) {
        const toX = originX
        const toY = originY + pieceHeight * i * direction
        if (piece.from === undefined) {
            finalPieces.push(
                <SidePiece x={toX} y={toY} color={piece.color}/>
            )
        } else {
            finalPieces.push(
                <HomingSidePiece color={piece.color} x={toX} y={toY} fromX={piece.from.x} fromY={piece.from.y}/>
            )
        }
        ++i
    }

    return (
        <>
            {finalPieces}
        </>
    )
}

