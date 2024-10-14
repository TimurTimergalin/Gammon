import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./board_size_constants.ts";
import {useCallback, useRef, useState} from "react";
import {useLayoutMeasure} from "../../hooks";
import {BoardLayer} from "./board_layer/BoardLayer.tsx";
import PiecesLayer from "./pieces_layer/PiecesLayer.js";
import {SvgClientRectContext} from "./svg_client_rect_context.ts";
import {GameState, GameStateContext} from "./common/GameState.ts";
import {Color} from "./color.ts";
import DiceLayer from "./dice_layer/DiceLayer.tsx";
import {HoverLayer} from "./hover_layer/HoverLayer.tsx";
import {HoverTracker, HoverTrackerContext} from "./common/HoverTracker.ts";
import WithGlobals, {ContextWithInit} from "../../context_helpers.tsx";

export default function GameView() {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg)

    const placement = new Map()
    placement.set(11, {quantity: 2, color: Color.WHITE})
    placement.set(0, {quantity: 5, color: Color.WHITE})
    placement.set(16, {quantity: 3, color: Color.WHITE})
    placement.set(18, {quantity: 5, color: Color.WHITE})

    placement.set(23, {quantity: 2, color: Color.BLACK})
    placement.set(12, {quantity: 5, color: Color.BLACK})
    placement.set(4, {quantity: 3, color: Color.BLACK})
    placement.set(6, {quantity: 5, color: Color.BLACK})


    const globals: ContextWithInit<[GameState | null, HoverTracker | null]> = [
        [new GameState(placement, null, null), GameStateContext],
        [new HoverTracker(), HoverTrackerContext]
    ]



    return (
        <SvgClientRectContext.Provider value={svgRect}>
            <WithGlobals contexts={globals}>
                <svg
                    viewBox={`${svgOriginX} ${svgOriginY} ${boardWidth} ${boardHeight}`}
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio={"xMinYMin"}
                    ref={svgRef}>
                    <BoardLayer/>
                    <DiceLayer/>
                    <PiecesLayer/>
                    <HoverLayer/>
                </svg>
            </WithGlobals>
        </SvgClientRectContext.Provider>
    )
}