import {Color} from "../../color.ts";

export interface DragStatus {
    clickX: number
    clickY: number
    clickedIndex: number
    pickedColor: Color
}