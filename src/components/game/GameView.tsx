import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./size_constants.js";
import {useCallback, useRef, useState} from "react";
import {useLayoutMeasure} from "../../hooks";
import {BoardLayer} from "./BoardLayer.js";
import PiecesLayer from "./pieces_layer/PiecesLayer.js";
import {SvgClientRectContext} from "../../contexts";
import {GameState, GameStateContext} from "./GameState.js";
import {Color} from "./pieces_layer/color.ts";

export default function GameView() {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg)

    const placement = new Map()
    placement.set(11, {quantity: 15, color: Color.BLACK})
    placement.set(23, {quantity: 15, color: Color.WHITE})

    const gameStateRef = useRef(new GameState(placement))

    return (
        <SvgClientRectContext.Provider value={svgRect}>
            <GameStateContext.Provider value={gameStateRef.current}>
                <svg
                    viewBox={`${svgOriginX} ${svgOriginY} ${boardWidth} ${boardHeight}`}
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio={"xMinYMin"}
                    ref={svgRef}>
                    <BoardLayer/>
                    <PiecesLayer/>
                </svg>
            </GameStateContext.Provider>
        </SvgClientRectContext.Provider>
    )
}