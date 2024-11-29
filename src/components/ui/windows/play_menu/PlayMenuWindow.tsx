import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel, OptionCallbacks} from "./control_panel/ControlPanel.tsx";
import {dummyGameControllerFactory} from "../../../game/common/game_controller/factories/dummy.ts";
import {NavigateFunction} from "react-router";
import {connect} from "../../../game/common/game_controller/factories/remote.ts";

const options: Map<string, OptionCallbacks> = new Map([
    ["Локальная игра", {
        element: () => <></>,
        playCallback: (navigate: NavigateFunction) => navigate("/local-play")
    }],
    ["Игра по сети", {
        element: () => <></>,
        playCallback: (navigate: NavigateFunction) => {
            const connectUri = "/menu/connect"
            connect(connectUri).then(roomId => isNaN(roomId) ? console.error("Unable to get roomId") : navigate(`/play/${roomId}`))
        }
    }]
    ]
)


export const PlayMenuWindow = () => {
    return (
        <GameAndControlPanelContainer>
            <GameView
                gameControllerFactory={dummyGameControllerFactory}
                displayControls={false}
                player1={{
                    username: "Вы",
                    iconSrc: "/placeholder.svg"
                }}
                player2={{
                    username: "Противник",
                    iconSrc: "/placeholder.svg"
                }}
            />
            <ControlPanel options={options}/>
        </GameAndControlPanelContainer>
    )
}