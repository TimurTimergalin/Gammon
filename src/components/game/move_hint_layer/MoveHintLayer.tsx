import {getTriangleLeft} from "../dimensions/functions.ts";
import {
    boardHeight,
    boardWidth,
    pieceWidth,
    sideWidth,
    storeHeight,
    triangleHeight
} from "../dimensions/board_size_constants.ts";
import {HintToken} from "./HintToken.tsx";

export const MoveHintLayer = () => {
    const tokens = []
    const topCy = sideWidth + triangleHeight / 3
    const bottomCy = boardHeight - sideWidth - triangleHeight / 3
    for (let i = 0; i < 12; ++i) {
        const cx = getTriangleLeft(i) + pieceWidth / 2
        tokens.push(
            <HintToken cx={cx} cy={topCy} index={i} key={i}/>,
            <HintToken cx={cx} cy={bottomCy} index={12 + i} key={12 + i}/>
        )
    }

    tokens.push(
        <HintToken cx={sideWidth + pieceWidth / 2} cy={sideWidth + storeHeight / 2} index={24} key={24}/>,
        <HintToken cx={boardWidth / 2} cy={topCy} index={25} key={25}/>,
        <HintToken cx={boardWidth - sideWidth - pieceWidth / 2} cy={sideWidth + storeHeight / 2} index={26}
                   key={26}/>,
        <HintToken cx={sideWidth + pieceWidth / 2} cy={boardHeight - sideWidth - storeHeight / 2} index={27}
                   key={27}/>,
        <HintToken cx={boardWidth / 2} cy={bottomCy} index={28} key={28}/>,
        <HintToken cx={boardWidth - sideWidth - pieceWidth / 2} cy={boardHeight - sideWidth - storeHeight / 2}
                   index={29} key={29}/>
    )
    return (
        <>
            {tokens}
        </>
    )
}