import {makeAutoObservable} from "mobx";
import {Color} from "../../../common/color";


export interface PieceState {
    color: Color,
    from?: {
        index: number,
        order: number,
        total: number
    }
}

export const stillPiece = (color: Color): PieceState => ({ color: color })

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

    pieceArray(): Color[] {
        return this.pieces.map(ps => ps.color)
    }
}

export type PiecePlacement = Map<number, PositionState>