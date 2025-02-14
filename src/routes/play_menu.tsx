import {GameAndControlPanelContainer} from "../components/play_menu/GameAndControlPanelContainer";
import GameView from "../components/game/GameView";
import {DummyGameController} from "../game/game_controller/DummyGameController";
import {GameContextHolder} from "../components/game/GameContextHolder";
import {GamePart} from "../components/game_page/GamePart";
import {ControlPanel} from "../components/play_menu/new_control_panel/ControlPanel";
import {RemoteGameTab} from "../components/play_menu/new_control_panel/RemoteGameTab";
import {LocalGameTab} from "../components/play_menu/new_control_panel/LocalGameTab";
import {observer} from "mobx-react-lite";
import {useAuthContext} from "../controller/auth_status/context";
import {imageUri} from "../requests/paths";


export const PlayMenuPage = observer(() => {
    const authStatus = useAuthContext()

    const player1 = {
        username: authStatus.username === null ? "Вы" : authStatus.username,
        iconSrc: authStatus.id === null ? "/user_icon_placeholder.svg" : imageUri(authStatus.id)
    }

    const player2 = {
        username: "Противник",
        iconSrc: "/user_icon_placeholder.svg"
    }

    return (
        <GameContextHolder>
            <GameAndControlPanelContainer>
                <GamePart
                    player1={player1}
                    player2={player2}>
                    <GameView gameController={new DummyGameController()}/>
                </GamePart>
                <ControlPanel options={["Игра по сети", "Локальная игра"]}>
                    <RemoteGameTab/>
                    <LocalGameTab/>
                </ControlPanel>
            </GameAndControlPanelContainer>
        </GameContextHolder>
    )
})

export default PlayMenuPage