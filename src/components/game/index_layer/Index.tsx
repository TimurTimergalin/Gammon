import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";
import {Color, colorFill} from "../../../common/color";
import {pieceWidth} from "../dimensions/board_size_constants";

export const Index = observer(function Index({index, x, y}: { index: number, x: number, y: number }) {
    const labelState = useGameContext("labelState")

    if (!(labelState.labelMapper !== undefined && labelState.color !== undefined)) {
        return <></>
    }

    const indices = labelState.labelMapper.map(index)

    const toDisplay = labelState.color === Color.WHITE ? indices.white : indices.black

    return (

        <text style={{fontSize: "30px", userSelect: "none"}} x={x + pieceWidth / 2} y={y} textAnchor={"middle"}>
            <tspan style={{fill: colorFill(labelState.color)}}>{toDisplay}</tspan>
        </text>

    )
})
