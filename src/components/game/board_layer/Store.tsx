import {boardHeight, boardWidth, pieceWidth, sideWidth, standHeight, storeHeight} from "../board_size_constants.ts";
import {boardColor, focusedColor, sideColor, standColor} from "./color_constants.ts";
import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";

const FocusableStore = observer(({x, y, index}: { x: number, y: number, index: number }) => {
    const gameState = useGameContext("gameState")
    const focused = gameState.pickedFrom === index
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
        <FocusableStore x={sideWidth} y={sideWidth} index={24} />
        <FocusableStore x={boardWidth - sideWidth - pieceWidth} y={sideWidth} index={26} />
        <FocusableStore x={sideWidth} y={boardHeight - sideWidth - storeHeight} index={27} />
        <FocusableStore x={boardWidth - sideWidth - pieceWidth} y={boardHeight - sideWidth - storeHeight} index={29} />
    </>
)