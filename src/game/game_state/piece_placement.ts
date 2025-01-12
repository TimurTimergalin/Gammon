import {Color} from "../color.ts";
import {makeAutoObservable} from "mobx";

export interface PieceState {
    color: Color,
    from?: {
        x: number,
        y: number
    }
}

export class PositionState {
    pieces: PieceState[] = []

    constructor(pieces?: PieceState[]) {
        makeAutoObservable(this)
        this.pieces = pieces === undefined ? [] : pieces;
    }

    get quantity(): number {
        return this.pieces.length
    }

    get last(): PieceState {
        return this.pieces[this.pieces.length - 1]
    }

    add(st: PieceState) {
        this.pieces.push(st)
    }

    remove(): PieceState {
        console.assert(this.pieces.length > 0)
        return this.pieces.pop()!
    }

    eraseFrom() {
        for (const st of this.pieces) {
            st.from = undefined
        }
    }
}

export type PiecePlacement = Map<number, PositionState>