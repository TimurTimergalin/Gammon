import {SpaceTaken, wh} from "../common";

export type SideBarLayoutMode = "Normal" | "Diminished" | "Collapsed"

export function getSideBarSpaceTaken(mode: SideBarLayoutMode): SpaceTaken {
    switch (mode) {
        case "Normal":
            return wh(200, 10)
        case "Diminished":
            return wh(60, 10)
        case "Collapsed":
            return wh(0, 42)
    }
}