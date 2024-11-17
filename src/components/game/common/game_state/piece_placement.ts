import {Color} from "../../color.ts";

export interface PieceState {
    color: Color,
    from?: {
        x: number,
        y: number
    }
}

export class PositionState {
    pieces: PieceState[]

    constructor(pieces?: PieceState[]) {
        this.pieces = pieces === undefined ? [] : pieces;
    }

    get quantity(): number {
        return this.pieces.length
    }

    get last(): PieceState {
        return this.pieces[this.pieces.length - 1]
    }
}

export type PiecePlacement = Map<number, PositionState>