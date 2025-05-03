import {DiceRule, randomDice} from "../DiceRule";
import {DiceStatus, makeDice} from "../../dice_state/DiceStatus";
import {Color} from "../../../common/color";

export class BackgammonDiceRule implements DiceRule {
    rollFirstDice(): [DiceStatus, DiceStatus] {
        const value1 = randomDice()
        const dice1: DiceStatus = makeDice(value1, Color.WHITE)

        let value2 = randomDice()
        while (value2 === value1 ) {
            value2 = randomDice()
        }

        const dice2 = makeDice(value2, Color.BLACK)

        return [dice1, dice2]
    }

}