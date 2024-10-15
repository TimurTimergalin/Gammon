import {
    boardHeight,
    boardWidth,
    middleX,
    pieceWidth,
    sideWidth,
    storeHeight,
    triangleHeight
} from "../dimensions/board_size_constants.ts";
import {HoverTrigger} from "./HoverTrigger.tsx";
import {useGameContext} from "../common/GameContext.ts";
import {getTriangleLeft} from "../dimensions/functions.ts";

export function HoverLayer() {
    const hoverTracker = useGameContext("hoverTracker")

    const triggers = []

    const triangleTriggerHeight = triangleHeight + pieceWidth / 2

    for (let i = 0; i < 12; ++i) {
        const leftX = getTriangleLeft(i)
        triggers.push(
            <HoverTrigger
                originX={leftX}
                originY={sideWidth}
                width={pieceWidth}
                height={triangleTriggerHeight}
                index={i}
                hoverTracker={hoverTracker}
                key={i}
            />,
            <HoverTrigger
                originX={leftX}
                originY={boardHeight - sideWidth - triangleTriggerHeight}
                width={pieceWidth}
                height={triangleTriggerHeight}
                index={12 + i}
                hoverTracker={hoverTracker}
                key={12 + i}
            />
        )
    }

    triggers.push(
        <HoverTrigger
            originX={sideWidth}
            originY={sideWidth}
            width={pieceWidth}
            height={storeHeight}
            index={24}
            hoverTracker={hoverTracker}
            key={24}
        />,
        <HoverTrigger
            originX={middleX - pieceWidth / 2}
            originY={sideWidth}
            width={pieceWidth}
            height={triangleTriggerHeight}
            index={25}
            hoverTracker={hoverTracker}
            key={25}
        />,
        <HoverTrigger
            originX={boardWidth - sideWidth - pieceWidth}
            originY={sideWidth}
            width={pieceWidth}
            height={storeHeight}
            index={26}
            hoverTracker={hoverTracker}
            key={26}
        />,
        <HoverTrigger
            originX={sideWidth}
            originY={boardHeight - sideWidth - storeHeight}
            width={pieceWidth}
            height={storeHeight}
            index={27}
            hoverTracker={hoverTracker}
            key={27}
        />,
        <HoverTrigger
            originX={middleX - pieceWidth / 2}
            originY={boardHeight - sideWidth - triangleTriggerHeight}
            width={pieceWidth}
            height={triangleTriggerHeight}
            index={28}
            hoverTracker={hoverTracker}
            key={28}
        />,
        <HoverTrigger
            originX={boardWidth - sideWidth - pieceWidth}
            originY={boardHeight - sideWidth - storeHeight}
            width={pieceWidth}
            height={storeHeight}
            index={29}
            hoverTracker={hoverTracker}
            key={29}
        />
    )

    return (
        <>
            {triggers}
        </>
    )
}