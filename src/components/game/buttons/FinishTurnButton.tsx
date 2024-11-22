import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";
import {buttonStyle, imagStyle} from "./common.ts";

export const FinishTurnButton = observer(function FinishTurnButton() {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => gameController.endTurn()

    return (
        <button disabled={!gameState.turnComplete} onClick={onCLickCallback} style={buttonStyle()}>
            <img src={"placeholder.svg"} alt={"Finish"} style={imagStyle()}/>
        </button>
    )
})