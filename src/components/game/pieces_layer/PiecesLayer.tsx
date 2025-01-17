import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {StacksLayer} from "./StacksLayer.tsx";
import {useGameContext} from "../../../game/GameContext.ts";


type PointEvent = MouseEvent | TouchEvent

const eventX = (ev: PointEvent) => {
    if ("clientX" in ev) {
        return ev.clientX
    } else {
        return ev.touches[0].clientX
    }
}

const eventY = (ev: PointEvent) => {
    if ("clientY" in ev) {
        return ev.clientY
    } else {
        return ev.touches[0].clientY
    }
}

const isPrimary = (ev: PointEvent) => {
    if ("button" in ev) {
        return ev.button === 0
    }
    return true
}

const PiecesLayer = observer(function PiecesLayer() {
    const gameState = useGameContext("controlButtonsState")
    const boardState = useGameContext("boardState")
    const legalMovesTracker = useGameContext("legalMovesTracker")
    const hoverTracker = useGameContext("hoverTracker")
    const gameController = useGameContext("gameController")
    const dragState = useGameContext("dragState")

    useEffect(() => {
        const onMouseDown = (e: PointEvent) => {
            if (!isPrimary(e)) {
                return
            }
            const clickedIndex = hoverTracker.hoveredIndex
            if (clickedIndex === null) {
                return
            }
            const pickedStack = boardState.get(clickedIndex)

            if (pickedStack.pieces.length === 0) {
                return;
            }
            if (!gameController.isTouchable(clickedIndex)) {
                return;
            }

            const pickedColor = pickedStack.last.color
            gameController.calculateLegalMoves(clickedIndex)
            gameController.remove(clickedIndex)
            boardState.eraseFrom()
            dragState.dragStatus = {
                clickX: eventX(e),
                clickY: eventY(e),
                clickedIndex: clickedIndex,
                pickedColor: pickedColor!,
                timestamp: Date.now()
            }
        }

        const onMouseUp = (e: PointEvent) => {
            if (!isPrimary(e)) {
                return
            }
            if (dragState.dragStatus === null) {
                return
            }

            const releaseIndex = hoverTracker.hoveredIndex

            const deltaMs = 200 // Время, отличающее клик от перетаскивания
            const now = Date.now()

            if (dragState.dragStatus.timestamp + deltaMs > now && (releaseIndex === dragState.dragStatus.clickedIndex || releaseIndex === null)) {
                gameController.quickMove(dragState.dragStatus.clickedIndex, dragState.dragStatus.pickedColor)
            } else if (
                releaseIndex === null || !gameController.isLegal(releaseIndex)
            ) {
                gameController.putBack(dragState.dragStatus.clickedIndex, dragState.dragStatus.pickedColor)
            } else {
                gameController.put(releaseIndex, dragState.dragStatus.pickedColor)
            }

            dragState.dragStatus = null
            legalMovesTracker.clear()
        }

        document.addEventListener("mousedown", onMouseDown)
        document.addEventListener("touchstart", onMouseDown)
        document.addEventListener("mouseup", onMouseUp)
        document.addEventListener("touchend", onMouseUp)
        document.addEventListener("touchcancel", onMouseUp)

        return () => {
            document.removeEventListener("mousedown", onMouseDown)
            document.removeEventListener("mouseup", onMouseUp)
            document.removeEventListener("mouseup", onMouseUp)
            document.removeEventListener("touchend", onMouseUp)
            document.removeEventListener("touchcancel", onMouseUp)
        }
    }, [boardState, dragState, gameController, gameState, hoverTracker, legalMovesTracker]);

    return (
        <StacksLayer/>
    )
})

export default PiecesLayer