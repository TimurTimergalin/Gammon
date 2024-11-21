import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./dimensions/board_size_constants.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import {useLayoutMeasure} from "../../hooks";
import {BoardLayer} from "./board_layer/BoardLayer.tsx";
import PiecesLayer from "./pieces_layer/PiecesLayer.js";
import {SvgClientRectContext} from "./SvgClientRectContext.ts";
import {GameState} from "./common/game_state/GameState.ts";
import {Color} from "./common/color.ts";
import DiceLayer from "./dice_layer/DiceLayer.tsx";
import {HoverLayer} from "./hover_layer/HoverLayer.tsx";
import {HoverTracker} from "./common/HoverTracker.ts";
import {GameContext, GameContextProvider} from "./common/GameContext.ts";
import {MoveHintLayer} from "./move_hint_layer/MoveHintLayer.tsx";
import {DragPieceLayer} from "./pieces_layer/DragPieceLayer.tsx";
import {LocalGameController} from "./common/game_controller/LocalGameController.ts";
import {BackgammonPositionIndex, BackgammonPositionProp} from "./common/game_rule/backgammon/types.ts";
import {BackgammonRules} from "./common/game_rule/backgammon/Rules.ts";
import {BackgammonIndexMapping} from "./common/game_rule/backgammon/IndexMapping.ts";
import {BackgammonPropMapping} from "./common/game_rule/backgammon/PropMapping.ts";
import {backgammonDefaultPlacement} from "./common/game_rule/backgammon/placement_factory.ts";
import {FinishTurnButton} from "./buttons/FinishTurnButton.tsx";
import {UndoMovesButton} from "./buttons/UndoMovesButton.tsx";


export default function GameView() {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg, svgRef)
    useLayoutMeasure(measureSvg)

    const gameState = useRef(new GameState())
    const hoverTracker = useRef(new HoverTracker())
    const gameController = useRef(
        new LocalGameController<BackgammonPositionIndex, BackgammonPositionProp>(
            new BackgammonRules(),
            new BackgammonIndexMapping(Color.WHITE),
            new BackgammonPropMapping(),
            gameState.current,
            backgammonDefaultPlacement
        )
    )

    useEffect(
        () => gameController.current.init(),
        []
    )

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
                <FinishTurnButton/>
                <UndoMovesButton/>
            </SvgClientRectContext.Provider>
        </GameContextProvider>
    )
}