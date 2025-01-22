import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../components/game/GameView.tsx";
import {ControlPanel, OptionCallbacks} from "./control_panel/ControlPanel.tsx";
import {NavigateFunction} from "react-router";
import {connect} from "../../requests/requests.ts";
import {logResponseError} from "../../requests/util.ts";
import {DummyGameController} from "../../game/game_controller/DummyGameController.ts";
import {GameContextHolder} from "../../components/game/GameContextHolder.tsx";
import {LocalGameOption} from "./control_panel/LocalGameOption.tsx";

const options: Map<string, OptionCallbacks> = new Map()
options.set("Игра по сети", {
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
        })
options.set("Локальная игра", new LocalGameOption())

export const PlayMenuWindow = () => {
    return (
        <GameContextHolder>
            <GameAndControlPanelContainer>
                <GameView
                    gameController={new DummyGameController()}
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
        </GameContextHolder>
    )
}