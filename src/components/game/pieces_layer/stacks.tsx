import {pieceHeight, pieceWidth} from "../board_size_constants.ts";
import {SidePiece, TopDownPiece} from "./pieces.js";
import {ForwardedRef, forwardRef, MutableRefObject} from "react";
import {Color} from "../color.ts";
import {Direction} from "./direction.ts";
import {HoverTracker} from "./HoverTracker.ts";
import {assertForced} from "../../../guards.ts";

interface StackProps {
    quantity: number,
    color: Color | null,
    direction: Direction,
    originX: number,
    originY: number
}

export const TopDownStack = ({quantity, color, direction, originX, originY}: StackProps) => {
    const dif = quantity > 7 ? pieceWidth / 4 : quantity > 4 ? pieceWidth / 2 : pieceWidth
    const pieces = []
    for (let i = 0; i < quantity; ++i) {
        pieces.push(
            <TopDownPiece color={color!} cx={originX} cy={originY + i * dif * direction} style={{transition: "cy .2s"}} key={i}/>
        )
    }
    return (
        <>
            {pieces}
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

export const HoverTrigger = forwardRef((
    {originX, originY, width, height, index} : {
        originX: number,
        originY: number,
        width: number,
        height: number,
        index: number
    },
    ref: ForwardedRef<HoverTracker>) => {
    assertForced<MutableRefObject<HoverTracker>>(ref)

    return (
        <rect
            x={originX}
            y={originY}
            width={width}
            height={height}
            fill={"#ffffff00"}
            onMouseEnter={() => ref.current.hoveredIndex = index}
            onMouseLeave={() => ref.current.hoveredIndex = null}
        />
    )
})

