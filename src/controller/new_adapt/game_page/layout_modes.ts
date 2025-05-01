import {SpaceTaken, wh} from "../common";

export type HistoryPanelLayoutMode = "Normal" | "Down"

export type ControlsLayoutMode = "Normal" | "Right"

export function getHistoryPanelSpaceTaken(mode: HistoryPanelLayoutMode): SpaceTaken {
    switch (mode) {
        case "Normal":
            return wh(310, 0)
        case "Down":
            return wh(0, 65.2)
    }
}

export function getControlsSpaceTaken(mode: ControlsLayoutMode): SpaceTaken {
    switch (mode) {
        case "Normal":
            return wh(0, 112)
        case "Right":
            return wh(62.5, 0)
    }
}

export const mandatoryMargin = 10


