import {getSideBarSpaceTaken, SideBarLayoutMode} from "../../side_bar/layout_modes";
import {
    ControlsLayoutMode,
    getControlsSpaceTaken,
    getHistoryPanelSpaceTaken,
    HistoryPanelLayoutMode
} from "../layout_modes";

const mandatoryMargin = 10

export type GamePageLayout = [SideBarLayoutMode, HistoryPanelLayoutMode, ControlsLayoutMode]

export function getWidthTaken([sb, h, c]: GamePageLayout) {
    return (
        2 * mandatoryMargin +
        getSideBarSpaceTaken(sb).width +
        getHistoryPanelSpaceTaken(h).width +
        getControlsSpaceTaken(c).width
    )
}

export function getHeightTaken([sb, h, c]: GamePageLayout) {
    return (
        mandatoryMargin +
        getSideBarSpaceTaken(sb).height +
        getHistoryPanelSpaceTaken(h).height +
        getControlsSpaceTaken(c).height
    )
}