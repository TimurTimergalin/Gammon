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

export interface DragStatus {
    clickX: number | null
    clickY: number | null
    clickedIndex: number | null
    pickedColor: Color | null
}

export type PiecePlacement = Map<number, PositionState>
export type PiecePlacementEntry = [number, PositionState]

export class GameState {
    private piecePlacement: PiecePlacement
    private _dice1: DiceState | null = null
    private _dice2: DiceState | null = null
    private _pickedFrom: number | null = null
    private _legalMoves: number[] = []
    private _dragStatus: DragStatus = {clickX: null, clickY: null, clickedIndex: null, pickedColor: null}

    constructor(piecePlacement: PiecePlacement) {
        makeAutoObservable(this)
        this.piecePlacement = piecePlacement
    }

    get pickedFrom(): number | null {
        return this._pickedFrom;
    }

    set pickedFrom(value: number | null) {
        this._pickedFrom = value;
    }

    get dice2(): DiceState | null {
        return this._dice2;
    }

    set dice2(value: DiceState | null) {
        this._dice2 = value;
    }

    get dice1(): DiceState | null {
        return this._dice1;
    }

    set dice1(value: DiceState | null) {
        this._dice1 = value;
    }

    get legalMoves(): number[] {
        return this._legalMoves;
    }

    set legalMoves(value: number[]) {
        this._legalMoves = value;
    }

    get dragStatus(): DragStatus {
        return this._dragStatus;
    }

    set dragStatus(value: DragStatus) {
        this._dragStatus = value;
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
