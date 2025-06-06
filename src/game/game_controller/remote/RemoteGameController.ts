import {RulesGameController} from "../rules/RulesGameController";
import {ControlButtonsState} from "../../control_buttons_state/ControlButtonsState";
import {IndexMapper} from "../../game_rule/IndexMapper";
import {DiceState} from "../../dice_state/DiceState";
import {LegalMovesTracker} from "../../legal_moves_tracker/LegalMovesTracker";
import {Rules} from "../../game_rule/Rules";
import {RemoteConnector} from "./RemoteConnector";
import {Color, oppositeColor} from "../../../common/color";
import {Move, splitMove} from "../../board/move";
import {LayerStatus} from "../../../components/game/dice_layer/LayerStatus";
import {moveDuration} from "../../../components/game/pieces_layer/constants";
import {LabelState} from "../../label_state/LabelState";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {Config} from "../../game_rule/ConfigParser";
import {EndWindowState} from "../../end_window_state/EndWindowState";
import {BoardAnimationSwitch} from "../../board_animation_switch/BoardAnimationSwitch";
import {ScoreState} from "../../score_state/ScoreState";
import {DoubleCubeState} from "../../double_cube_state/DoubleCubeState";
import {GameHistoryState} from "../../game_history_state/GameHistoryState";
import {HistoryEncoder} from "../../game_rule/HistoryEncoder";
import {DragState} from "../../drag_state/DragState";
import {TimerManager} from "../TimerManager";
import {useRevalidator} from "react-router";


export class RemoteGameController<Index, Prop> extends RulesGameController<Index, Prop> {
    private connector: RemoteConnector<Index, Prop>
    private endWindowState: EndWindowState
    private readonly userPlayer: Color | null

    private _opponentTurnDisplayed: boolean
    private swapBoardAvailable = true

    private updateActivity() {
        this.active = this.opponentTurnDisplayed || this.canOfferDouble
    }

    private get opponentTurnDisplayed(): boolean {
        return this._opponentTurnDisplayed
    }

    private set opponentTurnDisplayed(val: boolean) {
        this._opponentTurnDisplayed = val
        this.updateActivity()
    }

    private scoreState: ScoreState
    private gameHistoryState: GameHistoryState
    private historyEncoder: HistoryEncoder<Index>
    private timeManager: TimerManager
    private revalidator: ReturnType<typeof useRevalidator>

    constructor({
                    connector,
                    userPlayer,
                    player,
                    endWindowState,
                    scoreState,
                    gameHistoryState,
                    historyEncoder,
                    timeManager,
                    revalidator,
                    ...base
                }: {
        board: BoardSynchronizer<Index, Prop>,
        controlButtonsState: ControlButtonsState,
        player: Color,
        rules: Rules<Index, Prop>,
        indexMapper: IndexMapper<Index>,
        diceState: DiceState,
        legalMovesTracker: LegalMovesTracker,
        connector: RemoteConnector<Index, Prop>,
        userPlayer: Color | null,
        labelState: LabelState,
        endWindowState: EndWindowState,
        boardAnimationSwitch: BoardAnimationSwitch,
        scoreState: ScoreState,
        doubleCubeState: DoubleCubeState,
        gameHistoryState: GameHistoryState,
        historyEncoder: HistoryEncoder<Index>,
        dragState: DragState,
        timeManager: TimerManager,
        revalidator: ReturnType<typeof useRevalidator>
    }) {
        const active = player === userPlayer
        super({...base, active: active});
        this.connector = connector
        this.player = player
        this.userPlayer = userPlayer
        this._opponentTurnDisplayed = active
        this.endWindowState = endWindowState
        this.scoreState = scoreState
        this.gameHistoryState = gameHistoryState
        this.historyEncoder = historyEncoder
        this.timeManager = timeManager
        this.revalidator = revalidator
    }

    init(config: Config<Index, Prop>) {
        this.diceState.dice1 = config.dice[0]
        this.diceState.dice2 = config.dice[1]
        this.doubleCubeState.state = config.doubleCube.state
        this.doubleCubeState.value =
            config.doubleCube.state === "unavailable" ? undefined :
                config.doubleCube.state === "free" ? 64 :
                    config.doubleCube.value
        this.scoreState.white = config.points.white
        this.scoreState.black = config.points.black
        this.scoreState.total = config.points.total

        if (config.dice[0] !== null && config.dice[1] !== null && config.dice[0].value < config.dice[1].value) {
            this.diceState.swapDice()
        }

        if (config.winner !== null) {
            this.endWindowState.title = this.winnerTitle(config.winner)
            return
        }
        this.controlButtonsState.canConcedeGame = this._canConcedeGame()

        if (this.diceState.dice1 !== null) {
            console.assert(this.diceState.dice2 !== null)
            this.calculateDice()
        } else {
            if (this.player === this.userPlayer) {
                this.canOfferDouble = this._canOfferDouble()
            } else {
                this.canOfferDouble = false
            }
            if (this.player === this.userPlayer) {
                if (this.doubleCubeState.state !== "offered_to_white" && this.doubleCubeState.state !== "offered_to_black") {
                    this.controlButtonsState.canRollDice = true
                }
            }
        }
        this.timeManager.update(config.time.white, Color.WHITE)
        this.timeManager.update(config.time.black, Color.BLACK)
        this.timeManager.stop()
        this.timeManager.start(this.player)
    }

