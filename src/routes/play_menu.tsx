import {GameAndControlPanelContainer} from "../components/play_menu/GameAndControlPanelContainer";
import GameView from "../components/game/GameView";
import {DummyGameController} from "../game/game_controller/DummyGameController";
import {GameContextHolder} from "../components/game/GameContextHolder";
import {GamePart} from "../components/game_page/GamePart";
import {ControlPanel} from "../components/play_menu/new_control_panel/ControlPanel";
import {RemoteGameTab} from "../components/play_menu/new_control_panel/RemoteGameTab";
import {LocalGameTab} from "../components/play_menu/new_control_panel/LocalGameTab";


export const PlayMenuPage = () => {
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
                <ControlPanel options={["Игра по сети", "Локальная игра"]}>
                    <RemoteGameTab />
                    <LocalGameTab />
                </ControlPanel>
            </GameAndControlPanelContainer>
        </GameContextHolder>
    )
}

export default PlayMenuPage