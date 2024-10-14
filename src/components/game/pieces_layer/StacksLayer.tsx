import {GameStateContext} from "../common/GameState.ts";
import {
    boardHeight,
    boardWidth,
    gapWidth,
    middleX,
    pieceHeight,
    pieceWidth,
    sideWidth
} from "../board_size_constants.ts";
import {SideStack, TopDownStack} from "./stacks.tsx";
import {Direction} from "./direction.ts";
import {useContext} from "react";

export function StacksLayer(
) {
    const gameState = useContext(GameStateContext)!
    const stacks = []

    for (let i = 0; i < 12; ++i) {
        const leftX = sideWidth + pieceWidth + sideWidth + i * pieceWidth + (i >= 6 ? sideWidth + gapWidth + sideWidth : 0)

        stacks.push(
            <TopDownStack
                quantity={gameState.getPositionProps(i).quantity}
                color={gameState.getPositionProps(i).color}
                direction={Direction.DOWN}
                originX={leftX + pieceWidth / 2}
                originY={sideWidth + pieceWidth / 2}
                key={i}
            />,
            <TopDownStack
                quantity={gameState.getPositionProps(12 + i).quantity}
                color={gameState.getPositionProps(12 + i).color}
                direction={Direction.UP}
                originX={leftX + pieceWidth / 2}
                originY={boardHeight - sideWidth - pieceWidth / 2}
                key={12 + i}
            />
        )
    }

    stacks.push(
        <SideStack
            quantity={gameState.getPositionProps(24).quantity}
            color={gameState.getPositionProps(24).color}
            direction={Direction.DOWN}
            originX={sideWidth}
            originY={sideWidth}
            key={24}
        />,
        <TopDownStack
            quantity={gameState.getPositionProps(25).quantity}
            color={gameState.getPositionProps(25).color}
            direction={Direction.DOWN}
            originX={middleX}
            originY={sideWidth + pieceWidth / 2}
            key={25}
        />,
        <SideStack
            quantity={gameState.getPositionProps(26).quantity}
            color={gameState.getPositionProps(26).color}
            direction={Direction.DOWN}
            originX={boardWidth - sideWidth - pieceWidth}
            originY={sideWidth}
            key={26}
        />,
        <SideStack
            quantity={gameState.getPositionProps(27).quantity}
            color={gameState.getPositionProps(27).color}
            direction={Direction.UP}
            originX={sideWidth}
            originY={boardHeight - sideWidth - pieceHeight}
            key={27}
        />,
        <TopDownStack
            quantity={gameState.getPositionProps(28).quantity}
            color={gameState.getPositionProps(28).color}
            direction={Direction.UP}
            originX={middleX}
            originY={boardHeight - sideWidth - pieceWidth / 2}
            key={28}
        />,
        <SideStack
            quantity={gameState.getPositionProps(29).quantity}
            color={gameState.getPositionProps(29).color}
            direction={Direction.UP}
            originX={boardWidth - sideWidth - pieceWidth}
            originY={boardHeight - sideWidth - pieceHeight}
            key={29}
        />
    )
    return (
        <>
            {stacks}
        </>
    )
}