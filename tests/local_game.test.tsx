import {GameContext, useFullGameContext} from "../src/game/GameContext";
import {useEffect} from "react";
import {BackgammonPlacement} from "../src/game/board/backgammon/types";
import {Color} from "../src/common/color";
import {backgammonRuleSet} from "../src/game/game_rule/backgammon/RuleSet";
import {BoardSynchronizer} from "../src/game/board/BoardSynchronizer";
import {LocalGameController} from "../src/game/game_controller/local/LocalGameController";
import {LayerStatus} from "../src/components/game/dice_layer/LayerStatus";
import {BackgammonBoard} from "../src/game/board/backgammon/BackgammonBoard";
import GameView from "../src/components/game/GameView";
import {GameController} from "../src/game/game_controller/GameController";
import {LabelMapper} from "../src/game/game_rule/LabelMapper";
import {GameContextHolder} from "../src/components/game/GameContextHolder";
import {act, render} from "@testing-library/react";

beforeEach(() => {
        window.ResizeObserver = window.ResizeObserver || jest.fn().mockImplementation(() => ({
            disconnect: jest.fn(),
            observe: jest.fn(),
            unobserve: jest.fn(),
        }))
    }
)

afterEach(() => {
    jest.clearAllMocks()
})

const GameContextExtractor = (
    {retrieval}: {
        retrieval: (gc: GameContext) => void
    }
) => {
    const gameContext = useFullGameContext()

    useEffect(() => {
        retrieval(gameContext)
    }, [gameContext, retrieval]);
    return <></>
}

const initBackgammonPosition = (gc: GameContext, placement: BackgammonPlacement, dice: [number, number], player: Color): [GameController, LabelMapper] => {
    const board = new BoardSynchronizer(
        gc.boardState,
        new BackgammonBoard(placement),
        backgammonRuleSet.indexMapperFactory(Color.WHITE),
        backgammonRuleSet.propMapper
    )

    const controller = new LocalGameController({
        board: board,
        controlButtonsState: gc.controlButtonsState,
        active: true,
        diceState: gc.diceState,
        indexMapper: backgammonRuleSet.indexMapperFactory(Color.WHITE),
        legalMovesTracker: gc.legalMovesTracker,
        rules: backgammonRuleSet.rules,
        labelState: gc.labelState,
        boardAnimationSwitch: gc.boardAnimationSwitch,
        endWindowState: gc.endWindowState,
        scoreState: gc.scoreState,
        initPlacement: backgammonRuleSet.initPlacement,
        doubleCubeState: gc.doubleCubeState
    })

    gc.diceState.dice1 = {
        value: dice[0],
        color: player,
        usageStatus: LayerStatus.NONE,
        unavailabilityStatus: LayerStatus.NONE
    }

    gc.diceState.dice2 = {
        value: dice[1],
        color: player,
        usageStatus: LayerStatus.NONE,
        unavailabilityStatus: LayerStatus.NONE
    }

    controller.inferCurrentPlayer()
    controller.calculateDice()

    return [controller, backgammonRuleSet.labelMapperFactory(Color.WHITE)]
}

type SetUpBackgammonGameProps = {
    retrieval: (gc: GameContext) => void,
    placement: BackgammonPlacement,
    dice: [number, number],
    player: Color
}

const InnerSetUpBackgammonGame = (
    {retrieval, placement, dice, player}: SetUpBackgammonGameProps
) => {
    const gameContext = useFullGameContext()

    const [controller, labelMapper] = initBackgammonPosition(gameContext, placement, dice, player)
    gameContext.labelState.labelMapper = labelMapper
    gameContext.gameControllerSetter.set(controller)

    return (
        <>
            <GameView />
            <GameContextExtractor retrieval={retrieval}/>
        </>
    )
}

const SetUpBackgammonGame = (props: SetUpBackgammonGameProps) => (
    <GameContextHolder>
        <InnerSetUpBackgammonGame {...props} />
    </GameContextHolder>
)

test("Setup", () => {
    render(
        <SetUpBackgammonGame retrieval={() => {
        }} placement={new Map()} dice={[1, 2]} player={Color.WHITE}/>
    )
})


describe("Quick moves", () => {
    test("Issue #17", () => {
        const placement: BackgammonPlacement = new Map([
            [1, {color: Color.BLACK, quantity: 1}],
            [2, {color: Color.WHITE, quantity: 2}],
            [3, {color: Color.WHITE, quantity: 2}],
            [6, {color: Color.WHITE, quantity: 6}],
            [8, {color: Color.WHITE, quantity: 1}],
            [12, {color: Color.BLACK, quantity: 3}],
            [13, {color: Color.WHITE, quantity: 3}],
            [17, {color: Color.BLACK, quantity: 5}],
            [19, {color: Color.BLACK, quantity: 6}],
            [24, {color: Color.WHITE, quantity: 2}]
        ])

        let gameContext: GameContext

        render(
            <SetUpBackgammonGame retrieval={(gc) => gameContext = gc} placement={placement} dice={[1, 6]}
                                 player={Color.BLACK}/>,
            {}
        )

        act(
            () => {
                gameContext!.gameController.calculateLegalMoves(23)
                gameContext!.gameController.quickMove(23)
            }
        )
        expect(gameContext!.boardState.get(17).quantity).toEqual(1)
    })
})
