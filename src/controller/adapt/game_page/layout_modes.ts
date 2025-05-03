import {SpaceTaken, wh} from "../common";

export type HistoryPanelLayoutMode = "Normal" | "Down" | "Micro"

export type ControlsLayoutMode = "Normal" | "Right" | "Micro"

export function getHistoryPanelSpaceTaken(mode: HistoryPanelLayoutMode): SpaceTaken {
    switch (mode) {
        case "Normal":
            return wh(300, 0)
        case "Down":
            return wh(0, 65.2)
        case "Micro":
            return wh(90, 0)
    }
}

export function getControlsSpaceTaken(mode: ControlsLayoutMode): SpaceTaken {
    switch (mode) {
        case "Normal":
            return wh(0, 112)
        case "Right":
            return wh(62.5, 0)
        case "Micro":
            return wh(52, 0)
    }
}



