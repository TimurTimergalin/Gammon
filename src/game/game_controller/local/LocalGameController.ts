import {RulesGameController} from "../rules/RulesGameController";
import {Color, oppositeColor} from "../../../common/color";
import {makeDice} from "../../dice_state/DiceStatus";
import {ControlButtonsState} from "../../control_buttons_state/ControlButtonsState";
import {IndexMapper} from "../../game_rule/IndexMapper";
import {DiceState} from "../../dice_state/DiceState";
import {LegalMovesTracker} from "../../legal_moves_tracker/LegalMovesTracker";
import {Rules} from "../../game_rule/Rules";
import {LabelState} from "../../label_state/LabelState";
import {logger} from "../../../logging/main";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {EndWindowState} from "../../end_window_state/EndWindowState";
import {InitPlacement} from "../../game_rule/InitPlacement";
import {BoardAnimationSwitch} from "../../board_animation_switch/BoardAnimationSwitch";
import {ScoreState} from "../../score_state/ScoreState";
import {DoubleCubeState} from "../../double_cube_state/DoubleCubeState";
import {GameHistoryEntry, GameHistoryState} from "../../game_history_state/GameHistoryState";
import {HistoryEncoder} from "../../game_rule/HistoryEncoder";
import {splitMove} from "../../board/move";
import {DiceRule, randomDice} from "../../game_rule/DiceRule";

const console = logger("game/game_controller/local")


export class LocalGameController<Index, Prop> extends RulesGameController<Index, Prop> {
    private endWindowState: EndWindowState
    private readonly initPlacement: InitPlacement<Index, Prop>
    private points: ScoreState
    private crawfordRule: boolean = false
    private gameHistoryState: GameHistoryState
    private historyEncoder: HistoryEncoder<Index>
    private diceRule: DiceRule

    constructor({endWindowState, initPlacement, scoreState, gameHistoryState, historyEncoder, diceRule, ...args}: {
        board: BoardSynchronizer<Index, Prop>,
        controlButtonsState: ControlButtonsState,
        active: boolean,
        rules: Rules<Index, Prop>,
        indexMapper: IndexMapper<Index>,
        diceState: DiceState,
        legalMovesTracker: LegalMovesTracker,
        labelState: LabelState,
        endWindowState: EndWindowState,
        initPlacement: InitPlacement<Index, Prop>,
        boardAnimationSwitch: BoardAnimationSwitch,
        scoreState: ScoreState,
        doubleCubeState: DoubleCubeState
        gameHistoryState: GameHistoryState
        historyEncoder: HistoryEncoder<Index>,
        diceRule: DiceRule
    }) {
        super(args);
        this.endWindowState = endWindowState
        this.initPlacement = initPlacement
        this.points = scoreState
        this.gameHistoryState = gameHistoryState
        this.historyEncoder = historyEncoder
        this.diceRule = diceRule
    }

    private _rollDice(color?: Color) {
        let dice1, dice2

        if (color === undefined) {
            [dice1, dice2] = this.diceRule.rollFirstDice()
        } else {
            dice1 = makeDice(randomDice(), color)
            dice2 = makeDice(randomDice(), color)
        }

        this.diceState.dice1 = dice1
        this.diceState.dice2 = dice2

        if (dice1.value < dice2.value) {
            this.diceState.swapDice()
        }
    }

    inferCurrentPlayer() {  // Может понадобиться вынести в отдельный класс
        console.assert(this.diceState.dice1 !== null)
        console.assert(this.diceState.dice2 !== null)

        if (this.diceState.dice1!.color === this.diceState.dice2!.color) {
            this.player = this.diceState.dice1!.color
        } else {
            console.assert(this.diceState.dice1!.value !== this.diceState.dice2!.value)
            if (this.diceState.dice1!.value > this.diceState.dice2!.value) {
                this.player = this.diceState.dice1!.color
            } else {
                this.player = this.diceState.dice2!.color
            }
        }
        this.gameHistoryState.currentGame = {firstToMove: this.player}
    }

    newTurn(first: boolean) {
        this.controlButtonsState.canConcedeGame = this._canConcedeGame()
        this.previousDoubleState = undefined
        if (first) {
            this._rollDice()
            this.inferCurrentPlayer()
            this.calculateDice()
        } else {
            this.diceState.dice1 = null
            this.diceState.dice2 = null
            this.controlButtonsState.turnComplete = false
            this.previousDoubleState = undefined
            this.performedMoves = []
            this.controlButtonsState.canRollDice =
                this.doubleCubeState.state !== "offered_to_white" && this.doubleCubeState.state !== "offered_to_black"
            this.canOfferDouble = this._canOfferDouble()
        }
        this.controlButtonsState.movesMade = false
    }

    checkGameComplete(): { winner: Color } | undefined {
        if (!this.rules.noMovesLeft(this.board.ruleBoard, this.player)) {
            return undefined
        }


        return {winner: this.player}
    }

