import {boardHeight, boardWidth, pieceWidth} from "../../../../components/game/dimensions/board_size_constants";
import {GamePageLayout, getHeightTaken, getWidthTaken} from "./common";
import {SideBarLayoutMode} from "../../side_bar/layout_modes";
import {ControlsLayoutMode, HistoryPanelLayoutMode} from "../layout_modes";

const recommendedBoardWidth = 40 / pieceWidth * boardWidth
const boardAspectRatio = boardWidth / boardHeight

const getBoardWidth = (layout: GamePageLayout, screenWidth: number, screenHeight: number) => {
    const availableWidth = screenWidth - getWidthTaken(layout)
    const availableHeight = screenHeight - getHeightTaken(layout)

    if (availableHeight * boardAspectRatio <= availableWidth) {
        return availableHeight * boardAspectRatio
    }
    return availableWidth
}

const sideBarLayoutKey = (mode: SideBarLayoutMode) => {
    switch (mode) {
        case "Collapsed":
            return 0
        case "Diminished":
            return 1
        case "Normal":
            return 2
    }
}

const historyLayoutKey = (mode: HistoryPanelLayoutMode) => {
    switch (mode) {
        case "Micro":
            return 0
        case "Down":
            return 1
        case "Normal":
            return 2
    }
}

const controlsLayoutKey = (mode: ControlsLayoutMode) => {
    switch (mode) {
        case "MicroRight":
            return 0
        case "Micro":
            return 1
        case "Right":
            return 2
        case "Normal":
            return 3
    }
}

const layoutLt = (
    lay1: GamePageLayout,
    lay2: GamePageLayout,
    screenWidth: number,
    screenHeight: number): boolean => {
    const width1 = getBoardWidth(lay1, screenWidth, screenHeight)
    const width2 = getBoardWidth(lay2, screenWidth, screenHeight)

    if (width1 < recommendedBoardWidth && width2 >= recommendedBoardWidth) {
        return true
    }
    if (width1 >= recommendedBoardWidth && width2 < recommendedBoardWidth) {
        return false
    }
    if (width1 < recommendedBoardWidth) {
        if (width1 !== width2) {
            return width1 < width2
        }
        if (sideBarLayoutKey(lay1[0]) !== sideBarLayoutKey(lay2[0])) {
            return sideBarLayoutKey(lay1[0]) > sideBarLayoutKey(lay2[0])
        }
        if (historyLayoutKey(lay1[1]) !== historyLayoutKey(lay2[1])) {
            return historyLayoutKey(lay1[1]) > historyLayoutKey(lay2[1])
        }

        return controlsLayoutKey(lay1[2]) > controlsLayoutKey(lay2[2])
    }

    if (controlsLayoutKey(lay1[2]) !== controlsLayoutKey(lay2[2])) {
        return controlsLayoutKey(lay1[2]) < controlsLayoutKey(lay2[2])
    }

    if (historyLayoutKey(lay1[1]) !== historyLayoutKey(lay2[1])) {
        return historyLayoutKey(lay1[1]) < historyLayoutKey(lay2[1])
    }

    return sideBarLayoutKey(lay1[0]) < sideBarLayoutKey(lay2[0])
}

export const getGamePageLayoutV2 = (screenWidth: number, screenHeight: number): GamePageLayout => {
    let max: GamePageLayout = ["Normal", "Normal", "Normal"]

    for (const s of (["Normal", "Diminished", "Collapsed"] as SideBarLayoutMode[])) {
        for (const h of (["Normal", "Down", "Micro"] as HistoryPanelLayoutMode[])) {
            for (const c of (["Normal", "Right", "Micro", "MicroRight"] as ControlsLayoutMode[])) {
                if (layoutLt(max, [s, h, c], screenWidth, screenHeight)) {
                    max = [s, h, c]
                }
            }
        }
    }

    return max
}
