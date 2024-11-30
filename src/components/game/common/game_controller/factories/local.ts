import {GameState} from "../../game_state/GameState.ts";
import {LocalGameController} from "../LocalGameController.ts";
import {BackgammonPositionIndex, BackgammonPositionProp} from "../../game_rule/backgammon/types.ts";
import {BackgammonRules} from "../../game_rule/backgammon/Rules.ts";
import {BackgammonIndexMapping} from "../../game_rule/backgammon/IndexMapping.ts";
import {Color} from "../../color.ts";
import {BackgammonPropMapping} from "../../game_rule/backgammon/PropMapping.ts";
import {backgammonDebugPlacement} from "../../game_rule/backgammon/placement_factory.ts";
import {GameController} from "../GameController.ts";

export async function localGameControllerFactory(gameState: GameState): Promise<GameController> {
    return new LocalGameController<BackgammonPositionIndex, BackgammonPositionProp>(
        new BackgammonRules(),
        new BackgammonIndexMapping(Color.WHITE),
        new BackgammonPropMapping(),
        gameState,
        backgammonDebugPlacement
    )
}