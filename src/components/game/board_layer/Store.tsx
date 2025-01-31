import {
    boardHeight,
    boardWidth,
    pieceWidth,
    sideWidth,
    standHeight,
    storeHeight
} from "../dimensions/board_size_constants";
import {boardColor, focusedColor, sideColor, standColor} from "./color_constants";
import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";

const FocusableStore = observer(function FocusableStore({x, y, index}: { x: number, y: number, index: number }) {
    const dragState = useGameContext("dragState")
    const focused = dragState.pickedFrom === index
    return (
        <>
            {focused &&
                <rect
                    x={x}
                    y={y}
                    width={pieceWidth}
                    height={storeHeight}
                    fill={focusedColor}
                />
            }
        </>
    )
})

export const Store = ({leftX}: { leftX: number }) => (
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
            x={leftX + sideWidth}
            y={sideWidth + storeHeight}
            width={pieceWidth}
            height={standHeight}
            fill={standColor}
        />
        <rect
            x={leftX + sideWidth}
            y={sideWidth + storeHeight + 2 * standHeight}
            width={pieceWidth}
            height={standHeight}
            fill={standColor}
        />
        <FocusableStore x={sideWidth} y={sideWidth} index={24}/>
        <FocusableStore x={boardWidth - sideWidth - pieceWidth} y={sideWidth} index={26}/>
        <FocusableStore x={sideWidth} y={boardHeight - sideWidth - storeHeight} index={27}/>
        <FocusableStore x={boardWidth - sideWidth - pieceWidth} y={boardHeight - sideWidth - storeHeight} index={29}/>
    </>
)