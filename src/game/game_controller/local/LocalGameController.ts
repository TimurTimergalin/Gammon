import {RulesGameController} from "../rules/RulesGameController";
import {Color, oppositeColor} from "../../../common/color";
import {DiceStatus} from "../../dice_state/DiceStatus";
import {LayerStatus} from "../../../components/game/dice_layer/LayerStatus";
import {BoardSynchronizer} from "../rules/BoardSynchronizer";
import {ControlButtonsState} from "../../ControlButtonsState";
import {IndexMapper} from "../../game_rule/IndexMapper";
import {DiceState} from "../../dice_state/DiceState";
import {LegalMovesTracker} from "../../LegalMovesTracker";
import {Rules} from "../../game_rule/Rules";
import {LabelState} from "../../LabelState";
import {logger} from "../../../logging/main";

const console = logger("game/game_controller/local")


export class LocalGameController<Index, Prop> extends RulesGameController<Index, Prop> {


    constructor(args: {
        board: BoardSynchronizer<Index, Prop>,
        controlButtonsState: ControlButtonsState,
        active: boolean,
        rules: Rules<Index, Prop>,
        indexMapper: IndexMapper<Index>,
        diceState: DiceState,
        legalMovesTracker: LegalMovesTracker,
        labelState: LabelState
    }) {
        super(args);
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
        return
    }

    newTurn(first: boolean) {
        if (first) {
            this.rollDice(Color.WHITE, Color.BLACK)
            this.inferCurrentPlayer()
        } else {
            this.rollDice(this.player, this.player)
        }
        this.controlButtonsState.movesMade = false
        this.calculateDice()
    }

    endTurn(): void {
        this.performedMoves = []
        this.player = oppositeColor(this.player)
        this.newTurn(false)
    }
}