import {makeAutoObservable} from "mobx";

export class PhotoEditStatus {
    get cropInit(): boolean {
        return this._cropInit;
    }

    set cropInit(value: boolean) {
        this._cropInit = value;
    }
    get image(): string | false | undefined {
        return this._image;
    }

    set image(value: string | false | undefined) {
        this._image = value;
    }
    get show(): boolean {
        return this._show;
    }

    set show(value: boolean) {
        this._show = value;
    }
    private _show: boolean = false

    private _image: string | false | undefined = undefined

    private _cropInit: boolean = false

    constructor() {
        makeAutoObservable(this)
    }
}