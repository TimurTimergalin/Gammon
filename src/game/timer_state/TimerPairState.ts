import {TimerState} from "./TimerState";
import {makeAutoObservable} from "mobx";

export class TimerPairState {
    private _timer1: TimerState
    get timer1(): TimerState {
        return this._timer1;
    }
    private _timer2: TimerState
    get timer2(): TimerState {
        return this._timer2;
    }

    constructor() {
        this._timer1 = new TimerState()
        this._timer2 = new TimerState()
        makeAutoObservable(this)
    }

    swap() {
        const tmp = this._timer1
        this._timer1 = this._timer2
        this._timer2 = tmp
    }
}