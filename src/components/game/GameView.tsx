import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./board_size_constants.ts";
import {useCallback, useRef, useState} from "react";
import {useLayoutMeasure} from "../../hooks";
import {BoardLayer} from "./BoardLayer.js";
import PiecesLayer from "./pieces_layer/PiecesLayer.js";
import {SvgClientRectContext} from "../../contexts";
import {GameState, GameStateContext} from "./GameState.js";
import {Color} from "./color.ts";
import {LayerStatus} from "./dice_layer/LayerStatus.ts";
import DiceLayer from "./dice_layer/DiceLayer.tsx";

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

    const dice1 = {
        value: 3,
        color: Color.WHITE,
        usageStatus: LayerStatus.NONE,
        unavailabilityStatus: LayerStatus.FULL
    }

    const dice2 = {
        value: 4,
        color: Color.BLACK,
        usageStatus: LayerStatus.HALF,
        unavailabilityStatus: LayerStatus.HALF
    }

    const gameStateRef = useRef(new GameState(placement, dice1, dice2))

    return (
        <SvgClientRectContext.Provider value={svgRect}>
            <GameStateContext.Provider value={gameStateRef.current}>
                <svg
                    viewBox={`${svgOriginX} ${svgOriginY} ${boardWidth} ${boardHeight}`}
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio={"xMinYMin"}
                    ref={svgRef}>
                    <BoardLayer/>
                    <DiceLayer />
                    <PiecesLayer/>
                </svg>
            </GameStateContext.Provider>
        </SvgClientRectContext.Provider>
    )
}