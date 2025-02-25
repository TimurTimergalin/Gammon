import {boardHeight, boardWidth, svgOriginX, svgOriginY} from "./dimensions/board_size_constants";
import {useCallback, useRef, useState} from "react";
import {BoardLayer} from "./board_layer/BoardLayer";
import PiecesLayer from "./pieces_layer/PiecesLayer";
import {SvgClientRectContext} from "./SvgClientRectContext";
import DiceLayer from "./dice_layer/DiceLayer";
import {HoverLayer} from "./hover_layer/HoverLayer";
import {MoveHintLayer} from "./move_hint_layer/MoveHintLayer";
import {DragPieceLayer} from "./pieces_layer/DragPieceLayer";
import {useLayoutMeasure} from "../../common/hooks";
import {IndexLayer} from "./index_layer/IndexLayer";
import {DoubleCubeLayer} from "./dice_layer/double_cube/DoubleCubeLayer";


export default function GameView() {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgRect, setSvgRect] = useState<DOMRect | null>(null)
    const measureSvg = useCallback(() => setSvgRect(svgRef.current!.getBoundingClientRect()), [])
    useLayoutMeasure(measureSvg, svgRef)
    useLayoutMeasure(measureSvg)

    return (
        <SvgClientRectContext.Provider value={svgRect}>
            <svg
                viewBox={`${svgOriginX} ${svgOriginY} ${boardWidth} ${boardHeight}`}
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio={"xMinYMin"}
                ref={svgRef}>
                <BoardLayer/>
                <HoverLayer/>
                <IndexLayer />
                <PiecesLayer/>
                <MoveHintLayer/>
                <DiceLayer/>
                <DoubleCubeLayer />
                <DragPieceLayer/>
            </svg>
        </SvgClientRectContext.Provider>
    )
}