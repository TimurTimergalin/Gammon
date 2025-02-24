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

    private _canRollDice: boolean = false

    get canRollDice(): boolean {
        return this._canRollDice;
    }

    set canRollDice(value: boolean) {
        this._canRollDice = value;
    }
}

