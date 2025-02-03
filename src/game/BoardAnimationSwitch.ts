import {makeAutoObservable} from "mobx";

export class BoardAnimationSwitch {
    get allowed(): boolean {
        return this._allowed;
    }

    set allowed(value: boolean) {
        this._allowed = value;
    }
    private _allowed: boolean


    constructor(allowed: boolean) {
        this._allowed = allowed;
        makeAutoObservable(this)
    }

    withTurnedOff(action: () => void) {
        const wasAllowed = this._allowed
        this._allowed = false
        setTimeout(() => {
            action()
            setTimeout(
                () => {this._allowed = wasAllowed}, 0
            )
        }, 0)
    }
}