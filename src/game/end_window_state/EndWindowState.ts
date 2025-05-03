import {makeAutoObservable} from "mobx";

export class EndWindowState {
    get title(): string | undefined {
        return this._title;
    }

    set title(value: string | undefined) {
        this._title = value;
    }
    private _title: string | undefined

    constructor(title?: string | undefined) {
        this._title = title
        makeAutoObservable(this)
    }
}