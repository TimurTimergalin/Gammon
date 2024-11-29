import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel} from "../../../game/control_panel/ControlPanel.tsx";
// import {remoteGameControllerFactory} from "../../../game/common/game_controller/factories/remote.ts";
import {localGameControllerFactory} from "../../../game/common/game_controller/factories/local.ts";

export const GameWindow = () => {
    return (
        <GameAndControlPanelContainer>
            <GameView
                gameControllerFactory={localGameControllerFactory}
                player1={{
                    username: "Игрок 1",
                    iconSrc: "placeholder.svg"
                }}
                player2={{
                    username: "Игрок 2",
                    iconSrc: "placeholder.svg"
                }}
            />
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
}