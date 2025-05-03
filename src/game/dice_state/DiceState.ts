import {DiceStatus} from "./DiceStatus";
import {makeAutoObservable} from "mobx";
import {LayerStatus} from "../../components/game/dice_layer/LayerStatus";


export class DiceState {
    get dice1(): DiceStatus | null {
        return this._dice1;
    }

    set dice1(value: DiceStatus | null) {
        this._dice1 = value;
    }

    get dice2(): DiceStatus | null {
        return this._dice2;
    }

    set dice2(value: DiceStatus | null) {
        this._dice2 = value;
    }

    private _dice1: DiceStatus | null = null
    private _dice2: DiceStatus | null = null

    constructor() {
        makeAutoObservable(this)
    }

    useDice = (diceVal: number) => {
        console.assert(this._dice1 !== null)
        console.assert(this._dice2 !== null)
        const dice1 = this._dice1!
        const dice2 = this._dice2!

        if (dice1.value === dice2.value) {
            console.assert(dice1.value === diceVal)
            const inc = (st: LayerStatus) => (st == LayerStatus.NONE ? LayerStatus.HALF : LayerStatus.FULL)
            if (dice1.usageStatus === LayerStatus.FULL) {
                console.assert(dice2.usageStatus !== LayerStatus.FULL)
                dice2.usageStatus = inc(dice2.usageStatus)
            } else {
                dice1.usageStatus = inc(dice1.usageStatus)
            }
        } else {
            const targetDice = dice1.value === diceVal ? dice1 : dice2
            console.assert(targetDice.value === diceVal)
            console.assert(targetDice.usageStatus === LayerStatus.NONE)
            targetDice.usageStatus = LayerStatus.FULL
        }
    }

    addDice = (diceVal: number) => {
        console.assert(this._dice1 !== null)
        console.assert(this._dice2 !== null)
        const dice1 = this._dice1!
        const dice2 = this._dice2!

        if (dice1.value === dice2.value) {
            console.assert(dice1.value === diceVal)
            const dec = (st: LayerStatus) => ((st == LayerStatus.FULL) ? LayerStatus.HALF : LayerStatus.NONE)
            if (dice1.usageStatus === LayerStatus.FULL && dice2.usageStatus !== LayerStatus.NONE) {
                dice2.usageStatus = dec(dice2.usageStatus)
            } else {
                dice1.usageStatus = dec(dice1.usageStatus)
            }
        } else {
            const targetDice = dice1.value === diceVal ? dice1 : dice2
            console.assert(targetDice.value === diceVal)
            console.assert(targetDice.usageStatus === LayerStatus.FULL)
            targetDice.usageStatus = LayerStatus.NONE
        }
    }

    disableDice = (availableDice: number[]) => {
        console.assert(this._dice1 !== null)
        console.assert(this._dice2 !== null)
        const dice1 = this._dice1!
        const dice2 = this._dice2!

        if (dice1.value === dice2.value) {
            const count = availableDice.length
            dice1.unavailabilityStatus = count >= 2 ? LayerStatus.NONE : count === 1 ? LayerStatus.HALF : LayerStatus.FULL
            dice2.unavailabilityStatus = count == 4 ? LayerStatus.NONE : count == 3 ? LayerStatus.HALF : LayerStatus.FULL
        } else {
            dice1.unavailabilityStatus = availableDice.includes(dice1.value) ? LayerStatus.NONE : LayerStatus.FULL
            dice2.unavailabilityStatus = availableDice.includes(dice2.value) ? LayerStatus.NONE : LayerStatus.FULL
        }
    };

    private singleDiceArray = (dice: DiceStatus, double: boolean): number[] => {
        if (double) {
            let count = 2
            if (dice.usageStatus === LayerStatus.HALF) {
                count -= 1
            } else if (dice.usageStatus === LayerStatus.FULL) {
                count -= 2
            }

            if (dice.unavailabilityStatus === LayerStatus.HALF) {
                count -= 1
            } else if (dice.unavailabilityStatus === LayerStatus.FULL) {
                count -= 2
            }

            const res = []
            for (let i = 0; i < count; ++i) {
                res.push(dice.value)
            }
            return res
        }

        const present = dice.usageStatus === LayerStatus.NONE && dice.unavailabilityStatus === LayerStatus.NONE
        if (present) {
            return [dice.value]
        } else {
            return []
        }
    };

    toDiceArray = (): number[] => {
        console.assert(this._dice1 !== null)
        console.assert(this._dice2 !== null)
        const dice1 = this._dice1!
        const dice2 = this._dice2!

        const double = dice1.value === dice2.value

        return [
            ...this.singleDiceArray(dice1, double),
            ...this.singleDiceArray(dice2, double)
        ]
    };

    swapDice = (): void => {
        console.assert(this._dice1 !== null)
        console.assert(this._dice2 !== null)
        const dice1 = this._dice1!
        const dice2 = this._dice2!

        if (dice1.value === dice2.value) {
            return
        }

        this.dice1 = dice2
        this.dice2 = dice1
    }
}