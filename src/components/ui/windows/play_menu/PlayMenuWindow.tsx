import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel} from "./control_panel/ControlPanel.tsx";
import {ReactNode} from "react";
import {dummyGameControllerFactory} from "../../../game/common/game_controller/factories/dummy.ts";

const options: Map<string, undefined | (() => ReactNode)> = new Map([
    ["Локальная игра", undefined],
    ["Игра по сети", () => <></>]
])


export const PlayMenuWindow = () => {
    return (
        <GameAndControlPanelContainer>
            <GameView
                gameControllerFactory={dummyGameControllerFactory}
                displayControls={false}
                player1={{
                    username: "Вы",
                    iconSrc: "placeholder.svg"
                }}
                player2={{
                    username: "Противник",
                    iconSrc: "placeholder.svg"
                }}
            />
            <ControlPanel options={options}/>
        </GameAndControlPanelContainer>
    )
}