import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer";
import GameView from "../../components/game/GameView";
import {ControlPanel, OptionCallbacks} from "./control_panel/ControlPanel";
import {NavigateFunction} from "react-router";
import {connect} from "../../requests/requests";
import {logResponseError} from "../../requests/util";
import {DummyGameController} from "../../game/game_controller/DummyGameController";
import {GameContextHolder} from "../../components/game/GameContextHolder";
import {LocalGameOption} from "./control_panel/LocalGameOption";
import {GamePart} from "../../parts/GamePart";
import {logger} from "../../logging/main";

const console = logger("windows/play_menu")

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
                <GamePart
                    player1={{
                        username: "Вы",
                        iconSrc: "/user_icon_placeholder.svg"
                    }}
                    player2={{
                        username: "Противник",
                        iconSrc: "/user_icon_placeholder.svg"
                    }}>
                    <GameView gameController={new DummyGameController()}/>
                </GamePart>
                <ControlPanel options={options}/>
            </GameAndControlPanelContainer>
        </GameContextHolder>
    )
}