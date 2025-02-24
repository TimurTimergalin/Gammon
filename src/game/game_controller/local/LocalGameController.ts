import {RulesGameController} from "../rules/RulesGameController";
import {Color, oppositeColor} from "../../../common/color";
import {DiceStatus} from "../../dice_state/DiceStatus";
import {LayerStatus} from "../../../components/game/dice_layer/LayerStatus";
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

const console = logger("game/game_controller/local")


export class LocalGameController<Index, Prop> extends RulesGameController<Index, Prop> {
    private endWindowState: EndWindowState
    private readonly initPlacement: InitPlacement<Index, Prop>
    private readonly pointsUntil: number
    private points: ScoreState

    constructor({endWindowState, initPlacement, scoreState, ...args}: {
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
    }) {
        super(args);
        this.endWindowState = endWindowState
        this.initPlacement = initPlacement
        this.pointsUntil = scoreState.total
        this.points = scoreState
    }

    private randomDice() {
        return Math.ceil(Math.random() * 6 + 5e-324)
    }

    private _rollDice(color1: Color, color2: Color) {
        const value1 = this.randomDice()
        const dice1: DiceStatus = {
            value: value1,
            color: color1,
            unavailabilityStatus: LayerStatus.NONE,
            usageStatus: LayerStatus.NONE
        }

        let value2 = this.randomDice()
        while (value2 === value1 && color1 !== color2) {
            value2 = this.randomDice()
        }

        const dice2 = {
            value: value2,
            color: color2,
            unavailabilityStatus: LayerStatus.NONE,
            usageStatus: LayerStatus.NONE
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
            return
        }
        console.assert(this.diceState.dice1!.value !== this.diceState.dice2!.value)
        if (this.diceState.dice1!.value > this.diceState.dice2!.value) {
            this.player = this.diceState.dice1!.color
            return
        }
        this.player = this.diceState.dice2!.color
    }

    newTurn(first: boolean) {
        if (first) {
            this._rollDice(Color.WHITE, Color.BLACK)
            this.inferCurrentPlayer()
            this.calculateDice()
        } else {
            this.diceState.dice1 = null
            this.diceState.dice2 = null
            this.controlButtonsState.turnComplete = false
            this.controlButtonsState.canRollDice = true
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
        if (this.points.white >= this.pointsUntil) {
            return {winner: Color.WHITE}
        }

        if (this.points.black >= this.pointsUntil) {
            return {winner: Color.BLACK}
        }

        return undefined
    }

    newGame() {
        this.boardAnimationSwitch.withTurnedOff(() => {
                this.board.updateLogical(this.initPlacement())
                this.active = true
                this.newTurn(true)
            }
        )
    }

    endTurn(): void {
        this.performedMoves = []

        const gameComplete = this.checkGameComplete()
        if (gameComplete !== undefined) {
            this.controlButtonsState.movesMade = false
            this.controlButtonsState.turnComplete = false
            this.active = false

            const points = this.rules.calculatePoints(this.board.ruleBoard, gameComplete.winner)
            if (gameComplete.winner === Color.WHITE) {
                this.points.white += points
            } else {
                this.points.black += points
            }

            const matchComplete = this.checkMatchComplete()

            if (matchComplete !== undefined) {
                this.endWindowState.title = matchComplete.winner === Color.WHITE ? "Белые выиграли" : "Черные выиграли"

                this.diceState.dice1 = null
                this.diceState.dice2 = null
                return
            }

            console.log(`Победитель: ${gameComplete.winner === Color.WHITE ? "Белые" : "Черные"}}`)  // TODO: заменить
            setTimeout(
                () => this.newGame(),
                500
            )
            return
        }
        this.player = oppositeColor(this.player)
        this.newTurn(false)
    }

    swapBoard(): void {
        this._swapBoard()
    }

    rollDice(): void {
        this._rollDice(this.player, this.player)
        this.calculateDice()
        this.controlButtonsState.canRollDice = false
    }
}