import {observer} from "mobx-react-lite";
import {useGameContext} from "../common/GameContext.ts";
import {useScreenSpecs} from "../../ui/adapt/ScreenSpecs.ts";
import {CSSProperties} from "react";

export const FinishTurnButton = observer(function FinishTurnButton() {
    const gameState = useGameContext("gameState")
    const gameController = useGameContext("gameController")

    const scaleMode = useScreenSpecs().scaleMode
    const fontSizeValue = scaleMode === "Normal" ? 1.3 : scaleMode === "Minimized" ? 0.8 : 0.5

    const style: CSSProperties = {
        fontSize: `${fontSizeValue}em`
    }

    const onCLickCallback = () => gameController.endTurn()

    return (
        <button disabled={!gameState.turnComplete} onClick={onCLickCallback} style={style}>Завершить ход</button>
    )
})