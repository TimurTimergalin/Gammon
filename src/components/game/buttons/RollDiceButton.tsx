import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";
import {AccentedButton} from "../../AccentedButton";
import {additionalStyle, imagStyle} from "./common";

export const RollDiceButton = observer(function RollDiceButton() {
    const buttonsState = useGameContext("controlButtonsState")
    const gameController = useGameContext("gameController")

    return (
        <AccentedButton onClick={() => gameController.rollDice()} disabled={!buttonsState.canRollDice} style={additionalStyle()} type={"button"}>
            <img src={"/roll_dice.svg"} alt={"Roll"} style={imagStyle()}/>
        </AccentedButton>
    )
})