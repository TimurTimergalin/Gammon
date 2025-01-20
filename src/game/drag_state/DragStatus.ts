import {Color} from "../../common/color.ts";

export interface DragStatus {
    clickX: number
    clickY: number
    clickedIndex: number
    pickedColor: Color
    timestamp: number
}