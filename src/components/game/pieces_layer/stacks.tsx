import {pieceHeight, pieceWidth} from "../board_size_constants.ts";
import {SidePiece, TopDownPiece} from "./pieces.js";
import {Color} from "../color.ts";
import {Direction} from "./direction.ts";
import styled, {css, keyframes} from "styled-components";

interface StackProps {
    quantity: number,
    color: Color | null,
    direction: Direction,
    originX: number,
    originY: number,
    fromX?: number,
    fromY?: number
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

export const TopDownStack = ({quantity, color, direction, originX, originY, fromX, fromY}: StackProps) => {
    const dif = quantity > 7 ? pieceWidth / 4 : quantity > 4 ? pieceWidth / 2 : pieceWidth
    const pieces = []
    for (let i = 0; i < quantity; ++i) {
        if (i === quantity - 1 && fromX !== undefined) {
            continue
        }

        pieces.push(
            <AligningTopDownPiece color={color!} cx={originX} cy={originY + i * dif * direction} key={i}/>
        )
    }
    const lastCy = originY + (quantity - 1) * dif * direction
    return (
        <>
            {pieces}
            {
                quantity > 0 && fromX !== undefined &&
                <HomingTopDownPiece color={color!} cx={originX} cy={lastCy} fromX={fromX} fromY={fromY!} />
            }
        </>
    )
}

export const SideStack = ({quantity, color, direction, originX, originY}: StackProps) => {
    const pieces = []
    for (let i = 0; i < quantity; ++i) {
        pieces.push(
            <SidePiece color={color!} x={originX} y={originY + pieceHeight * i * direction} key={i}/>
        )
    }
    return (
        <>
            {pieces}
        </>
    )
}