    endTurn = (): void => {
        console.assert(this.player === this.userPlayer)
        console.assert(this.active)
        if (this.previousDoubleState !== undefined) {
            console.assert(this.performedMoves.length === 0)
            if (this.doubleCubeState.state === "offered_to_black" || this.doubleCubeState.state === "offered_to_white") {
                this.connector.offerDouble()
                this.gameHistoryState.add({type: "offer_double", newValue: this.doubleCubeState.convertedValue})
            } else {
                console.assert(
                    (this.doubleCubeState.state === "belongs_to_black" && this.userPlayer === Color.BLACK) ||
                    (this.doubleCubeState.state === "belongs_to_white" && this.userPlayer === Color.WHITE)
                )
                this.connector.acceptDouble()
                this.gameHistoryState.add({type: "accept_double"})
            }
            this.previousDoubleState = undefined
        } else {
            const splitMoves = this.performedMoves
                .flatMap(m => splitMove(m.primaryMove, m.dice, this.player, this.rules))
            const movesToEncode = [...this.performedMoves.flatMap(m => m.additionalMoves), ...splitMoves]
            this.connector.makeMove(splitMoves)
            this.gameHistoryState.add({
                type: "move",
                dice: [
                    Math.max(this.diceState.dice1!.value, this.diceState.dice2!.value),
                    Math.min(this.diceState.dice1!.value, this.diceState.dice2!.value)
                ],
                moves: this.historyEncoder.encode(movesToEncode, this.player)
            })
            this.performedMoves = []
            this.diceState.dice1 = null
            this.diceState.dice2 = null
        }
        this.opponentTurnDisplayed = false
        this.player = oppositeColor(this.player)
        this.controlButtonsState.turnComplete = false
        this.controlButtonsState.movesMade = false
        this.canOfferDouble = false
        this.timeManager.switch()
    };

    onMovesMade = (moves: Move<Index>[]) => {
        // const merged = mergeMoves(moves)
        // merged.forEach(this.board.performMoveLogical)
        this._clearDrag()

        this.gameHistoryState.add(
            {
                type: "move",
                dice: [
                    Math.max(this.diceState.dice1!.value, this.diceState.dice2!.value),
                    Math.min(this.diceState.dice1!.value, this.diceState.dice2!.value)
                ],
                moves: this.historyEncoder.encode(moves, this.player)
            }
        )

        const squashedMoves = this.rules.squashMoves(moves)

        this.timeManager.switch()

        const delayMs = 50

        const displayMove = (index: number) => {
            console.assert(index < squashedMoves.length)

            for (const move of squashedMoves[index]) {
                this.board.performMoveLogical(move)
            }

            if (index + 1 === squashedMoves.length) {
                this.opponentTurnDisplayed = true
                this.swapBoardAvailable = true
                this.controlButtonsState.canRollDice = true
                this.diceState.dice1 = null
                this.diceState.dice2 = null
                this.connector.blocked = false
                this.player = oppositeColor(this.player)
                this.canOfferDouble = this._canOfferDouble()
                this.controlButtonsState.canConcedeGame = this._canConcedeGame()
            } else {
                setTimeout(
                    () => displayMove(index + 1),
                    delayMs + moveDuration * 1000
                )
            }
        }

        if (squashedMoves.length === 0) {
            this.opponentTurnDisplayed = true
            this.controlButtonsState.canRollDice = true
            this.diceState.dice1 = null
            this.diceState.dice2 = null
            this.player = oppositeColor(this.player)
            this.canOfferDouble = this._canOfferDouble()
            this.controlButtonsState.canConcedeGame = this._canConcedeGame()
        } else {
            this.swapBoardAvailable = false
            this.connector.blocked = true
            displayMove(0)
        }
    };

    onNewDice = (dice: [number, number], player: Color) => {
        const dice1 = {
            value: dice[0],
            color: player,
            unavailabilityStatus: LayerStatus.NONE,
            usageStatus: LayerStatus.NONE
        }

        const dice2 = {
            value: dice[1],
            color: player,
            unavailabilityStatus: LayerStatus.NONE,
            usageStatus: LayerStatus.NONE
        }

        this.player = player
        this.diceState.dice1 = dice1
        this.diceState.dice2 = dice2
        if (dice1.value < dice2.value) {
            this.diceState.swapDice()
        }
        this.calculateDice()
    };

