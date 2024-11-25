import {Color} from "../../../game/common/color.ts";
import {PositionState} from "../../../game/common/game_state/piece_placement.ts";
import {GameState} from "../../../game/common/game_state/GameState.ts";
import {DummyController} from "../../../game/common/game_controller/DummyController.ts";
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
        <GameAndControlPanelContainer>
            <GameView
                gameControllerFactory={factory}
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