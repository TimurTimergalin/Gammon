import {makeAutoObservable} from "mobx";

export class ScoreState {
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

    constructor({white, black}: {white: number, black: number}) {
        this._white = white
        this._black = black
        makeAutoObservable(this)
    }
}