import {boardHeight, boardWidth, pieceWidth} from "../../../../components/game/dimensions/board_size_constants";
import {ControlsLayoutMode, HistoryPanelLayoutMode} from "../layout_modes";
import {SideBarLayoutMode} from "../../side_bar/layout_modes";
import {GamePageLayout, getHeightTaken, getWidthTaken} from "./common";

const minBoardWidth = 40 / pieceWidth * boardWidth
const minBoardHeight = 40 / pieceWidth * boardHeight


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
        return getWidthTaken([this.sideBar, this.history, this.controls])
    }

    get heightTaken(): number {
        return getHeightTaken([this.sideBar, this.history, this.controls])
    }

    get layout(): GamePageLayout {
        return [this.sideBar, this.history, this.controls]
    }
}

export function getGamePageLayoutV1(tree: GamePageLayoutTreeNode, screenWidth: number, screenHeight: number): GamePageLayout {
    const width = screenWidth - tree.widthTaken
    if (width < minBoardWidth) {
        if (tree.lackWidth === null) {
            return tree.layout
        } else {
            return getGamePageLayoutV1(tree.lackWidth, screenWidth, screenHeight)
        }
    }
    const height = screenHeight - tree.heightTaken
    if (height < minBoardHeight) {
        if (tree.lackHeight === null) {
            return tree.layout
        } else {
            return getGamePageLayoutV1(tree.lackHeight, screenWidth, screenHeight)
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
