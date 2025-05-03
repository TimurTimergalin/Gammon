import {DiceRule, randomDice} from "../DiceRule";
import {DiceStatus, makeDice} from "../../dice_state/DiceStatus";
import {Color} from "../../../common/color";

export class NardeDiceRule implements DiceRule {
    rollFirstDice(): [DiceStatus, DiceStatus] {
        return [
            makeDice(randomDice(), Color.WHITE),
            makeDice(randomDice(), Color.WHITE)
        ]
    }
}