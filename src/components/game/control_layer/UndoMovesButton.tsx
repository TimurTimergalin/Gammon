import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";

export const UndoMovesButton = observer(() => {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => {
        gameController.undoMoves()
    }

    return (
        <button disabled={!gameState.movesMade} onClick={onCLickCallback}>Откатить ход</button>
    )
})