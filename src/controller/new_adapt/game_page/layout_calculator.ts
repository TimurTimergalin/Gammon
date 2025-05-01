import {boardHeight, boardWidth, pieceWidth} from "../../../components/game/dimensions/board_size_constants";
import {
    ControlsLayoutMode,
    getControlsSpaceTaken,
    getHistoryPanelSpaceTaken,
    getSideBarSpaceTaken,
    HistoryPanelLayoutMode,
    mandatoryMargin,
    SideBarLayoutMode
} from "./layout_modes";

const minBoardWidth = 40 / pieceWidth * boardWidth
const minBoardHeight = 40 / pieceWidth * boardHeight

export type GamePageLayout = [SideBarLayoutMode, HistoryPanelLayoutMode, ControlsLayoutMode]

class GamePageLayoutTreeNode {
    sideBar: SideBarLayoutMode
    history: HistoryPanelLayoutMode
    controls: ControlsLayoutMode
    lackWidth: GamePageLayoutTreeNode | null
    lackHeight: GamePageLayoutTreeNode | null


    constructor(
        sideBar: SideBarLayoutMode,
        history: HistoryPanelLayoutMode,
        controls: ControlsLayoutMode,
        lackWidth: GamePageLayoutTreeNode | null,
        lackHeight: GamePageLayoutTreeNode | null) {
        this.sideBar = sideBar;
        this.history = history;
        this.controls = controls;
        this.lackWidth = lackWidth;
        this.lackHeight = lackHeight;
    }

    get widthTaken(): number {
        return 2 * mandatoryMargin +
            getHistoryPanelSpaceTaken(this.history).width +
            getSideBarSpaceTaken(this.sideBar).width +
            getControlsSpaceTaken(this.controls).width
    }

    get heightTaken(): number {
        return mandatoryMargin +
            getHistoryPanelSpaceTaken(this.history).height +
            getSideBarSpaceTaken(this.sideBar).height +
            getControlsSpaceTaken(this.controls).height
    }

    get layout(): GamePageLayout {
        return [this.sideBar, this.history, this.controls]
    }
}

export function getGamePageLayout(tree: GamePageLayoutTreeNode, screenWidth: number, screenHeight: number): GamePageLayout {
    const width = screenWidth - tree.widthTaken
    if (width < minBoardWidth) {
        if (tree.lackWidth === null) {
            return tree.layout
        } else {
            return getGamePageLayout(tree.lackWidth, screenWidth, screenHeight)
        }
    }
    const height = screenHeight - tree.heightTaken
    if (height < minBoardHeight) {
        if (tree.lackHeight === null) {
            return tree.layout
        } else {
            return getGamePageLayout(tree.lackHeight, screenWidth, screenHeight)
        }
    }
    return tree.layout
}

const collapsedDownRight =
    new GamePageLayoutTreeNode(
    "Collapsed", "Down", "Right",
    null,
    null
)

const diminishedNormalRight =
    new GamePageLayoutTreeNode(
        "Diminished", "Normal", "Right",
        new GamePageLayoutTreeNode(
            "Collapsed", "Normal", "Right",
            collapsedDownRight,
            null
        ),
        null
    )

export const gamePageLayoutTree =
    new GamePageLayoutTreeNode(
        "Normal", "Normal", "Normal",
        new GamePageLayoutTreeNode(
            "Diminished", "Normal", "Normal",
            new GamePageLayoutTreeNode(
                "Collapsed", "Normal", "Normal",
                new GamePageLayoutTreeNode(
                    "Collapsed", "Down", "Normal",
                    null,
                    collapsedDownRight
                ),
                new GamePageLayoutTreeNode(
                    "Collapsed", "Normal", "Right",
                    collapsedDownRight,
                    null
                )
            ),
            diminishedNormalRight
        ),
        new GamePageLayoutTreeNode(
            "Normal", "Normal", "Right",
            diminishedNormalRight,
            null
        )
    )
