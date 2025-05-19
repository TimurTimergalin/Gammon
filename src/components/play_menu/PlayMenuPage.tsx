import {observer} from "mobx-react-lite";
import {CSSProperties, useRef} from "react";
import {useAuthContext} from "../../controller/auth_status/context";
import {imageUri} from "../../requests/paths";
import {PlayerIcon} from "../game/players/PlayerIcon";
import GameView from "../game/GameView";
import {ControlPanel} from "./control_panel/ControlPanel";
import {RemoteGameTab} from "./control_panel/RemoteGameTab";
import {LocalGameTab} from "./control_panel/LocalGameTab";
import {GameContextHolder} from "../game/GameContextHolder";
import {usePlayMenuLayout} from "../adapt/PlayMenuLayoutProvider";
import {ControlPanelContext} from "../../controller/play_menu/ControlPanelContext";
import {ControlPanelState} from "../../controller/play_menu/ControlPanelState";

export const PlayMenuPage = observer(function PlayMenuPage() {
    const layout = usePlayMenuLayout().mode
    const authStatus = useAuthContext()

    const player1 = {
        username: authStatus.username === null ? "Вы" : authStatus.username,
        iconSrc: authStatus.id === null ? "/user_icon_placeholder.svg" : imageUri(authStatus.id)
    }

    const player2 = {
        username: "Противник",
        iconSrc: "/user_icon_placeholder.svg"
    }

    const containerStyle: CSSProperties = {
        flex: 1,
        display: "flex",
        alignItems: "center",
        marginLeft: 10,
        marginRight: 10,
        justifyContent: "space-evenly"
    }

    const controlPanelState = useRef(new ControlPanelState())

    const controlPanel = (
        <ControlPanelContext.Provider value={controlPanelState.current}>
            <ControlPanel options={["Игра по сети", "Локальная игра"]}>
                <RemoteGameTab/>
                <LocalGameTab/>
            </ControlPanel>
        </ControlPanelContext.Provider>

    )

    if (layout === "Present") {
        const gameViewContainerStyle: CSSProperties = {
            flex: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
        }
        const controlPanelContainerStyle: CSSProperties = {
            width: 350,
            height: 400,
            display: "flex",
            alignItems: "stretch"
        }

        const skip = <div style={{flex: 1}}/>
        return (
            <div style={containerStyle}>
                {skip}
                <div style={gameViewContainerStyle}>
                    <div style={{display: "flex"}}>
                        <PlayerIcon {...player2} />
                    </div>
                    <GameContextHolder>
                        <GameView/>
                    </GameContextHolder>
                    <div style={{display: "flex"}}>
                        <PlayerIcon {...player1} />
                    </div>
                </div>
                {skip}
                <div style={controlPanelContainerStyle}>
                    {controlPanel}
                </div>
                {skip}
            </div>
        )
    } else {
        const controlPanelContainerStyle: CSSProperties = {
            display: "flex",
            alignItems: "stretch",
            width: "80%",
            maxWidth: 350,
            height: "90%",
            maxHeight: 400
        }

        return (
            <div style={containerStyle}>
                <div style={controlPanelContainerStyle}>
                    {controlPanel}
                </div>
            </div>
        )
    }
})