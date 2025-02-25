import {LocalGameController} from "./LocalGameController";
import {GameContext} from "../../GameContext";
import {RuleSet} from "../../game_rule/RuleSet";
import {Color} from "../../../common/color";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";

export function localGameInit<Index, Prop>(
    {gameContext, ruleSet, pointsUntil}: {
        gameContext: GameContext,
        ruleSet: RuleSet<Index, Prop>,
        pointsUntil: number
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
        labelState: gameContext.labelState,
        endWindowState: gameContext.endWindowState,
        boardAnimationSwitch: gameContext.boardAnimationSwitch,
        initPlacement: initPlacement,
        scoreState: gameContext.scoreState,
        doubleCubeState: gameContext.doubleCubeState
    })

    gameContext.scoreState.total = pointsUntil
    gameContext.labelState.labelMapper = ruleSet.labelMapperFactory(Color.WHITE)
    gameContext.doubleCubeState.positionMapper = ruleSet.doubleCubePositionMapperFactory(Color.WHITE)
    gameContext.gameControllerSetter.set(controller)
    controller.newGame()
}
