import {BoardSynchronizer} from "../rules/BoardSynchronizer";
import {LocalGameController} from "./LocalGameController";
import {GameContext} from "../../GameContext";
import {RuleSet} from "../../game_rule/RuleSet";
import {Color} from "../../../common/color";

export function localGameInit<Index, Prop>(
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
        rules: rules,
        labelState: gameContext.labelState
    })

    controller.newTurn(true)
    return {controller: controller, labelMapper: ruleSet.labelMapperFactory(Color.WHITE)}
}
