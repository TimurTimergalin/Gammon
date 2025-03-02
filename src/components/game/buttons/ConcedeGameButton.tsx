import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";
import {AccentedButton} from "../../AccentedButton";
import {additionalStyle, imagStyle} from "./common";

export const ConcedeGameButton = observer(function ConcedeGameButton() {
    const buttonsState = useGameContext("controlButtonsState")
    const gameController = useGameContext("gameController")

    return (
        <AccentedButton
            onClick={() => gameController.concedeGame()}
            disabled={!buttonsState.canConcedeGame}
            style={additionalStyle()}
            type={"button"}
        >
            <img src={"/surrender_white.svg"} alt={"Сдать игру"} style={imagStyle()} />
        </AccentedButton>
    )
})