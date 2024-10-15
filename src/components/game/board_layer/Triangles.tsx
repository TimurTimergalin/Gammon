import {boardHeight, gapWidth, pieceWidth, sideWidth, triangleHeight} from "../board_size_constants.ts";
import {useGameContext} from "../common/GameContext.ts";
import {observer} from "mobx-react-lite";
import {focusedColor} from "./color_constants.ts";

const PointUpTriangle = ({leftX, color, focused}: { leftX: number, color: string, focused: boolean }) => {
    const d =
        `M ${leftX} ${boardHeight - sideWidth}
         l ${pieceWidth / 2} ${-triangleHeight}
         l ${pieceWidth / 2} ${triangleHeight}`
    return (
        <>
            <path
                d={d}
                fill={color}
            />
            {focused &&
                <path
                    d={d}
                    fill={focusedColor}
                />
            }
        </>
    )
}
const PointDownTriangle = ({leftX, color, focused}: { leftX: number, color: string, focused: boolean }) => {
    const d =
        `M ${leftX} ${sideWidth}
         l ${pieceWidth / 2} ${triangleHeight} 
         l ${pieceWidth / 2} ${-triangleHeight}`;
    return (
        <>
            <path
                d={d}
                fill={color}
            />
            {focused &&
                <path
                    d={d}
                    fill={focusedColor}
                />
            }
        </>
    )
}

export const Triangles = observer(() => {
    const gameState = useGameContext("gameState")

    const darkerTriangleColor = "#B08968"
    const lighterTriangleColor = "#DDB892"
    const triangles = []

    for (let i = 0; i < 12; ++i) {
        const leftX = sideWidth + pieceWidth + sideWidth + i * pieceWidth + (i >= 6 ? sideWidth + gapWidth + sideWidth : 0)

        triangles.push(
            <PointUpTriangle
                leftX={leftX}
                color={i % 2 === 0 ? darkerTriangleColor : lighterTriangleColor}
                focused={gameState.pickedFrom === 12 + i}
                key={i}/>,
            <PointDownTriangle
                leftX={leftX}
                color={i % 2 === 0 ? lighterTriangleColor : darkerTriangleColor}
                focused={gameState.pickedFrom === i}
                key={12 + i}/>
        )
    }
    return (
        <>
            {triangles}
        </>
    )
})