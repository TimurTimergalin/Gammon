import {observer} from "mobx-react-lite";
import {boardHeight, gapWidth, middleX} from "../dimensions/board_size_constants.ts";
import {focusedColor, gapColor} from "./color_constants.ts";
import {useGameContext} from "../common/GameContext.ts";

export const MiddleLine = observer(function MiddleLine() {
    const gameState = useGameContext("gameState")
    return (
        <>
            <line
                x1={middleX}
                y1={0}
                x2={middleX}
                y2={boardHeight}
                stroke={gapColor}
                strokeWidth={gapWidth + 1}
            />
            {(gameState.pickedFrom === 25 || gameState.pickedFrom === 28) &&
                <line
                    x1={middleX}
                    y1={0}
                    x2={middleX}
                    y2={boardHeight}
                    stroke={focusedColor}
                    strokeWidth={gapWidth + 1}
                />
            }
        </>
    )
})