import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./dimensions/board_size_constants.ts";
import {useCallback, useRef, useState} from "react";
import {useLayoutMeasure} from "../../hooks";
import {BoardLayer} from "./board_layer/BoardLayer.tsx";
import PiecesLayer from "./pieces_layer/PiecesLayer.js";
import {SvgClientRectContext} from "./svg_client_rect_context.ts";
import {GameState} from "./common/GameState.ts";
import {Color} from "./color.ts";
import DiceLayer from "./dice_layer/DiceLayer.tsx";
import {HoverLayer} from "./hover_layer/HoverLayer.tsx";
import {HoverTracker} from "./common/HoverTracker.ts";
import ClientGameController from "./common/game_controller/ClientGameController.ts";
import {GameContext, GameContextProvider} from "./common/GameContext.ts";
import {MoveHintLayer} from "./move_hint_layer/MoveHintLayer.tsx";
import {DragPieceLayer} from "./pieces_layer/DragPieceLayer.tsx";

const initGameState = () => {  // for dev purposes only
    const placement = new Map()
    placement.set(11, {quantity: 2, color: Color.WHITE})
    placement.set(0, {quantity: 5, color: Color.WHITE})
    placement.set(16, {quantity: 3, color: Color.WHITE})
    placement.set(18, {quantity: 5, color: Color.WHITE})

    placement.set(23, {quantity: 2, color: Color.BLACK})
    placement.set(12, {quantity: 5, color: Color.BLACK})
    placement.set(4, {quantity: 3, color: Color.BLACK})
    placement.set(6, {quantity: 5, color: Color.BLACK})

    return new GameState(placement)
}

export default function GameView() {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg)

    const gameState = useRef(initGameState())
    const hoverTracker = useRef(new HoverTracker())
    const gameController = useRef(new ClientGameController(gameState.current, Color.WHITE))

    return (
        <GameContextProvider value={new GameContext(gameState.current, hoverTracker.current, gameController.current)}>
            <SvgClientRectContext.Provider value={svgRect}>
                <svg
                    viewBox={`${svgOriginX} ${svgOriginY} ${boardWidth} ${boardHeight}`}
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio={"xMinYMin"}
                    ref={svgRef}>
                    <BoardLayer/>
                    <PiecesLayer/>
                    <MoveHintLayer />
                    <DiceLayer/>
                    <DragPieceLayer />
                    <HoverLayer/>
                </svg>
            </SvgClientRectContext.Provider>
        </GameContextProvider>
    )
}