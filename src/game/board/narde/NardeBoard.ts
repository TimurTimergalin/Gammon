import {Board} from "../Board";
import {NardeIndex, NardePlacement, NardeProp} from "./types";
import {Color} from "../../../common/color";


export class NardeBoard implements Board<NardeIndex, NardeProp> {
    private board: NardePlacement
    constructor(board: NardePlacement) {
        this.board = new Map(board)
        this.sanitize()
    }

    private sanitize() {
        for (const [key, val] of this.board) {
            if (val !== undefined && val.quantity === 0) {
                this.board.set(key, undefined)
            }
        }
    }

    get = (i: NardeIndex) => this.board.get(i)

    put = (at: NardeIndex, color: Color) => {
        let pos = this.board.get(at)
        console.assert(pos === undefined || pos.color === color)
        if (pos === undefined) {
            pos = {color: color, quantity: 1}
        } else {
            pos.quantity++
        }
        this.board.set(at, pos)
    }

    remove = (from: NardeIndex): Color => {
        let fromPosition = this.board.get(from)
        console.assert(fromPosition !== undefined)
        fromPosition = fromPosition!

        const res = fromPosition.color

        fromPosition.quantity--
        if (fromPosition.quantity === 0) {
            fromPosition = undefined
        }
        this.board.set(from, fromPosition)

        return res
    }

    move = (from: NardeIndex, to: NardeIndex): void => {
        this.put(
            to,
            this.remove(from)
        )
    }

    [Symbol.iterator](): Iterator<[NardeIndex, NardeProp]> {
        return this.board[Symbol.iterator]();
    }

    update(src: Iterable<[NardeIndex, NardeProp]>): void {
        this.board = new Map(src)
    }
}