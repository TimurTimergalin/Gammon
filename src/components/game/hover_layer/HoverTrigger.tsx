import {HoverTracker} from "../common/HoverTracker.ts";

export const HoverTrigger = (
    {originX, originY, width, height, index, hoverTracker}: {
        originX: number,
        originY: number,
        width: number,
        height: number,
        index: number,
        hoverTracker: HoverTracker
    }) => {

    return (
        <rect
            x={originX}
            y={originY}
            width={width}
            height={height}
            fill={"#ffffff00"}
            onMouseEnter={() => hoverTracker.hoveredIndex = index}
            onMouseLeave={() => hoverTracker.hoveredIndex = null}
        />
    )
}