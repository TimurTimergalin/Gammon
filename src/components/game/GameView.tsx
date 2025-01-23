import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./dimensions/board_size_constants.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import {BoardLayer} from "./board_layer/BoardLayer.tsx";
import PiecesLayer from "./pieces_layer/PiecesLayer.js";
import {SvgClientRectContext} from "./SvgClientRectContext.ts";
import DiceLayer from "./dice_layer/DiceLayer.tsx";
import {HoverLayer} from "./hover_layer/HoverLayer.tsx";
import {MoveHintLayer} from "./move_hint_layer/MoveHintLayer.tsx";
import {DragPieceLayer} from "./pieces_layer/DragPieceLayer.tsx";
import {useLayoutMeasure} from "../../common/hooks.ts";
import {useGameContext} from "../../game/GameContext.ts";
import {GameController} from "../../game/game_controller/GameController.ts";
import {LabelMapper} from "../../game/game_rule/LabelMapper.ts";
import {IndexLayer} from "./index_layer/IndexLayer.tsx";


export default function GameView(
    {
        gameController,
        labelMapper
    }: {
    gameController: GameController
    labelMapper?: LabelMapper,
}) {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg, svgRef)
    useLayoutMeasure(measureSvg)

    const gameControllerSetter = useGameContext("gameControllerSetter")
    const labelState = useGameContext("labelState")

    useEffect(() => {
        gameControllerSetter.set(gameController)
        labelState.labelMapper = labelMapper
    }, [gameController, gameControllerSetter, labelMapper, labelState]);

    return (
        <SvgClientRectContext.Provider value={svgRect}>
            <svg
                viewBox={`${svgOriginX} ${svgOriginY} ${boardWidth} ${boardHeight}`}
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio={"xMinYMin"}
                ref={svgRef}>
                <BoardLayer/>
                <IndexLayer />
                <PiecesLayer/>
                <MoveHintLayer/>
                <DiceLayer/>
                <DragPieceLayer/>
                <HoverLayer/>
            </svg>
        </SvgClientRectContext.Provider>
    )
}