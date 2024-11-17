import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./dimensions/board_size_constants.ts";
import {useCallback, useRef, useState} from "react";
import {useLayoutMeasure} from "../../hooks";
import {BoardLayer} from "./board_layer/BoardLayer.tsx";
import PiecesLayer from "./pieces_layer/PiecesLayer.js";
import {SvgClientRectContext} from "./svg_client_rect_context.ts";
import {GameState, PiecePlacement, PositionState} from "./common/GameState.ts";
import {Color} from "./color.ts";
import DiceLayer from "./dice_layer/DiceLayer.tsx";
import {HoverLayer} from "./hover_layer/HoverLayer.tsx";
import {HoverTracker} from "./common/HoverTracker.ts";
import {GameContext, GameContextProvider} from "./common/GameContext.ts";
import {MoveHintLayer} from "./move_hint_layer/MoveHintLayer.tsx";
import {DragPieceLayer} from "./pieces_layer/DragPieceLayer.tsx";
import DebugGameController from "./common/game_controller/DebugGameController.ts";

const initGameState = () => {  // for dev purposes only
    const placement: PiecePlacement = new Map()
    placement.set(11, new PositionState([{color: Color.WHITE}]))
    placement.set(0, new PositionState([{color: Color.WHITE}]))
    placement.set(16, new PositionState([{color: Color.WHITE, from: {x: 0, y: 0}}]))
    placement.set(18, new PositionState([{color: Color.WHITE}]))

    placement.set(23, new PositionState([{color: Color.BLACK}]))
    placement.set(12, new PositionState([{color: Color.BLACK}]))
    placement.set(4, new PositionState([{color: Color.BLACK}]))
    placement.set(6, new PositionState([{color: Color.BLACK}]))

    return new GameState(placement)
}

export default function GameView() {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg)

    const gameState = useRef(initGameState())
    const hoverTracker = useRef(new HoverTracker())
    const gameController = useRef(new DebugGameController(gameState.current))

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
                    <MoveHintLayer/>
                    <DiceLayer/>
                    <DragPieceLayer/>
                    <HoverLayer/>
                </svg>
            </SvgClientRectContext.Provider>
        </GameContextProvider>
    )
}