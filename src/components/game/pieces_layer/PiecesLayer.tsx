import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {StacksLayer} from "./StacksLayer.tsx";
import {useGameContext} from "../../../game/GameContext.ts";


const PiecesLayer = observer(function PiecesLayer() {
    const gameState = useGameContext("controlButtonsState")
    const boardState = useGameContext("boardState")
    const legalMovesTracker = useGameContext("legalMovesTracker")
    const hoverTracker = useGameContext("hoverTracker")
    const gameController = useGameContext("gameController")
    const dragState = useGameContext("dragState")

    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) {
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
                clickX: e.clientX,
                clickY: e.clientY,
                clickedIndex: clickedIndex,
                pickedColor: pickedColor!
            }
        }

        const onMouseUp = (e: MouseEvent) => {
            if (e.button !== 0) {
                return
            }
            if (dragState.dragStatus === null) {
                return
            }

            const releaseIndex = hoverTracker.hoveredIndex
            if (
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
        document.addEventListener("mouseup", onMouseUp)

        return () => {
            document.removeEventListener("mousedown", onMouseDown)
            document.removeEventListener("mouseup", onMouseUp)
        }
    }, [boardState, dragState, gameController, gameState, hoverTracker, legalMovesTracker]);

    return (
        <StacksLayer/>
    )
})

export default PiecesLayer