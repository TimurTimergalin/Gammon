import {useEffect, useRef} from "react";
import {useGameContext} from "../../../game/GameContext";

export const HoverTrigger = (
    {originX, originY, width, height, index}: {
        originX: number,
        originY: number,
        width: number,
        height: number,
        index: number,
    }) => {

    const hoverTracker = useGameContext("hoverTracker")

    const rect = useRef<SVGRectElement | null>(null)

    useEffect(() => {
        hoverTracker.hoverTriggerRects.set(index, rect.current!.getBoundingClientRect())
    });

    return (
        <rect
            x={originX}
            y={originY}
            width={width}
            height={height}
            fill={"#ffffff00"}
            ref={rect}
            aria-label={`HoverTrigger${index}`}
        />
    )
}