import {
    boardHeight,
    boardWidth,
    gapWidth,
    middleX,
    pieceHeight,
    pieceWidth,
    sideWidth,
    storeHeight,
    triangleHeight
} from "../board_size_constants.ts";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {HoverTrigger, SideStack, TopDownStack} from "./stacks";
import DragPiece from "./DragPiece.tsx";
import {HoverTracker} from "./HoverTracker.ts";
import {GameStateContext, PositionState} from "../GameState";
import {observer} from "mobx-react-lite";
import {Color} from "../color.ts";
import {Direction} from "./direction.ts";

function getStacks(getPositionProps: (i: number) => PositionState
) {
    const stacks = []

    for (let i = 0; i < 12; ++i) {
        const leftX = sideWidth + pieceWidth + sideWidth + i * pieceWidth + (i >= 6 ? sideWidth + gapWidth + sideWidth : 0)

        stacks.push(
            <TopDownStack
                quantity={getPositionProps(i).quantity}
                color={getPositionProps(i).color}
                direction={Direction.DOWN}
                originX={leftX + pieceWidth / 2}
                originY={sideWidth + pieceWidth / 2}
                key={i}
            />,
            <TopDownStack
                quantity={getPositionProps(12 + i).quantity}
                color={getPositionProps(12 + i).color}
                direction={Direction.UP}
                originX={leftX + pieceWidth / 2}
                originY={boardHeight - sideWidth - pieceWidth / 2}
                key={12 + i}
            />
        )
    }

    stacks.push(
        <SideStack
            quantity={getPositionProps(24).quantity}
            color={getPositionProps(24).color}
            direction={Direction.DOWN}
            originX={sideWidth}
            originY={sideWidth}
            key={24}
        />,
        <TopDownStack
            quantity={getPositionProps(25).quantity}
            color={getPositionProps(25).color}
            direction={Direction.DOWN}
            originX={middleX}
            originY={sideWidth + pieceWidth / 2}
            key={25}
        />,
        <SideStack
            quantity={getPositionProps(26).quantity}
            color={getPositionProps(26).color}
            direction={Direction.DOWN}
            originX={boardWidth - sideWidth - pieceWidth}
            originY={sideWidth}
            key={26}
        />,
        <SideStack
            quantity={getPositionProps(27).quantity}
            color={getPositionProps(27).color}
            direction={Direction.UP}
            originX={sideWidth}
            originY={boardHeight - sideWidth - pieceHeight}
            key={27}
        />,
        <TopDownStack
            quantity={getPositionProps(28).quantity}
            color={getPositionProps(28).color}
            direction={Direction.UP}
            originX={middleX}
            originY={boardHeight - sideWidth - pieceWidth / 2}
            key={28}
        />,
        <SideStack
            quantity={getPositionProps(29).quantity}
            color={getPositionProps(29).color}
            direction={Direction.UP}
            originX={boardWidth - sideWidth - pieceWidth}
            originY={boardHeight - sideWidth - pieceHeight}
            key={29}
        />
    )
    return stacks;
}

function getHoverTriggers(hoverTracker: HoverTracker) {
    const triggers = []

    const triangleTriggerHeight = triangleHeight + pieceWidth / 2

    for (let i = 0; i < 12; ++i) {
        const leftX = sideWidth + pieceWidth + sideWidth + i * pieceWidth + (i >= 6 ? sideWidth + gapWidth + sideWidth : 0)
        triggers.push(
            <HoverTrigger
                originX={leftX}
                originY={sideWidth}
                width={pieceWidth}
                height={triangleTriggerHeight}
                index={i}
                hoverTracker={hoverTracker}
                key={i}
            />,
            <HoverTrigger
                originX={leftX}
                originY={boardHeight - sideWidth - triangleTriggerHeight}
                width={pieceWidth}
                height={triangleTriggerHeight}
                index={12 + i}
                hoverTracker={hoverTracker}
                key={12 + i}
            />
        )
    }

    triggers.push(
        <HoverTrigger
            originX={sideWidth}
            originY={sideWidth}
            width={pieceWidth}
            height={storeHeight}
            index={24}
            hoverTracker={hoverTracker}
            key={24}
        />,
        <HoverTrigger
            originX={middleX - pieceWidth / 2}
            originY={sideWidth}
            width={pieceWidth}
            height={triangleTriggerHeight}
            index={25}
            hoverTracker={hoverTracker}
            key={25}
        />,
        <HoverTrigger
            originX={boardWidth - sideWidth - pieceWidth}
            originY={sideWidth}
            width={pieceWidth}
            height={storeHeight}
            index={26}
            hoverTracker={hoverTracker}
            key={26}
        />,
        <HoverTrigger
            originX={sideWidth}
            originY={boardHeight - sideWidth - storeHeight}
            width={pieceWidth}
            height={storeHeight}
            index={27}
            hoverTracker={hoverTracker}
            key={27}
        />,
        <HoverTrigger
            originX={middleX - pieceWidth / 2}
            originY={boardHeight - sideWidth - triangleTriggerHeight}
            width={pieceWidth}
            height={triangleTriggerHeight}
            index={28}
            hoverTracker={hoverTracker}
            key={28}
        />,
        <HoverTrigger
            originX={boardWidth - sideWidth - pieceWidth}
            originY={boardHeight - sideWidth - storeHeight}
            width={pieceWidth}
            height={storeHeight}
            index={29}
            hoverTracker={hoverTracker}
            key={29}
        />
    )

    return triggers
}


interface DragStatus {
    clickX: number | null
    clickY: number | null
    clickedIndex: number | null
    pickedColor: Color | null
}


const PiecesLayer = observer(() => {
    const gameState = useContext(GameStateContext)!
    const hoverTracker = useRef(new HoverTracker())
    const [dragStatus, setDragStatus] = useState<DragStatus>({
        clickX: null,
        clickY: null,
        clickedIndex: null,
        pickedColor: null
    })


    const getPositionProps = useCallback((i: number) => {
        const res = gameState.piecePlacement.get(i)
        if (res === undefined) {
            return {quantity: 0, color: null}
        }
        if (res.quantity === 0) {
            res.color = null
        }
        return res
    }, [gameState.piecePlacement])


    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) {
                return
            }
            const clickedIndex = hoverTracker.current.hoveredIndex
            if (clickedIndex === null) {
                return
            }
            const pickedStack = getPositionProps(clickedIndex)

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

            const releaseIndex = hoverTracker.current.hoveredIndex
            const releaseStack = releaseIndex === null ? null : getPositionProps(releaseIndex)
            if (
                releaseIndex === null ||
                (releaseStack!.color !== null && releaseStack!.color !== dragStatus.pickedColor)
                // TODO: здесь нужно проверять, можно ли положить фишку
            ) {
                const pickedStack = getPositionProps(dragStatus.clickedIndex)
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
    }, [gameState, dragStatus, getPositionProps]);

    const stacks = getStacks(getPositionProps);
    const triggers = getHoverTriggers(hoverTracker.current)

    return (
        <>
            {stacks}
            {dragStatus.clickedIndex !== null &&
                <DragPiece
                    color={dragStatus.pickedColor!}
                    initClientX={dragStatus.clickX!}
                    initClientY={dragStatus.clickY!}
                />}
            {triggers}
        </>
    )
})

export default PiecesLayer