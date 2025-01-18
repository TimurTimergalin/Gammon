import {
    boardHeight,
    boardWidth,
    middleX,
    pieceWidth,
    sideWidth,
    storeHeight,
    triangleTriggerHeight
} from "../dimensions/board_size_constants.ts";
import {HoverTrigger} from "./HoverTrigger.tsx";
import {useGameContext} from "../../../game/GameContext.ts";
import {getTriangleLeft} from "../dimensions/functions.ts";
import {useEffect} from "react";
import {pointX, pointY, PointEvent} from "../../../common/point_event.ts";

export function HoverLayer() {
    const hoverTracker = useGameContext("hoverTracker")

    useEffect(() => {
        const callback = (ev: PointEvent) => {
            hoverTracker.changeHoverIndex(pointX(ev), pointY(ev))
        }

        document.addEventListener("mousemove", callback)
        document.addEventListener("touchmove", callback)

        return () => {
            document.removeEventListener("mousemove", callback)
            document.removeEventListener("touchmove", callback)
        }

    }, [hoverTracker]);

    const triggers = []

    for (let i = 0; i < 12; ++i) {
        const leftX = getTriangleLeft(i)
        triggers.push(
            <HoverTrigger
                originX={leftX}
                originY={sideWidth}
                width={pieceWidth}
                height={triangleTriggerHeight}
                index={i}
                key={i}
            />,
            <HoverTrigger
                originX={leftX}
                originY={boardHeight - sideWidth - triangleTriggerHeight}
                width={pieceWidth}
                height={triangleTriggerHeight}
                index={12 + i}
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
            key={24}
        />,
        <HoverTrigger
            originX={middleX - pieceWidth / 2}
            originY={sideWidth}
            width={pieceWidth}
            height={triangleTriggerHeight}
            index={25}
            key={25}
        />,
        <HoverTrigger
            originX={boardWidth - sideWidth - pieceWidth}
            originY={sideWidth}
            width={pieceWidth}
            height={storeHeight}
            index={26}
            key={26}
        />,
        <HoverTrigger
            originX={sideWidth}
            originY={boardHeight - sideWidth - storeHeight}
            width={pieceWidth}
            height={storeHeight}
            index={27}
            key={27}
        />,
        <HoverTrigger
            originX={middleX - pieceWidth / 2}
            originY={boardHeight - sideWidth - triangleTriggerHeight}
            width={pieceWidth}
            height={triangleTriggerHeight}
            index={28}
            key={28}
        />,
        <HoverTrigger
            originX={boardWidth - sideWidth - pieceWidth}
            originY={boardHeight - sideWidth - storeHeight}
            width={pieceWidth}
            height={storeHeight}
            index={29}
            key={29}
        />
    )

    return (
        <>
            {triggers}
        </>
    )
}