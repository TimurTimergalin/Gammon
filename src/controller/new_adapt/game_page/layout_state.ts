import {GamePageLayout} from "./layout_calculator";
import {makeAutoObservable} from "mobx";

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