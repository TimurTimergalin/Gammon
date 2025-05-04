import {makeAutoObservable} from "mobx";

export class ControlPanelState {
    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }
    private _enabled: boolean = true


    constructor() {
        makeAutoObservable(this)
    }
}