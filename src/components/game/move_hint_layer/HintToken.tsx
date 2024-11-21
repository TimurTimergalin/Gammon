import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";

export const HintToken = observer(function HintToken({cx, cy, index}: {
    cx: number,
    cy: number,
    index: number
}) {
    const gameState = useGameContext("gameState")
    const fill = "#88888860"
    return (
        <>
            {gameState.legalMoves?.includes(index) &&
                <circle
                    r={15}
                    cx={cx}
                    cy={cy}
                    fill={fill}
                />
            }
        </>
    )
})