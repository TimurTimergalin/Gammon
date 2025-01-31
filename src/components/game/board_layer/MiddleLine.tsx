import {observer} from "mobx-react-lite";
import {boardHeight, gapWidth, middleX} from "../dimensions/board_size_constants";
import {focusedColor, gapColor} from "./color_constants";
import {useGameContext} from "../../../game/GameContext";

export const MiddleLine = observer(function MiddleLine() {
    const dragState = useGameContext("dragState")
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
            {(dragState.pickedFrom === 25 || dragState.pickedFrom === 28) &&
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