import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";
import {additionalStyle, imagStyle} from "./common.tsx";
import {AccentedButton} from "../../common/AccentedButton.tsx";
// import {useScreenSpecs} from "../../ui/adapt/ScreenSpecs.ts";

export const UndoMovesButton = observer(function UndoMovesButton() {
    const gameState = useGameContext("gameState")
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