import {Color} from "../../../game/common/color.ts";
import {PositionState} from "../../../game/common/game_state/piece_placement.ts";
import {GameState} from "../../../game/common/game_state/GameState.ts";
import {DummyController} from "../../../game/common/game_controller/DummyController.ts";
import {AdaptiveWindow} from "../../adapt/AdaptiveWindow.tsx";
import {SideBar} from "../../sidebar/SideBar.tsx";
import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel} from "./control_panel/ControlPanel.tsx";
import {ReactNode} from "react";

const filledStack = (color: Color) => new PositionState(Array.from(Array(15).keys()).map(() => ({color: color})))

const dummyPlacement = new Map([
        [24, filledStack(Color.WHITE)],
        [29, filledStack(Color.BLACK)]
    ])

const options: Map<string, undefined | (() => ReactNode)> = new Map([
    ["Локальная игра", () => <></>],
    ["Игра по сети", undefined]
])

const factory = (gameState: GameState) => new DummyController(dummyPlacement, gameState)


export const PlayMenuWindow = () => {
    return (
        <AdaptiveWindow>
            <SideBar />
            <GameAndControlPanelContainer>
                <GameView gameControllerFactory={factory} displayControls={false} />
                <ControlPanel options={options} />
            </GameAndControlPanelContainer>
        </AdaptiveWindow>
    )
}