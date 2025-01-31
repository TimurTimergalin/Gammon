import {boardHeight, gapWidth, pieceWidth, sideWidth} from "../dimensions/board_size_constants";
import {labelHeight} from "./common";
import {Index} from "./Index";

export const IndexLayer = () => {
    const toAdd = []

    for (let i = 0; i < 24; ++i) {
        const column = i % 12
        const x = sideWidth + pieceWidth + sideWidth + column * pieceWidth + (column >= 6 ? 2 * sideWidth + gapWidth: 0)

        const row = i >= 12 ? 1 : 0
        const labelGap = (sideWidth - labelHeight) / 2
        const y = row === 0 ? labelHeight : boardHeight - labelGap
        toAdd.push(<Index x={x} y={y} index={i} key={i}/>)
    }

    return <>{toAdd}</>
}