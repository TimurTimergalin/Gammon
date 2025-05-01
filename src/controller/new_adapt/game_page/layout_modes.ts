export type SideBarLayoutMode = "Normal" | "Diminished" | "Collapsed"

export type HistoryPanelLayoutMode = "Normal" | "Down"

export type ControlsLayoutMode = "Normal" | "Right"

export type SpaceTaken = {
    width: number,
    height: number
}

const wh = (width: number, height: number): SpaceTaken => ({width, height})

export function getSideBarSpaceTaken(mode: SideBarLayoutMode): SpaceTaken {
    switch (mode) {
        case "Normal":
            return wh(200, 10)
        case "Diminished":
            return wh(60, 10)
        case "Collapsed":
            return wh(0, 30)
    }
}

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


