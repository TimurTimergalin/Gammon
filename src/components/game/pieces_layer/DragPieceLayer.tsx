import {useMousePosition} from "../../../hooks";
import {boardHeight, boardWidth, pieceWidth, svgOriginX, svgOriginY} from "../dimensions/board_size_constants.ts";
import {TopDownPiece} from "./pieces";
import {useContext} from "react";
import {SvgClientRectContext} from "../SvgClientRectContext.ts";
import {Color} from "../../../game/color.ts";
import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext.ts";

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
    const [svgX, svgY] = clampSvgCoordinates(...clientToSvg(clientX, clientY, svgClientRect!))

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