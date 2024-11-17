import {pieceHeight, pieceWidth} from "../dimensions/board_size_constants.ts";
import {SidePiece, TopDownPiece} from "./pieces.js";
import {Direction} from "./direction.ts";
import styled, {css, keyframes} from "styled-components";
import {PieceState} from "../common/GameState.ts";

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

const HomingTopDownPiece = styled(TopDownPiece)<{
    cx: number,
    cy: number,
    fromX: number,
    fromY: number
}>`
    ${props => homingTopDownAnimation(props.fromX, props.fromY, props.cx, props.cy)}
`

// TODO: добавить homing для SidePiece

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
        finalPieces.push(  // TODO: учитывать from
            <SidePiece x={originX} y={originY + pieceHeight * i * direction} color={piece.color}/>
        )
        ++i
    }

    return (
        <>
            {finalPieces}
        </>
    )
}

