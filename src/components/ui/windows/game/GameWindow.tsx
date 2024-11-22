import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel} from "../../../game/control_panel/ControlPanel.tsx";
import {GameState} from "../../../game/common/game_state/GameState.ts";
import {LocalGameController} from "../../../game/common/game_controller/LocalGameController.ts";
import {BackgammonPositionIndex, BackgammonPositionProp} from "../../../game/common/game_rule/backgammon/types.ts";
import {BackgammonRules} from "../../../game/common/game_rule/backgammon/Rules.ts";
import {BackgammonIndexMapping} from "../../../game/common/game_rule/backgammon/IndexMapping.ts";
import {Color} from "../../../game/common/color.ts";
import {BackgammonPropMapping} from "../../../game/common/game_rule/backgammon/PropMapping.ts";
import {backgammonDefaultPlacement} from "../../../game/common/game_rule/backgammon/placement_factory.ts";

const factory = (gameState: GameState) => {
    return new LocalGameController<BackgammonPositionIndex, BackgammonPositionProp>(
        new BackgammonRules(),
        new BackgammonIndexMapping(Color.WHITE),
        new BackgammonPropMapping(),
        gameState,
        backgammonDefaultPlacement
    )
}

export const GameWindow = () => {
    return (
        <GameAndControlPanelContainer>
            <GameView gameControllerFactory={factory}/>
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
}