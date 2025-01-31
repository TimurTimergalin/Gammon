import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";
import {additionalStyle, imagStyle} from "./common";
import {AccentedButton} from "../../AccentedButton";

export const FinishTurnButton = observer(function FinishTurnButton() {
    const gameState = useGameContext("controlButtonsState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => gameController.endTurn()

    return (
        <AccentedButton onClick={onCLickCallback} disabled={!gameState.turnComplete} style={additionalStyle()} type={"button"}>
            <img src={"/submit.svg"} alt={"Finish"} style={imagStyle()}/>
        </AccentedButton>
    )
})