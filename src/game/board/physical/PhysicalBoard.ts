import {Board} from "../Board";
import {PositionState, stillPiece} from "./types";
import {Color} from "../../../common/color";
import {makeAutoObservable} from "mobx";
import {logger} from "../../../logging/main";

const console = logger("game/board/physical")

export class PhysicalBoard implements Board<number, PositionState> {
    constructor() {
        makeAutoObservable(this)
    }

    private board: Map<number, PositionState> = new Map()

    get = (i: number): PositionState => {
        // 0 - 11 - верхняя половина
        // 12 - 23 - вторая половина
        // 24 - левый верхний стор
        // 25 - верхний бар
        // 26 - правый верхний стор
        // 27 - левый нижний стор
        // 28 - нижний бар
        // 29 - правый нижний стор
        console.assert(0 <= i && i <= 29)
        if (!this.board.has(i)) {
            const posState = new PositionState()
            this.board.set(i, posState)
        }

        return this.board.get(i)!
    };

    put = (i: number, color: Color): void => {
        const state = this.get(i)
        state.add(stillPiece(color))
        this.board.set(i, state)
    };

    remove = (i: number): Color => this.get(i).remove().color;

    [Symbol.iterator](): Iterator<[number, PositionState]> {
        let i = 0

        return {
            next: () => {
                const done = i >= 30
                if (!done) {
                    const value: [number, PositionState] = [i, this.get(i)]
                    ++i
                    return {
                        done: done,
                        value: value
                    }
                }
                return {done: done, value: undefined}
            }
        }
    }

    move = (from: number, to: number): void => {
        const fromProps = this.get(from)
        const fromTotal = fromProps.quantity
        const color = this.remove(from)

        const toProps = this.get(to)
        toProps.add({color: color, from: {index: from, order: fromTotal - 1, total: fromTotal}})
        this.board.set(to, toProps)
    };

    eraseFrom = () => {
        for (const p of this.board.values()) {
            p.eraseFrom()
        }
    };

    update = (map: Iterable<[number, PositionState]>) => {
        this.board = new Map(map)
    };
}