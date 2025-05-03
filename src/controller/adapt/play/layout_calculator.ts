import {PlayMenuBoardLayoutMode} from "./layout_modes";

export function getPlayMenuBoardLayoutMode(availableWidth: number): PlayMenuBoardLayoutMode {
    if (availableWidth >= 950) {
        return "Present"
    }
    return "Hidden"
}