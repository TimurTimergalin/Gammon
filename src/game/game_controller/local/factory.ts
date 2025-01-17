import {BoardSynchronizer} from "../rules/BoardSynchronizer.ts";
import {LocalGameController} from "./LocalGameController.ts";
import {GameContext} from "../../GameContext.ts";
import {RuleSet} from "../../game_rule/RuleSet.ts";
import {Color} from "../../color.ts";

export function localGameControllerFactory<Index, Prop>(
    {gameContext, ruleSet}: {
        gameContext: GameContext,
        ruleSet: RuleSet<Index, Prop>
    }
) {
    const {rules, initPlacement, indexMapperFactory, propMapper} = ruleSet
    const indexMapper = indexMapperFactory(Color.WHITE)

    const board = new BoardSynchronizer(
        gameContext.boardState,
        initPlacement(),
        indexMapper,
        propMapper
    )

    const controller = new LocalGameController({
        board: board,
        controlButtonsState: gameContext.controlButtonsState,
        active: true,
        diceState: gameContext.diceState,
        indexMapper: indexMapper,
        legalMovesTracker: gameContext.legalMovesTracker,
        rules: rules
    })

    controller.newTurn(true)
    return controller
}
