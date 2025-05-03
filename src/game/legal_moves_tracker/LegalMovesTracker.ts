import {makeAutoObservable} from "mobx";

export class LegalMovesTracker {
    add(i: number): void {
        this._moves.add(i)
    }

    clear() {
        this._moves.clear()
    }

    has(i: number) {
        return this._moves.has(i)
    }

    private _moves: Set<number> = new Set()

    constructor() {
        makeAutoObservable(this)
    }
}