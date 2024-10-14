import {makeAutoObservable} from "mobx";
import {Color} from "../color.ts";
import {LayerStatus} from "../dice_layer/LayerStatus.ts";

export interface PositionState {
    quantity: number,
    color: Color | null
}

export interface DiceState {
    value: number,
    color: Color,
    usageStatus: LayerStatus,
    unavailabilityStatus: LayerStatus
}

export type PiecePlacement = Map<number, PositionState>
export type PiecePlacementEntry = [number, PositionState]

export class GameState {
    piecePlacement: PiecePlacement
    dice1: DiceState | null
    dice2: DiceState | null

    constructor(piecePlacement: PiecePlacement, dice1: DiceState | null, dice2: DiceState | null) {
        makeAutoObservable(this)
        this.piecePlacement = piecePlacement
        this.dice1 = dice1
        this.dice2 = dice2
    }

    setPlacementProperty = (entries: PiecePlacementEntry[]) => {
        if (Array.isArray(entries)) {
            for (const entry of entries as PiecePlacementEntry[]) {
                const [key, val] = entry
                this.piecePlacement.set(key, val)
            }
        }
    }

    getPositionProps = (i: number) => {
        const res = this.piecePlacement.get(i)
        if (res === undefined) {
            return {quantity: 0, color: null}
        }
        if (res.quantity === 0) {
            res.color = null
        }
        return res
    }
}


