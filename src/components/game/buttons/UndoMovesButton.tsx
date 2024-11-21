import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";
import {useScreenSpecs} from "../../ui/adapt/ScreenSpecs.ts";
import {CSSProperties} from "react";

export const UndoMovesButton = observer(function UndoMovesButton() {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const scaleMode = useScreenSpecs().scaleMode
    const fontSizeValue = scaleMode === "Normal" ? 1.3 : scaleMode === "Minimized" ? 0.8 : 0.5

    const style: CSSProperties = {
        fontSize: `${fontSizeValue}em`
    }

    const onCLickCallback = () => {
        gameController.undoMoves()
    }

    return (
        <button disabled={!gameState.movesMade} onClick={onCLickCallback} style={style}>Откатить ход</button>
    )
})