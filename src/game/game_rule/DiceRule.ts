import {DiceStatus} from "../dice_state/DiceStatus";

export interface DiceRule {
    rollFirstDice(): [DiceStatus, DiceStatus]
}

export function randomDice() {
    return Math.ceil(Math.random() * 6 + 5e-324)
}