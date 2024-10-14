import {useContext, useEffect, useState} from "react";
import DragPiece from "./DragPiece.tsx";
import {HoverTrackerContext} from "../common/HoverTracker.ts";
import {GameStateContext} from "../common/GameState.ts";
import {observer} from "mobx-react-lite";
import {Color} from "../color.ts";
import {StacksLayer} from "./StacksLayer.tsx";


interface DragStatus {
    clickX: number | null
    clickY: number | null
    clickedIndex: number | null
    pickedColor: Color | null
}


const PiecesLayer = observer(() => {
    const gameState = useContext(GameStateContext)!
    const hoverTracker = useContext(HoverTrackerContext)!
    const [dragStatus, setDragStatus] = useState<DragStatus>({
        clickX: null,
        clickY: null,
        clickedIndex: null,
        pickedColor: null
    })

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

            if (pickedStack.quantity === 0) {
                return;
            }
            // TODO: здесь нужно проверять, можно ли подобрать фишку

            const pickedColor = pickedStack.color
            gameState.setPlacementProperty([[clickedIndex, {
                quantity: pickedStack.quantity - 1,
                color: pickedStack.quantity === 1 ? null : pickedColor
            }]])
            setDragStatus({clickX: e.clientX, clickY: e.clientY, clickedIndex: clickedIndex, pickedColor: pickedColor})
        }

        const onMouseUp = (e: MouseEvent) => {
            if (e.button !== 0) {
                return
            }
            if (dragStatus.clickedIndex === null) {
                return
            }

            const releaseIndex = hoverTracker.hoveredIndex
            const releaseStack = releaseIndex === null ? null : gameState.getPositionProps(releaseIndex)
            if (
                releaseIndex === null ||
                (releaseStack!.color !== null && releaseStack!.color !== dragStatus.pickedColor)
                // TODO: здесь нужно проверять, можно ли положить фишку
            ) {
                const pickedStack = gameState.getPositionProps(dragStatus.clickedIndex)
                gameState.setPlacementProperty([[dragStatus.clickedIndex, {
                    quantity: pickedStack.quantity + 1,
                    color: dragStatus.pickedColor
                }]])
            } else {
                gameState.setPlacementProperty([[releaseIndex, {
                    quantity: releaseStack!.quantity + 1,
                    color: dragStatus.pickedColor
                }]])
            }

            setDragStatus({clickX: null, clickY: null, clickedIndex: null, pickedColor: null})
        }

        document.addEventListener("mousedown", onMouseDown)
        document.addEventListener("mouseup", onMouseUp)

        return () => {
            document.removeEventListener("mousedown", onMouseDown)
            document.removeEventListener("mouseup", onMouseUp)
        }
    }, [gameState, dragStatus, hoverTracker]);
    
    return (
        <>
            <StacksLayer />
            {dragStatus.clickedIndex !== null &&
                <DragPiece
                    color={dragStatus.pickedColor!}
                    initClientX={dragStatus.clickX!}
                    initClientY={dragStatus.clickY!}
                />}
        </>
    )
})

export default PiecesLayer