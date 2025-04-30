import {LocalGameController} from "./LocalGameController";
import {GameContext} from "../../GameContext";
import {RuleSet} from "../../game_rule/RuleSet";
import {Color} from "../../../common/color";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {TimerManager} from "../TimerManager";

export function localGameInit<Index, Prop>(
    {gameContext, ruleSet, pointsUntil, blitz}: {
        gameContext: GameContext,
        ruleSet: RuleSet<Index, Prop>,
        pointsUntil: number,
        blitz: boolean
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

    const timeControl = ruleSet.timeControlTable.getTimeControl({pointsUntil, blitz})
    gameContext.timerPairState.timer1.owner = Color.BLACK
    gameContext.timerPairState.timer2.owner = Color.WHITE

    const timerManager = new TimerManager({
        timerPairState: gameContext.timerPairState,
        incrementMs: timeControl.incrementMs,
        timeMs: timeControl.timeMs
    })

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
        doubleCubeState: gameContext.doubleCubeState,
        gameHistoryState: gameContext.gameHistoryState,
        historyEncoder: ruleSet.historyEncoder,
        diceRule: ruleSet.diceRule,
        timerManager: timerManager,
        dragState: gameContext.dragState
    })

    gameContext.scoreState.total = pointsUntil
    gameContext.labelState.labelMapper = ruleSet.labelMapperFactory(Color.WHITE)
    gameContext.doubleCubeState.positionMapper = ruleSet.doubleCubePositionMapperFactory(Color.WHITE)
    gameContext.gameControllerSetter.set(controller)
    gameContext.timerPairState.timer1.onEnd = () => controller.onTimeEnd()
    gameContext.timerPairState.timer2.onEnd = () => controller.onTimeEnd()
    controller.newGame()
}
