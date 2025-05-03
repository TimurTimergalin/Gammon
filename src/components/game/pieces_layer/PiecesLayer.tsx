import {useEffect, useRef} from "react";
import {observer} from "mobx-react-lite";
import {StacksLayer} from "./StacksLayer";
import {useGameContext} from "../../../game/GameContext";
import {isPrimary, PointEvent, pointX, pointY} from "../../../common/point_event";
import {useMousePositionRef} from "../../../common/hooks";


const PiecesLayer = observer(function PiecesLayer() {
    const gameState = useGameContext("controlButtonsState")
    const boardState = useGameContext("boardState")
    const legalMovesTracker = useGameContext("legalMovesTracker")
    const hoverTracker = useGameContext("hoverTracker")
    const gameController = useGameContext("gameController")
    const dragState = useGameContext("dragState")

    const mousePosRef = useMousePositionRef()

    const showLegalMovesTimeout = useRef(setTimeout(() => {
    }))
    const maxClickDuration = 100

    useEffect(() => {
        const onMouseDown = (e: PointEvent) => {
            if (!isPrimary(e)) {
                return
            }

            hoverTracker.changeHoverIndex(pointX(e), pointY(e))

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

            const moves = gameController.calculateLegalMoves(clickedIndex)
            showLegalMovesTimeout.current = setTimeout(
                () => {
                    const pickedColor = pickedStack.last.color
                    for (const move of moves) {
                        legalMovesTracker.add(move)
                    }
                    gameController.remove(clickedIndex)
                    boardState.eraseFrom()
                    dragState.dragStatus = {
                        clickX: mousePosRef.current[0],
                        clickY: mousePosRef.current[1],
                        pickedColor: pickedColor!
                    }
                },
                maxClickDuration
            )
            dragState.clickedIndex = clickedIndex
        }

        const onMouseUp = (e: PointEvent) => {
            if (!isPrimary(e)) {
                return
            }
            clearTimeout(showLegalMovesTimeout.current)
            if (dragState.clickedIndex === null) {
                return
            }

            if (e.type === "touchend" || e.type === "touchcancel") {
                e.preventDefault()
            }

            const releaseIndex = hoverTracker.hoveredIndex
            
            if (dragState.dragStatus === null) {
                if (dragState.clickedIndex === releaseIndex || releaseIndex === null) {
                    boardState.eraseFrom()
                    gameController.quickMove(dragState.clickedIndex)
                    dragState.clickedIndex = null
                }
                return;
            }
            if (
                releaseIndex === null || !gameController.isLegal(releaseIndex)
            ) {
                gameController.putBack(dragState.clickedIndex, dragState.dragStatus.pickedColor)
            } else {
                gameController.put(releaseIndex, dragState.dragStatus.pickedColor)
            }

            dragState.clickedIndex = null
            dragState.dragStatus = null
            legalMovesTracker.clear()
        }

        const disableContextMenu = (ev: Event) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            ev.stopPropagation()
            return false
        }

        const onMove = (e: TouchEvent) => {
            if (dragState.clickedIndex !== null) {
                e.preventDefault()
            }
        }

        document.addEventListener("mousedown", onMouseDown)
        document.addEventListener("mouseup", onMouseUp)
        document.addEventListener("touchstart", onMouseDown)
        document.addEventListener("touchend", onMouseUp)
        document.addEventListener("touchcancel", onMouseUp)
        document.addEventListener("contextmenu", disableContextMenu)
        document.addEventListener("touchmove", onMove, {passive: false})

        return () => {
            document.removeEventListener("mousedown", onMouseDown)
            document.removeEventListener("mouseup", onMouseUp)
            document.removeEventListener("touchstart", onMouseDown)
            document.removeEventListener("touchend", onMouseUp)
            document.removeEventListener("touchcancel", onMouseUp)
            document.removeEventListener("contextmenu", disableContextMenu)
            document.removeEventListener("touchmove", onMove)
        }
    }, [boardState, dragState, gameController, gameState, hoverTracker, legalMovesTracker, mousePosRef]);

    return (
        <StacksLayer/>
    )
})

export default PiecesLayer