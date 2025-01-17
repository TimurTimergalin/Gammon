import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./dimensions/board_size_constants.ts";
import {useCallback, useRef, useState} from "react";
import {BoardLayer} from "./board_layer/BoardLayer.tsx";
import PiecesLayer from "./pieces_layer/PiecesLayer.js";
import {SvgClientRectContext} from "./SvgClientRectContext.ts";
import DiceLayer from "./dice_layer/DiceLayer.tsx";
import {HoverLayer} from "./hover_layer/HoverLayer.tsx";
import {MoveHintLayer} from "./move_hint_layer/MoveHintLayer.tsx";
import {DragPieceLayer} from "./pieces_layer/DragPieceLayer.tsx";
import {ButtonPanel} from "./buttons/ButtonPanel.tsx";
import {PlayerState} from "../../game/player_info/PlayerState.ts";
import {PlayerIcon} from "./players/PlayerIcon.tsx";
import {useLayoutMeasure} from "../../hooks.ts";
import {useGameContext} from "../../game/GameContext.ts";
import {GameController} from "../../game/game_controller/GameController.ts";


export default function GameView({gameController, displayControls = true, player1, player2}: {
    gameController: GameController
    displayControls?: boolean,
    player1?: PlayerState,
    player2?: PlayerState
}) {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg, svgRef)
    useLayoutMeasure(measureSvg)

    const gameControllerSetter = useGameContext("gameControllerSetter")
    const playersInfo = useGameContext("playersInfo")

    gameControllerSetter.set(gameController)
    playersInfo.player1 = player1 || playersInfo.player1
    playersInfo.player2 = player2 || playersInfo.player2

    return (
        <SvgClientRectContext.Provider value={svgRect}>
            <div style={{display: "flex", marginBottom: "4px"}}>
                <PlayerIcon username={playersInfo.player2.username}
                            iconSrc={playersInfo.player2.iconSrc}/>
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
                <PlayerIcon username={playersInfo.player1.username}
                            iconSrc={playersInfo.player1.iconSrc}/>
                <div style={{flex: 1}}></div>
                {displayControls &&
                    <ButtonPanel/>
                }
            </div>
        </SvgClientRectContext.Provider>
    )
}