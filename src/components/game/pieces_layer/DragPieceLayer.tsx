import {useMousePosition} from "../../../hooks";
import {boardHeight, boardWidth, pieceWidth, svgOriginX, svgOriginY} from "../dimensions/board_size_constants.ts";
import {TopDownPiece} from "./pieces";
import {useContext} from "react";
import {SvgClientRectContext} from "../svg_client_rect_context.ts";
import {Color} from "../common/color.ts";
import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";

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

export const DragPieceLayer = observer(() => {
    const gameState = useGameContext("gameState")
    return (
        <>
            {gameState.dragStatus !== null &&
                <DragPiece
                    color={gameState.dragStatus.pickedColor!}
                    initClientX={gameState.dragStatus.clickX!}
                    initClientY={gameState.dragStatus.clickY!}
                />}
        </>
    )
})