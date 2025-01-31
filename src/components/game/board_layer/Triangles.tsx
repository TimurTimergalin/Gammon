import {boardHeight, pieceWidth, sideWidth, triangleHeight} from "../dimensions/board_size_constants";
import {useGameContext} from "../../../game/GameContext";
import {observer} from "mobx-react-lite";
import {focusedColor} from "./color_constants";
import {getTriangleLeft} from "../dimensions/functions";

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

export const Triangles = observer(function Triangles() {
    const dragState = useGameContext("dragState")

    const darkerTriangleColor = "#b28660"
    const lighterTriangleColor = "#deb184"
    const triangles = []

    for (let i = 0; i < 12; ++i) {
        const leftX = getTriangleLeft(i)

        triangles.push(
            <PointUpTriangle
                leftX={leftX}
                color={i % 2 === 0 ? darkerTriangleColor : lighterTriangleColor}
                focused={dragState.pickedFrom === 12 + i}
                key={i}/>,
            <PointDownTriangle
                leftX={leftX}
                color={i % 2 === 0 ? lighterTriangleColor : darkerTriangleColor}
                focused={dragState.pickedFrom === i}
                key={12 + i}/>
        )
    }
    return (
        <>
            {triangles}
        </>
    )
})