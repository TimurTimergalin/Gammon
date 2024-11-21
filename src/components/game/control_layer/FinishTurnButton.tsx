import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";

export const FinishTurnButton = observer(function FinishTurnButton() {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => gameController.endTurn()

    return (
        <button disabled={!gameState.turnComplete} onClick={onCLickCallback}>Завершить ход</button>
    )
})