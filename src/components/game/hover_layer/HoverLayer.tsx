import {
    boardHeight,
    boardWidth,
    middleX,
    pieceWidth,
    sideWidth,
    storeHeight,
    triangleTriggerHeight
} from "../dimensions/board_size_constants";
import {HoverTrigger} from "./HoverTrigger";
import {useGameContext} from "../../../game/GameContext";
import {getTriangleLeft} from "../dimensions/functions";
import {useEffect} from "react";
import {PointEvent, pointX, pointY} from "../../../common/point_event";

export function HoverLayer() {
    const hoverTracker = useGameContext("hoverTracker")

    useEffect(() => {
        const moveCallback = (ev: PointEvent) => {
            hoverTracker.changeHoverIndex(pointX(ev), pointY(ev))
        }

        // const touchEndCallback = (e: Event) => {
        //     if (hoverTracker.clearHoverIndex()) {
        //         e.preventDefault()
        //     }
        // }

        document.addEventListener("mousemove", moveCallback)
        document.addEventListener("touchmove", moveCallback)
        // document.addEventListener("touchend", touchEndCallback)
        // document.addEventListener("touchcancel", touchEndCallback)

        return () => {
            document.removeEventListener("mousemove", moveCallback)
            document.removeEventListener("touchmove", moveCallback)
            // document.removeEventListener("touchend", touchEndCallback)
            // document.removeEventListener("touchcancel", touchEndCallback)
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