    checkMatchComplete(): { winner: Color } | undefined {
        if (this.points.white >= this.points.total) {
            return {winner: Color.WHITE}
        }

        if (this.points.black >= this.points.total) {
            return {winner: Color.BLACK}
        }

        return undefined
    }

    newGame() {
        this.gameHistoryState.clear()
        this.boardAnimationSwitch.withTurnedOff(() => {
                this.board.updateLogical(this.initPlacement())
                this.active = true
                console.assert(this.points.total > Math.max(this.points.white, this.points.black))
                if (!this.crawfordRule &&
                    Math.max(
                        this.points.total - this.points.white,
                        this.points.total - this.points.black
                    ) > 1
                ) {
                    this.doubleCubeState.value = 64
                    this.doubleCubeState.state = "free"
                } else {
                    this.doubleCubeState.state = "unavailable"
                    this.doubleCubeState.value = undefined
                }
                this.newTurn(true)
            }
        )
    }

    winnerTitle(color: Color) {
        return color === Color.WHITE ? "Белые выиграли" : "Черные выиграли"
    }

    finishGame(winner: Color, points: number, reason?: string) {
        this.controlButtonsState.movesMade = false
        this.controlButtonsState.turnComplete = false
        this.controlButtonsState.canConcedeGame = false
        this.controlButtonsState.canRollDice = false
        this.active = false

        if (winner === Color.WHITE) {
            this.points.white += points
            this.crawfordRule = this.points.white === this.points.total - 1
        } else {
            this.points.black += points
            this.crawfordRule = this.points.black === this.points.total - 1
        }
        const entry: GameHistoryEntry = {
            type: "game_end",
            white: this.points.white,
            black: this.points.black,
            winner: winner,
            reason: reason
        }
        this.gameHistoryState.add(entry)

        const matchComplete = this.checkMatchComplete()

        if (matchComplete !== undefined) {
            this.endWindowState.title = this.winnerTitle(matchComplete.winner)

            this.diceState.dice1 = null
            this.diceState.dice2 = null
            return
        }

        setTimeout(
            () => this.newGame(),
            500
        )
    }

    endTurn(): void {
        if (!this.previousDoubleState) {  // Обычный ход
            console.assert(this.diceState.dice1 !== undefined)
            console.assert(this.diceState.dice2 !== undefined)
            const entry: GameHistoryEntry = {
                type: "move",
                dice: [
                    Math.max(this.diceState.dice1!.value, this.diceState.dice2!.value),
                    Math.min(this.diceState.dice1!.value, this.diceState.dice2!.value)
                ],
                moves: this.historyEncoder.encode(this.performedMoves.flatMap(
                    m => [...splitMove(m.primaryMove, m.dice, this.player, this.rules), ...m.additionalMoves]
                ), this.player)
            }
            this.gameHistoryState.add(entry)
        } else if (this.previousDoubleState.canOffer) {  // Предложил куб
            const entry: GameHistoryEntry = {
                type: "offer_double",
                newValue: this.doubleCubeState.value!
            }
            this.gameHistoryState.add(entry)
        } else {  // Принял куб
            const entry: GameHistoryEntry = {
                type: "accept_double"
            }
            this.gameHistoryState.add(entry)
        }

        const gameComplete = this.checkGameComplete()
        if (gameComplete !== undefined) {
            this.finishGame(
                gameComplete.winner,
                this.rules.calculatePoints(this.board.ruleBoard, gameComplete.winner) *
                this.doubleCubeState.convertedValue
            )
        } else {
            this.player = oppositeColor(this.player)
            this.newTurn(false)
        }
    }

    swapBoard(): void {
        this._swapBoard()
    }

    rollDice(): void {
        this.canOfferDouble = false
        this._rollDice(this.player)
        this.calculateDice()
        this.controlButtonsState.canRollDice = false
    }

    concedeMatch(): void {
        if (this.endWindowState.title !== undefined) {
            return
        }
        this.active = false
        this.controlButtonsState.movesMade = false
        this.controlButtonsState.canRollDice = false
        this.controlButtonsState.turnComplete = false
        this.endWindowState.title = this.winnerTitle(oppositeColor(this.player))
    }

    concedeGame(): void {
        this.finishGame(oppositeColor(this.player),
            this.doubleCubeState.convertedValue === 1 ? 1 :
                Math.floor(this.doubleCubeState.convertedValue / 2),
            "Игрок сдался"
        )
    }

    protected _canConcedeGame(): boolean {
        return (this.player === Color.WHITE && this.doubleCubeState.state === "offered_to_white") ||
            (this.player === Color.BLACK && this.doubleCubeState.state === "offered_to_black") ||
            (this.rules.canConcedePrematurely(this.board.ruleBoard, this.player) &&
                (
                    this.player === Color.WHITE && this.doubleCubeState.state === "belongs_to_white" ||
                    this.player === Color.BLACK && this.doubleCubeState.state === "belongs_to_black" ||
                    this.doubleCubeState.state === "unavailable"
                )
            )
    }
}