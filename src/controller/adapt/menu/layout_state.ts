import {SideBarLayoutMode} from "../side_bar/layout_modes";
import {makeAutoObservable} from "mobx";
import {SideBarLayoutState} from "../side_bar/layout_state";

export class MenuSidebarLayoutState implements SideBarLayoutState{
    get mode(): SideBarLayoutMode {
        return this._mode;
    }

    set mode(value: SideBarLayoutMode) {
        this._mode = value;
    }
    private _mode: SideBarLayoutMode = "Normal"


    constructor() {
        makeAutoObservable(this)
    }
}