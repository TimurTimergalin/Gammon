import {
    boardHeight,
    boardWidth,
    middleX,
    pieceHeight,
    pieceWidth,
    sideWidth
} from "../dimensions/board_size_constants.ts";
import {SideStack, TopDownStack} from "./stacks.tsx";
import {Direction} from "./direction.ts";
import {useGameContext} from "../common/GameContext.ts";
import {getTriangleLeft} from "../dimensions/functions.ts";

export function StacksLayer() {
    const gameState = useGameContext("gameState")
    const stacks = []

    for (let i = 0; i < 12; ++i) {
        const leftX = getTriangleLeft(i)

        stacks.push(
            <TopDownStack
                pieces={gameState.getPositionProps(i).pieces}
                direction={Direction.DOWN}
                originX={leftX + pieceWidth / 2}
                originY={sideWidth + pieceWidth / 2}
                key={i}
            />,
            <TopDownStack
                pieces={gameState.getPositionProps(12 + i).pieces}
                direction={Direction.UP}
                originX={leftX + pieceWidth / 2}
                originY={boardHeight - sideWidth - pieceWidth / 2}
                key={12 + i}
            />
        )
    }

    stacks.push(
        <SideStack
            pieces={gameState.getPositionProps(24).pieces}
            direction={Direction.DOWN}
            originX={sideWidth}
            originY={sideWidth}
            key={24}
        />,
        <TopDownStack
            pieces={gameState.getPositionProps(25).pieces}
            direction={Direction.DOWN}
            originX={middleX}
            originY={sideWidth + pieceWidth / 2}
            key={25}
        />,
        <SideStack
            pieces={gameState.getPositionProps(26).pieces}
            direction={Direction.DOWN}
            originX={boardWidth - sideWidth - pieceWidth}
            originY={sideWidth}
            key={26}
        />,
        <SideStack
            pieces={gameState.getPositionProps(27).pieces}
            direction={Direction.UP}
            originX={sideWidth}
            originY={boardHeight - sideWidth - pieceHeight}
            key={27}
        />,
        <TopDownStack
            pieces={gameState.getPositionProps(28).pieces}
            direction={Direction.UP}
            originX={middleX}
            originY={boardHeight - sideWidth - pieceWidth / 2}
            key={28}
        />,
        <SideStack
            pieces={gameState.getPositionProps(29).pieces}
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