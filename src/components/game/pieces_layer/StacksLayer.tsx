import {useGameContext} from "../common/GameContext.ts";
import {getStackDirection, getStackOriginX, getStackOriginY, getStackType,} from "../dimensions/functions.ts";

export function StacksLayer() {
    const gameState = useGameContext("gameState")
    const stacks = []

    for (let i = 0; i < 30; ++i) {
        const StackType = getStackType(i)
        stacks.push(
            <StackType
                pieces={gameState.getPositionProps(i).pieces}
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
}