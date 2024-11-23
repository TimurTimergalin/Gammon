import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";
import {imagStyle} from "./common.tsx";
import {ControlButton} from "./ControlButton.tsx";

export const FinishTurnButton = observer(function FinishTurnButton() {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => gameController.endTurn()

    return (
        <ControlButton onClick={onCLickCallback} disabled={!gameState.turnComplete}>
            <img src={"submit.svg"} alt={"Finish"} style={imagStyle()}/>
        </ControlButton>
    )
})