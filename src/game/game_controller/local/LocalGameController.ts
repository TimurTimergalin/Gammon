import {RulesGameController} from "../rules/RulesGameController";
import {Color, oppositeColor} from "../../../common/color";
import {DiceStatus} from "../../dice_state/DiceStatus";
import {LayerStatus} from "../../../components/game/dice_layer/LayerStatus";
import {ControlButtonsState} from "../../ControlButtonsState";
import {IndexMapper} from "../../game_rule/IndexMapper";
import {DiceState} from "../../dice_state/DiceState";
import {LegalMovesTracker} from "../../LegalMovesTracker";
import {Rules} from "../../game_rule/Rules";
import {LabelState} from "../../LabelState";
import {logger} from "../../../logging/main";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {EndWindowState} from "../../EndWindowState";

const console = logger("game/game_controller/local")


export class LocalGameController<Index, Prop> extends RulesGameController<Index, Prop> {
    private endWindowState: EndWindowState
    private firstToMove!: Color
    private lastMove = false

    constructor({endWindowState, ...args}: {
        board: BoardSynchronizer<Index, Prop>,
        controlButtonsState: ControlButtonsState,
        active: boolean,
        rules: Rules<Index, Prop>,
        indexMapper: IndexMapper<Index>,
        diceState: DiceState,
        legalMovesTracker: LegalMovesTracker,
        labelState: LabelState,
        endWindowState: EndWindowState
    }) {
        super(args);
        this.endWindowState = endWindowState
    }

    private randomDice() {
        return Math.ceil(Math.random() * 6 + 5e-324)
    }

    private rollDice(color1: Color, color2: Color) {
        const value1 = this.randomDice()
        const dice1: DiceStatus = {
            value: value1,
            color: color1,
            unavailabilityStatus: LayerStatus.NONE,
            usageStatus: LayerStatus.NONE
        }

        let value2 = this.randomDice()
        while (value2 === value1) {
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
            this.rollDice(Color.WHITE, Color.BLACK)
            this.inferCurrentPlayer()
            this.firstToMove = this.player
        } else {
            this.rollDice(this.player, this.player)
        }
        this.controlButtonsState.movesMade = false
        this.calculateDice()
    }

    checkGameComplete(): {winner: Color | null} | undefined {
        if (this.lastMove) {
            if (!this.rules.noMovesLeft(this.board.ruleBoard, this.player)) {
                return {winner: oppositeColor(this.player)}
            } else {
                return {winner: null}
            }
        }
        if (!this.rules.noMovesLeft(this.board.ruleBoard, this.player)) {
            return undefined
        }

        if (this.player === this.firstToMove) {
            this.lastMove = true
            return undefined
        }

        return {winner: this.player}
    }

    endTurn(): void {
        this.performedMoves = []

        const gameComplete = this.checkGameComplete()
        if (gameComplete !== undefined) {
            this.controlButtonsState.movesMade = false
            this.controlButtonsState.turnComplete = false
            this.active = false

            this.endWindowState.title = gameComplete.winner === Color.WHITE ? "Белые выиграли" :
                gameComplete.winner === Color.BLACK ? "Черные выиграли" :
                    "Ничья"

            this.diceState.dice1 = null
            this.diceState.dice2 = null
            return
        }
        this.player = oppositeColor(this.player)
        this.newTurn(false)
    }
}