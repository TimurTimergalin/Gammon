import {makeAutoObservable} from "mobx";
import {createContext} from "react";
import {Color} from "./pieces_layer/color.ts";

export interface PositionProperty {
    quantity: number,
    color: Color | null
}

export type PiecePlacement = Map<number, PositionProperty>
export type PiecePlacementEntry = [number, PositionProperty]

export class GameState {
    piecePlacement: PiecePlacement

    constructor(piecePlacement: PiecePlacement) {
        makeAutoObservable(this)
        this.piecePlacement = piecePlacement
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

