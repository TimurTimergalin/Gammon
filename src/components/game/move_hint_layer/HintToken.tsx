import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext.ts";

export const HintToken = observer(function HintToken({cx, cy, index}: {
    cx: number,
    cy: number,
    index: number
}) {
    const legalMovesTracker = useGameContext("legalMovesTracker")
    const fill = "#77777790"
    return (
        <>
            {legalMovesTracker.has(index) &&
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