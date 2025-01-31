import {BackgammonPlacement, BackgammonIndex, BackgammonProp} from "./types";
import {Color} from "../../../common/color";
import {Board} from "../Board";
import {logger} from "../../../logging/main";

const console = logger("game/board/backgammon")

export class BackgammonBoard implements Board<BackgammonIndex, BackgammonProp>{
    constructor(board: BackgammonPlacement) {
        this.board = new Map(board);
        this.sanitize()
    }
    private sanitize() {
        for (const [key, val] of this.board) {
            if (val !== undefined && val.quantity === 0) {
                // Поскольку при quantity = 0 значение color не имеет значения,
                // quantity всегда должно быть > 0
                this.board.set(key, undefined)
            }
        }
    }

    private readonly board: BackgammonPlacement

    get = (i: BackgammonIndex) => this.board.get(i);

    put = (at: BackgammonIndex, color: Color) => {
        const board = this.board
        let pos = board.get(at)
        console.assert(pos === undefined || pos.color === color)
        if (pos === undefined) {
            pos = {color: color, quantity: 1}
        } else {
            pos.quantity++
        }
        board.set(at, pos)
    };

    remove = (from: BackgammonIndex): Color => {
        const board = this.board
        let fromPosition = board.get(from)
        console.assert(fromPosition !== undefined)
        fromPosition = fromPosition!

        const res = fromPosition.color

        fromPosition.quantity--
        if (fromPosition.quantity === 0) {
            fromPosition = undefined
        }
        board.set(from, fromPosition)

        return res
    };

    move = (from: BackgammonIndex, to: BackgammonIndex): void => {
        this.put(
            to,
            this.remove(from)
        )
    };

    [Symbol.iterator](): Iterator<[BackgammonIndex, BackgammonProp]> {
        return this.board[Symbol.iterator]()
    }
}