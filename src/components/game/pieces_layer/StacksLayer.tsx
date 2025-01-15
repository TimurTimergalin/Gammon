import {useGameContext} from "../../../game/GameContext.ts";
import {getStackDirection, getStackOriginX, getStackOriginY, getStackType,} from "../dimensions/functions.ts";
import {observer} from "mobx-react-lite";

export const StacksLayer = observer(function StacksLayer() {
    const boardState = useGameContext("boardState")
    const stacks = []

    for (let i = 0; i < 30; ++i) {
        const StackType = getStackType(i)
        stacks.push(
            <StackType
                pieces={boardState.get(i).pieces}
                direction={getStackDirection(i)}
                originX={getStackOriginX(i)}
                originY={getStackOriginY(i)}
                key={i}
            />
        )
    }

    return (
        <>
            {stacks}
        </>
    )
})