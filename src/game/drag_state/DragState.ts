import {DragStatus} from "./DragStatus.ts";
import {makeAutoObservable} from "mobx";

export class DragState {
    get dragStatus(): DragStatus | null {
        return this._dragStatus;
    }

    set dragStatus(value: DragStatus | null) {
        this._dragStatus = value;
    }
    private _dragStatus: DragStatus | null

    constructor(dragStatus?: DragStatus) {
        this._dragStatus = dragStatus || null;
        makeAutoObservable(this)
    }

    get pickedFrom(): number | null {
        if (this.dragStatus === null) {
            return null
        } else {
            return this.dragStatus.clickedIndex
        }
    }
}