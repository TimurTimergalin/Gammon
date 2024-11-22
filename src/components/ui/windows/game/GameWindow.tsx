import {AdaptiveWindow} from "../../adapt/AdaptiveWindow.tsx";
import {SideBar} from "../../sidebar/SideBar.tsx";
import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel} from "../../../game/control_panel/ControlPanel.tsx";

export const GameWindow = () => {
    return (
        <AdaptiveWindow>
            <SideBar/>
            <GameAndControlPanelContainer>
                <GameView/>
                <ControlPanel/>
            </GameAndControlPanelContainer>
        </AdaptiveWindow>
    )
}