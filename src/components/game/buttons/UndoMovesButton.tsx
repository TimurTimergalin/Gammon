import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";
import {imagStyle} from "./common.tsx";
import {ControlButton} from "./ControlButton.tsx";
// import {useScreenSpecs} from "../../ui/adapt/ScreenSpecs.ts";

export const UndoMovesButton = observer(function UndoMovesButton() {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => {
        gameController.undoMoves()
    }

    return (
        <ControlButton onClick={onCLickCallback} disabled={!gameState.movesMade}>
            <img src={"undo.svg"} alt={"Undo"} style={imagStyle()}/>
        </ControlButton>
    )
})