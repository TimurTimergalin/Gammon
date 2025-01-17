import {SidePiece, TopDownPiece} from "./pieces.js";
import {Direction} from "./direction.ts";
import styled, {css, keyframes} from "styled-components";

import {getSidePieceY, getTopDownPieceY} from "../dimensions/functions.ts";
import {observer} from "mobx-react-lite";
import {PieceState} from "../../../game/board/physical/types.ts";

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
        animation: ${keyframe} .1s linear;
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
        animation: ${keyframe} .1s linear;
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


export const TopDownStack = observer(function TopDownStack({pieces, direction, originX, originY}: StackProps) {
    const quantity = pieces.length
    const finalPieces = []

    let i = 0
    for (const piece of pieces) {
        const toX = originX
        const toY = getTopDownPieceY(originY, direction, i, quantity)
        if (piece.from !== undefined) {
            finalPieces.push(
                <HomingTopDownPiece color={piece.color} cx={toX} cy={toY} fromX={piece.from.x} fromY={piece.from.y}
                                    key={i}/>
            )
        } else {
            finalPieces.push(
                <AligningTopDownPiece color={piece.color} cx={toX} cy={toY} key={i}/>
            )
        }
        ++i
    }
    return (
        <>
            {finalPieces}
        </>
    )
})

export const SideStack = observer(function SideStack({pieces, direction, originX, originY}: StackProps) {
    const finalPieces = []
    let i = 0

    for (const piece of pieces) {
        const toX = originX
        const toY = getSidePieceY(originY, direction, i)
        if (piece.from === undefined) {
            finalPieces.push(
                <SidePiece x={toX} y={toY} color={piece.color} key={i}/>
            )
        } else {
            finalPieces.push(
                <HomingSidePiece color={piece.color} x={toX} y={toY} fromX={piece.from.x} fromY={piece.from.y} key={i}/>
            )
        }
        ++i
    }

    return (
        <>
            {finalPieces}
        </>
    )
})

