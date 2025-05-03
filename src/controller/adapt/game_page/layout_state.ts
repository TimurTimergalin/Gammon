import {makeAutoObservable} from "mobx";
import {SideBarLayoutState} from "../side_bar/layout_state";
import {SideBarLayoutMode} from "../side_bar/layout_modes";
import {GamePageLayout} from "./layout_calculator/common";

export class GamePageLayoutState {
    private readonly _layout: GamePageLayout = ["Normal", "Normal", "Normal"]

    get layout(): GamePageLayout {
        return Array.from(this._layout) as GamePageLayout
    }

    set layout(newLayout: GamePageLayout) {
        this._layout.splice(0,  3, ...newLayout)
    }

    constructor() {
        makeAutoObservable(this)
    }
}

export class GamePageSideBarLayoutState implements SideBarLayoutState {
    private gamePageLayoutState: GamePageLayoutState

    constructor(gamePageLayoutState: GamePageLayoutState) {
        this.gamePageLayoutState = gamePageLayoutState;
    }

    get mode(): SideBarLayoutMode {
        return this.gamePageLayoutState.layout[0]
    }
}