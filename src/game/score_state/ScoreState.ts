import {makeAutoObservable} from "mobx";

export class ScoreState {
    get total(): number {
        return this._total;
    }

    set total(value: number) {
        this._total = value;
    }
    get black(): number {
        return this._black;
    }

    set black(value: number) {
        this._black = value;
    }
    get white(): number {
        return this._white;
    }

    set white(value: number) {
        this._white = value;
    }
    private _white: number
    private _black: number
    private _total: number

    constructor({white, black, total}: {white: number, black: number, total: number}) {
        this._white = white
        this._black = black
        this._total = total
        makeAutoObservable(this)
    }
}