import {DoubleCube} from "./DoubleCube";
import {boardHeight, boardWidth, pieceWidth, sideWidth, storeHeight} from "../../dimensions/board_size_constants";
import {useGameContext} from "../../../../game/GameContext";
import {Stand, Store} from "../../../../game/game_rule/DoubleCubePositionMapper";
import {Color} from "../../../../common/color";
import {observer} from "mobx-react-lite";

const getStorePosition = (store: Store): {cx: number, cy: number} => {
    const dx = sideWidth + pieceWidth / 2
    const dy = sideWidth + storeHeight / 2

    return store === "TopLeft" ? {
        cx: dx,
        cy: dy
    } : store === "BottomLeft" ? {
        cx: dx,
        cy: boardHeight - dy
    } : store === "TopRight" ? {
        cx: boardWidth - dx,
        cy: dy
    } : {
        cx: boardWidth - dx,
        cy: boardHeight - dy
    }
}

const getStandPosition = (stand: Stand): {cx: number, cy: number} => {
    const dx = sideWidth + pieceWidth / 2
    const dy = boardHeight / 2
    return stand === "left" ? {
        cx: dx,
        cy: dy
    } : {
        cx: boardWidth - dx,
        cy: dy
    }
}


export const DoubleCubeLayer = observer(function DoubleCubeLayer() {
    const doubleCubeState = useGameContext("doubleCubeState")

    if (doubleCubeState.state === "unavailable") {
        return <></>
    }

    console.assert(doubleCubeState.value !== undefined)
    console.assert(doubleCubeState.positionMapper !== undefined)

    let position: { cx: number, cy: number }
    let rotation: number
    if (doubleCubeState.state === "free") {
        position = getStandPosition(doubleCubeState.positionMapper!.positionFree())
        rotation = doubleCubeState.positionMapper!.rotationFree()
    } else if (doubleCubeState.state === "offered_to_black" || doubleCubeState.state === "offered_to_white") {
        position = {cx: boardWidth / 2, cy: boardHeight / 2}
        rotation = doubleCubeState.positionMapper!.rotationOwned(
            doubleCubeState.state === "offered_to_white" ? Color.WHITE : Color.BLACK
        )
    } else {
        const owner = doubleCubeState.state === "belongs_to_white" ? Color.WHITE : Color.BLACK
        position = getStorePosition(doubleCubeState.positionMapper!.positionOwned(owner))
        rotation = doubleCubeState.positionMapper!.rotationOwned(owner)
    }

    return <DoubleCube value={doubleCubeState.value!} {...position} rotation={rotation}/>
})