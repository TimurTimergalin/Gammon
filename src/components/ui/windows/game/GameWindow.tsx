import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel} from "../../../game/control_panel/ControlPanel.tsx";
// import {remoteGameControllerFactory} from "../../../game/common/game_controller/factories/remote.ts";
import {localGameControllerFactory} from "../../../game/common/game_controller/factories/local.ts";
import {useParams} from "react-router";
import {getRemoteGameControllerFactory} from "../../../game/common/game_controller/factories/remote.ts";

export const GameWindow = ({remote}: {remote: boolean}) => {
    const params = useParams()
    console.assert(!remote || params.roomId !== undefined)

    const factory = remote ? getRemoteGameControllerFactory(parseInt(params.roomId!)) : localGameControllerFactory

    return (
        <GameAndControlPanelContainer>
            <GameView
                gameControllerFactory={factory}
                player1={{
                    username: "Игрок 1",
                    iconSrc: "/placeholder.svg"
                }}
                player2={{
                    username: "Игрок 2",
                    iconSrc: "/placeholder.svg"
                }}
            />
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
}