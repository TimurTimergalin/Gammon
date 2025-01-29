import {DragStatus} from "./DragStatus.ts";
import {makeAutoObservable} from "mobx";

export class DragState {
    get clickedIndex(): number | null {
        return this._clickedIndex;
    }

    set clickedIndex(value: number | null) {
        this._clickedIndex = value;
    }
    get dragStatus(): DragStatus | null {
        return this._dragStatus;
    }

    set dragStatus(value: DragStatus | null) {
        this._dragStatus = value;
    }
    private _dragStatus: DragStatus | null
    private _clickedIndex: number | null

    constructor(dragStatus?: DragStatus, clickedIndex?: number) {
        this._dragStatus = dragStatus || null;
        this._clickedIndex = clickedIndex || null
        makeAutoObservable(this)
    }

    get pickedFrom(): number | null {
        if (this.dragStatus === null) {
            return null
        } else {
            return this.clickedIndex
        }
    }
}