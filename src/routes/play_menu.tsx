import {GameAndControlPanelContainer} from "../components/play_menu/GameAndControlPanelContainer";
import GameView from "../components/game/GameView";
import {DummyGameController} from "../game/game_controller/DummyGameController";
import {GameContextHolder} from "../components/game/GameContextHolder";
import {GamePart} from "../components/game_page/GamePart";
import {ControlPanel} from "../components/play_menu/new_control_panel/ControlPanel";
import {RemoteGameTab} from "../components/play_menu/new_control_panel/RemoteGameTab";
import {LocalGameTab} from "../components/play_menu/new_control_panel/LocalGameTab";
import {useMemo} from "react";


export const PlayMenuPage = () => {
    const player1 = useMemo(() => ({
                        username: "Вы",
                        iconSrc: "/user_icon_placeholder.svg"
                    }), [])

    const player2 = useMemo(() => ({
                        username: "Противник",
                        iconSrc: "/user_icon_placeholder.svg"
                    }), [])

    return (
        <GameContextHolder>
            <GameAndControlPanelContainer>
                <GamePart
                    player1={player1}
                    player2={player2}>
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