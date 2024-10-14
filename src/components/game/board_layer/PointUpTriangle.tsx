import {boardHeight, gapWidth, pieceWidth, sideWidth, triangleHeight} from "../board_size_constants.ts";

const PointUpTriangle = ({leftX, color}: { leftX: number, color: string }) => (
    <path
        d={`M ${leftX} ${boardHeight - sideWidth} l ${pieceWidth / 2} ${-triangleHeight} l ${pieceWidth / 2} ${triangleHeight}`}
        fill={color}
    />
)
const PointDownTriangle = ({leftX, color}: { leftX: number, color: string }) => (
    <path
        d={`M ${leftX} ${sideWidth} l ${pieceWidth / 2} ${triangleHeight} l ${pieceWidth / 2} ${-triangleHeight}`}
        fill={color}
    />
)

export function Triangles() {
    const darkerTriangleColor = "#B08968"
    const lighterTriangleColor = "#DDB892"
    const triangles = []

    for (let i = 0; i < 12; ++i) {
        const leftX = sideWidth + pieceWidth + sideWidth + i * pieceWidth + (i >= 6 ? sideWidth + gapWidth + sideWidth : 0)

        triangles.push(
            <PointUpTriangle leftX={leftX} color={i % 2 === 0 ? darkerTriangleColor : lighterTriangleColor} key={i}/>,
            <PointDownTriangle leftX={leftX} color={i % 2 === 0 ? lighterTriangleColor : darkerTriangleColor}
                               key={12 + i}/>
        )
    }
    return (
        <>
            {triangles}
        </>
    )
}