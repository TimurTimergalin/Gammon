import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {StacksLayer} from "./StacksLayer.tsx";
import {useGameContext} from "../common/GameContext.ts";


const PiecesLayer = observer(function PiecesLayer() {
    const gameState = useGameContext("gameState")
    const hoverTracker = useGameContext("hoverTracker")
    const gameController = useGameContext("gameController")

    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) {
                return
            }
            const clickedIndex = hoverTracker.hoveredIndex
            if (clickedIndex === null) {
                return
            }
            const pickedStack = gameState.getPositionProps(clickedIndex)

            if (pickedStack.pieces.length === 0) {
                return;
            }
            if (!gameController.isTouchable(clickedIndex)) {
                return;
            }

            const pickedColor = pickedStack.last.color
            gameState.legalMoves = gameController.getLegalMoves(clickedIndex)
            gameState.removePiece(clickedIndex)
            gameState.dragStatus = {
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
            if (gameState.dragStatus === null) {
                return
            }

            const releaseIndex = hoverTracker.hoveredIndex
            if (
                releaseIndex === null || !gameState.legalMoves?.includes(releaseIndex)
            ) {
                gameState.addPiece(gameState.dragStatus.clickedIndex, {color: gameState.dragStatus.pickedColor})
            } else {
                gameController.movePiece(gameState.dragStatus.clickedIndex, releaseIndex, gameState.dragStatus.pickedColor)
            }

            gameState.dragStatus = null
            gameState.legalMoves = []
        }

        document.addEventListener("mousedown", onMouseDown)
        document.addEventListener("mouseup", onMouseUp)

        return () => {
            document.removeEventListener("mousedown", onMouseDown)
            document.removeEventListener("mouseup", onMouseUp)
        }
    }, [gameState, gameState.dragStatus, hoverTracker, gameController]);

    return (
        <StacksLayer/>
    )
})

export default PiecesLayer