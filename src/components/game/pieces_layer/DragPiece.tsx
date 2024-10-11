import {useMousePosition} from "../../../hooks";
import {boardHeight, boardWidth, pieceWidth, svgOriginX, svgOriginY} from "../board_size_constants.ts";
import {TopDownPiece} from "./pieces";
import {useContext} from "react";
import {SvgClientRectContext} from "../../../contexts";
import {assertNN} from "../../../guards.ts";
import {Color} from "../color.ts";

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

export default function DragPiece({initClientX, initClientY, color}: {
    initClientX: number,
    initClientY: number,
    color: Color
}) {
    const svgClientRect = useContext(SvgClientRectContext)
    assertNN(svgClientRect)
    console.assert(svgClientRect !== null)
    const [clientX, clientY] = useMousePosition(initClientX, initClientY)
    const [svgX, svgY] = clampSvgCoordinates(...clientToSvg(clientX, clientY, svgClientRect))

    return <TopDownPiece color={color} cx={svgX} cy={svgY}/>
}