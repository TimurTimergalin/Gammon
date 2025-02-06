import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";
import {additionalStyle, imagStyle} from "./common";
import {AccentedButton} from "../../AccentedButton";
// import {useScreenSpecs} from "../../ui/adapt/ScreenSpecs";

export const UndoMovesButton = observer(function UndoMovesButton() {
    const gameState = useGameContext("controlButtonsState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => {
        gameController.undoMoves()
    }

    return (
        <AccentedButton onClick={onCLickCallback} disabled={!gameState.movesMade} style={additionalStyle()} type={"button"}>
            <img src={"/undo.svg"} alt={"Undo"} style={imagStyle()}/>
        </AccentedButton>
    )
})