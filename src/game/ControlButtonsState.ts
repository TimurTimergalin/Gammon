import {makeAutoObservable} from "mobx";


export class ControlButtonsState {
    constructor() {
        makeAutoObservable(this)
    }

    private _turnComplete: boolean = false

    get turnComplete(): boolean {
        return this._turnComplete
    }

    set turnComplete(val: boolean) {
        this._turnComplete = val
    }

    private _movesMade: boolean = false

    get movesMade(): boolean {
        return this._movesMade
    }

    set movesMade(val: boolean) {
        this._movesMade = val
    }
}

