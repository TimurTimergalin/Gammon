import {useMousePosition} from "../../../common/hooks";
import {boardHeight, boardWidth, pieceWidth, svgOriginX, svgOriginY} from "../dimensions/board_size_constants";
import {TopDownPiece} from "./pieces";
import {useContext} from "react";
import {SvgClientRectContext} from "../SvgClientRectContext";
import {Color} from "../../../common/color";
import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";

function clientToSvg(clientX: number, clientY: number, clientRect: DOMRect): [number, number] {
    const svgX = svgOriginX + boardWidth * (clientX - clientRect.left) / (clientRect.width)
    const svgY = svgOriginY + boardHeight * (clientY - clientRect.top) / (clientRect.height)
    return [svgX, svgY]
}

function clampSvgCoordinates(x: number, y: number) {
    const minX = svgOriginX + pieceWidth / 2
    const maxX = svgOriginX + boardWidth - pieceWidth / 2
    const minY = svgOriginY + pieceWidth / 2
    const maxY = svgOriginY + boardHeight - pieceWidth / 2

    return [Math.max(minX, Math.min(x, maxX)), Math.max(minY, Math.min(y, maxY))]
}

function DragPiece({initClientX, initClientY, color}: {
    initClientX: number,
    initClientY: number,
    color: Color
}) {
    const svgClientRect = useContext(SvgClientRectContext)
    const [clientX, clientY] = useMousePosition(initClientX, initClientY)
    const [svgX, svgY] = svgClientRect !== null ? clampSvgCoordinates(...clientToSvg(clientX, clientY, svgClientRect)) : [0, 0]

    return <TopDownPiece color={color} cx={svgX} cy={svgY}/>
}

export const DragPieceLayer = observer(function DragPieceLayer() {
    const dragState = useGameContext("dragState")
    return (
        <>
            {dragState.dragStatus !== null &&
                <DragPiece
                    color={dragState.dragStatus.pickedColor!}
                    initClientX={dragState.dragStatus.clickX!}
                    initClientY={dragState.dragStatus.clickY!}
                />}
        </>
    )
})