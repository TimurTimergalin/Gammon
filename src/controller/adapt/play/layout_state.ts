import {PlayMenuBoardLayoutMode} from "./layout_modes";
import {makeAutoObservable} from "mobx";

export class PlayMenuLayoutState {
    get mode(): PlayMenuBoardLayoutMode {
        return this._mode;
    }

    set mode(value: PlayMenuBoardLayoutMode) {
        this._mode = value;
    }
    private _mode: PlayMenuBoardLayoutMode = "Present"


    constructor() {
        makeAutoObservable(this)
    }
}