    onEnd = (winner: Color, newConfig: Config<Index, Prop> | undefined, points: { white: number, black: number }) => {
        this._clearDrag()
        this.active = false
        this.scoreState.white = points.white
        this.scoreState.black = points.black
        this.gameHistoryState.add({type: "game_end", winner: winner, black: points.black, white: points.white})
        this.timeManager.stop()
        if (newConfig === undefined) {
            this.endWindowState.title = this.winnerTitle(winner)
            this.revalidator.revalidate().then(() => console.log("revalidate"))
            this.diceState.dice1 = null
            this.diceState.dice2 = null
            this.controlButtonsState.turnComplete = false
            this.controlButtonsState.canRollDice = false
            this.controlButtonsState.movesMade = false
            this.controlButtonsState.canConcedeGame = false
            this.canOfferDouble = false
            this._opponentTurnDisplayed = false
            this.active = false
            return
        }

        this.connector.blocked = true
        this.controlButtonsState.turnComplete = false
        this.controlButtonsState.canRollDice = false
        this.controlButtonsState.movesMade = false
        setTimeout(() => {
            this.boardAnimationSwitch.withTurnedOff(() => {
                this.board.updateLogical(newConfig.placement)
                this.player = newConfig.player

                this.active = this.player === this.userPlayer
                this._opponentTurnDisplayed = this.active  // Не-property версии использованы специально

                this.init(newConfig)
                this.connector.blocked = false
                this.gameHistoryState.clear()
            })
        }, 500)
    }

    private winnerTitle(winner: Color) {
        return winner === Color.WHITE ? "Белые выиграли" : "Черные выиграли";
    }

    onOfferDouble = (by: Color) => {
        if (this.doubleCubeState.convertedValue === 1) {
            this.doubleCubeState.value = 2
        } else {
            console.assert(this.doubleCubeState.value !== undefined)
            this.doubleCubeState.value! *= 2
        }
        if (by === Color.BLACK) {
            this.doubleCubeState.state = "offered_to_white"
        } else {
            this.doubleCubeState.state = "offered_to_black"
        }
        this.gameHistoryState.add({type: "offer_double", newValue: this.doubleCubeState.convertedValue})

        this.player = oppositeColor(this.player)
        this.active = true
        this.controlButtonsState.canConcedeGame = this._canConcedeGame()
        this.timeManager.switch()
    }

    onAcceptDouble = (by: Color) => {
        if (by === Color.WHITE) {
            console.assert(this.doubleCubeState.state === "offered_to_white")
            this.doubleCubeState.state = "belongs_to_white"
        } else {
            console.assert(this.doubleCubeState.state === "offered_to_black")
            this.doubleCubeState.state = "belongs_to_black"
        }
        this.gameHistoryState.add({type: "accept_double"})
        this.controlButtonsState.canRollDice = true
        this.canOfferDouble = false
        this.player = oppositeColor(by)
        this.active = true
        this.timeManager.switch()
    }

    onUpdateTime = (white: number, black: number) => {
        this.timeManager.update(white, Color.WHITE)
        this.timeManager.update(black, Color.BLACK)
    }

    swapBoard(): void {
        if (this.swapBoardAvailable) {
            this._swapBoard()
        }
    }

    rollDice(): void {
        this.connector.rollDice()
        this.controlButtonsState.canRollDice = false
        this.canOfferDouble = false
    }

    concedeMatch(): void {
        this.active = false
        this.controlButtonsState.canRollDice = false
        this.controlButtonsState.movesMade = false
        this.controlButtonsState.turnComplete = false
        this.controlButtonsState.canConcedeGame = false
        this.canOfferDouble = false
        this.connector.concedeMatch()
    }

    concedeGame(): void {
        this.active = false
        this.controlButtonsState.canRollDice = false
        this.controlButtonsState.movesMade = false
        this.controlButtonsState.turnComplete = false
        this.controlButtonsState.canConcedeGame = false
        this.canOfferDouble = false
        this.connector.concedeGame()
    }

    onTimeout() {
        this._clearDrag()
        this.active = false
        this.connector.signalTimeout()
    }

    protected _canConcedeGame(): boolean {
        if (this.userPlayer === null) {
            return false
        }
        return (this.active && this.player === Color.WHITE && this.doubleCubeState.state === "offered_to_white") ||
            (this.active && this.player === Color.BLACK && this.doubleCubeState.state === "offered_to_black") ||
            (this.rules.canConcedePrematurely(this.board.ruleBoard, this.userPlayer) &&
                (
                    this.userPlayer === Color.WHITE && this.doubleCubeState.state === "belongs_to_white" ||
                    this.userPlayer === Color.BLACK && this.doubleCubeState.state === "belongs_to_black" ||
                    this.doubleCubeState.state === "unavailable"
                )
            )
    }
}