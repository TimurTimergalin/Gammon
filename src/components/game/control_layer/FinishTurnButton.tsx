import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";
import {useCallback} from "react";

export const FinishTurnButton = observer(() => {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = useCallback(
        () => {
            gameController.endTurn()
        }, [gameController]
    )

    return (
        <button disabled={!gameState.turnComplete} onClick={onCLickCallback}>Завершить ход</button>
    )
})