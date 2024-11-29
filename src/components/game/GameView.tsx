import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./dimensions/board_size_constants.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import {BoardLayer} from "./board_layer/BoardLayer.tsx";
import PiecesLayer from "./pieces_layer/PiecesLayer.js";
import {SvgClientRectContext} from "./SvgClientRectContext.ts";
import {GameState} from "./common/game_state/GameState.ts";
import DiceLayer from "./dice_layer/DiceLayer.tsx";
import {HoverLayer} from "./hover_layer/HoverLayer.tsx";
import {HoverTracker} from "./common/HoverTracker.ts";
import {GameContext, GameContextProvider} from "./common/GameContext.ts";
import {MoveHintLayer} from "./move_hint_layer/MoveHintLayer.tsx";
import {DragPieceLayer} from "./pieces_layer/DragPieceLayer.tsx";
import {ButtonPanel} from "./buttons/ButtonPanel.tsx";
import {GameController} from "./common/game_controller/GameController.ts";
import {PlayerState} from "./common/game_state/PlayerState.ts";
import {PlayerIcon} from "./players/PlayerIcon.tsx";
import {syncDummyGameControllerFactory} from "./common/game_controller/factories/dummy.ts";
import {useLayoutMeasure} from "../../hooks.ts";


export default function GameView({gameControllerFactory, displayControls = true, player1, player2}: {
    gameControllerFactory: (_: GameState) => Promise<GameController>,
    displayControls?: boolean,
    player1: PlayerState,
    player2: PlayerState
}) {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg, svgRef)
    useLayoutMeasure(measureSvg)

    const gameState = useRef(new GameState(player1, player2))
    const hoverTracker = useRef(new HoverTracker())
    const gameController = useRef<GameController>(syncDummyGameControllerFactory(gameState.current))

    useEffect(
        () => {
            gameController.current.init()  // Always dummy
            const prom = gameControllerFactory(gameState.current)
            prom.then((cont) => {
            gameController.current = cont
            return cont.init()
        })
        },
        [gameControllerFactory]
    )
    return (
        <GameContextProvider value={new GameContext(gameState, hoverTracker, gameController)}>
            <SvgClientRectContext.Provider value={svgRect}>
                <div style={{display: "flex", marginBottom: "4px"}}>
                    <PlayerIcon username={gameState.current.player2.username}
                                iconSrc={gameState.current.player2.iconSrc}/>
                </div>
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
                <div style={{display: "flex"}}>
                    <PlayerIcon username={gameState.current.player1.username}
                                iconSrc={gameState.current.player1.iconSrc}/>
                    <div style={{flex: 1}}></div>
                    {displayControls &&
                        <ButtonPanel/>
                    }
                </div>
            </SvgClientRectContext.Provider>
        </GameContextProvider>
    )
}