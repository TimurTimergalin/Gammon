import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext.ts";
import {additionalStyle, imagStyle} from "./common.tsx";
import {AccentedButton} from "../../AccentedButton.tsx";
// import {useScreenSpecs} from "../../ui/adapt/ScreenSpecs.ts";

export const UndoMovesButton = observer(function UndoMovesButton() {
    const gameState = useGameContext("controlButtonsState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => {
        gameController.undoMoves()
    }

    return (
        <AccentedButton onClick={onCLickCallback} disabled={!gameState.movesMade} style={additionalStyle()}>
            <img src={"/undo.svg"} alt={"Undo"} style={imagStyle()}/>
        </AccentedButton>
    )
})