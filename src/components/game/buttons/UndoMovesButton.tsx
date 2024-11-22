import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";
import {buttonStyle, imagStyle} from "./common.ts";
// import {useScreenSpecs} from "../../ui/adapt/ScreenSpecs.ts";

export const UndoMovesButton = observer(function UndoMovesButton() {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const onCLickCallback = () => {
        gameController.undoMoves()
    }

    return (
        <button disabled={!gameState.movesMade} onClick={onCLickCallback} style={buttonStyle()}>
            <img src={"undo.svg"} alt={"Undo"} style={imagStyle()}/>
        </button>
    )
})