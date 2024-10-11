import {makeAutoObservable} from "mobx";
import {createContext} from "react";
import {Color} from "./color.ts";
import {LayerStatus} from "./dice_layer/LayerStatus.ts";

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
    dice1: DiceState
    dice2: DiceState

    constructor(piecePlacement: PiecePlacement, dice1: DiceState, dice2: DiceState) {
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
}

export const GameStateContext = createContext<GameState | null>(null)

