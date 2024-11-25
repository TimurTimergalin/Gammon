import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";
import {additionalStyle, imagStyle} from "./common.tsx";
import {AccentedButton} from "../../common/AccentedButton.tsx";

export const FinishTurnButton = observer(function FinishTurnButton() {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => gameController.endTurn()

    return (
        <AccentedButton onClick={onCLickCallback} disabled={!gameState.turnComplete} style={additionalStyle()}>
            <img src={"submit.svg"} alt={"Finish"} style={imagStyle()}/>
        </AccentedButton>
    )
})