import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./dimensions/board_size_constants";
import {useCallback, useEffect, useRef, useState} from "react";
import {BoardLayer} from "./board_layer/BoardLayer";
import PiecesLayer from "./pieces_layer/PiecesLayer";
import {SvgClientRectContext} from "./SvgClientRectContext";
import DiceLayer from "./dice_layer/DiceLayer";
import {HoverLayer} from "./hover_layer/HoverLayer";
import {MoveHintLayer} from "./move_hint_layer/MoveHintLayer";
import {DragPieceLayer} from "./pieces_layer/DragPieceLayer";
import {useLayoutMeasure} from "../../common/hooks";
import {useGameContext} from "../../game/GameContext";
import {GameController} from "../../game/game_controller/GameController";
import {LabelMapper} from "../../game/game_rule/LabelMapper";
import {IndexLayer} from "./index_layer/IndexLayer";
import {DoubleCubeLayer} from "./dice_layer/double_cube/DoubleCubeLayer";
import {DoubleCubePositionMapper} from "../../game/game_rule/DoubleCubePositionMapper";


export default function GameView(
    {
        gameController,
        labelMapper,
        doubleCubePositionMapper
    }: {
    gameController: GameController
    labelMapper?: LabelMapper,
    doubleCubePositionMapper?: DoubleCubePositionMapper
}) {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg, svgRef)
    useLayoutMeasure(measureSvg)

    const gameControllerSetter = useGameContext("gameControllerSetter")
    const labelState = useGameContext("labelState")
    const doubleCubeState = useGameContext("doubleCubeState")

    useEffect(() => {
        gameControllerSetter.set(gameController)
        labelState.labelMapper = labelMapper
        doubleCubeState.positionMapper = doubleCubePositionMapper
    }, [doubleCubePositionMapper, doubleCubeState, gameController, gameControllerSetter, labelMapper, labelState]);

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
                <DoubleCubeLayer />
                <DragPieceLayer/>
                <HoverLayer/>
            </svg>
        </SvgClientRectContext.Provider>
    )
}