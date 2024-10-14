import {
    boardHeight,
    frameWidth,
    gapWidth,
    middleX,
    pieceWidth,
    sideWidth,
    standHeight,
    storeHeight, triangleHeight
} from "../board_size_constants.ts";

const sideColor = "#9C6644"
const boardColor = "#E6CCB2"
const gapColor = "#7F5539"
const standColor = "#8f6347"
const frameColor = "#7F5539"

const Half = ({leftX}: {leftX: number}) => (
    <rect
        x={leftX + sideWidth / 2}
        y={sideWidth / 2}
        width={6 * pieceWidth + sideWidth}
        height={boardHeight - sideWidth}
        strokeWidth={sideWidth}
        stroke={sideColor}
        fill={boardColor}
    />
)
const Store = ({leftX}: {leftX: number}) => (
    <>
        <rect
            x={leftX + sideWidth / 2}
            y={sideWidth / 2}
            width={pieceWidth + sideWidth}
            height={boardHeight - sideWidth}
            strokeWidth={sideWidth}
            stroke={sideColor}
            fill={boardColor}
        />
        <rect
            x={leftX + sideWidth - 0.5}
            y={sideWidth + storeHeight}
            width={pieceWidth + 1}
            height={standHeight}
            fill={standColor}
        />
        <rect
            x={leftX + sideWidth - 0.5}
            y={sideWidth + storeHeight + 2 * standHeight}
            width={pieceWidth + 1}
            height={standHeight}
            fill={standColor}
        />
    </>
)
const Frame = ({leftX, width}: {leftX: number, width: number}) => (
    <rect
        x={leftX - frameWidth / 2}
        y={sideWidth - frameWidth / 2}
        width={width + frameWidth}
        height={boardHeight - 2 * sideWidth + frameWidth}
        fill={"none"}
        stroke={frameColor}
        strokeWidth={frameWidth}
    />
)

const PointUpTriangle = ({leftX, color}: {leftX: number, color: string}) => (
    <path
        d={`M ${leftX} ${boardHeight - sideWidth} l ${pieceWidth / 2} ${-triangleHeight} l ${pieceWidth / 2} ${triangleHeight}`}
        fill={color}
    />
)
const PointDownTriangle = ({leftX, color}: {leftX: number, color: string}) => (
    <path
        d={`M ${leftX} ${sideWidth} l ${pieceWidth / 2} ${triangleHeight} l ${pieceWidth / 2} ${-triangleHeight}`}
        fill={color}
    />
)

function Triangles() {
    const darkerTriangleColor = "#B08968"
    const lighterTriangleColor = "#DDB892"
    const triangles = []

    for (let i = 0; i < 12; ++i) {
        const leftX = sideWidth + pieceWidth + sideWidth + i * pieceWidth + (i >= 6 ? sideWidth + gapWidth + sideWidth : 0)

        triangles.push(
            <PointUpTriangle leftX={leftX} color={i % 2 === 0 ? darkerTriangleColor : lighterTriangleColor} key={i}/>,
            <PointDownTriangle leftX={leftX} color={i % 2 === 0 ? lighterTriangleColor : darkerTriangleColor} key={12 + i}/>
        )
    }
    return (
        <>
            {triangles}
        </>
    )
}

export function BoardLayer() {
    return (
        <>
            <Store leftX={0}/>
            <Half leftX={sideWidth + pieceWidth}/>
            <Half leftX={middleX + gapWidth / 2}/>
            <Store leftX={middleX + gapWidth / 2 + sideWidth + 6 * pieceWidth}/>

            <line
                x1={middleX}
                y1={0}
                x2={middleX}
                y2={boardHeight}
                stroke={gapColor}
                strokeWidth={gapWidth + 1}
            />
            <Triangles />
            <Frame leftX={sideWidth} width={pieceWidth}/>
            <Frame leftX={sideWidth + pieceWidth + sideWidth} width={6 * pieceWidth}/>
            <Frame leftX={middleX + gapWidth / 2 + sideWidth} width={6 * pieceWidth}/>
            <Frame leftX={middleX + gapWidth / 2 + sideWidth + 6 * pieceWidth + sideWidth} width={pieceWidth}/>
        </>
    );
}