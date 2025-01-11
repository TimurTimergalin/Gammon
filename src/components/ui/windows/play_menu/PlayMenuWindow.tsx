import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel, OptionCallbacks} from "./control_panel/ControlPanel.tsx";
import {dummyGameControllerFactory} from "../../../game/common/game_controller/factories/dummy.ts";
import {NavigateFunction} from "react-router";
import {connect} from "../../../../requests/requests.ts";
import {logResponseError} from "../../../../requests/util.ts";

const options: Map<string, OptionCallbacks> = new Map([
        ["Локальная игра", {
            element: () => <></>,
            playCallback: (navigate: NavigateFunction) => navigate("/local-play")
        }],
        ["Игра по сети", {
            element: () => <></>,
            playCallback: (navigate: NavigateFunction) => {
                connect("SHORT_BACKGAMMON")
                    .then(resp => {
                        logResponseError(resp, "connecting to a game")
                        return resp.text()
                    })
                    .then(parseInt)
                    .then(roomId => isNaN(roomId) ? console.error("Unable to get roomId") : navigate(`/play/${roomId}`))
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
                    iconSrc: "/user_icon_placeholder.svg"
                }}
                player2={{
                    username: "Противник",
                    iconSrc: "/user_icon_placeholder.svg"
                }}
            />
            <ControlPanel options={options}/>
        </GameAndControlPanelContainer>
    )
}