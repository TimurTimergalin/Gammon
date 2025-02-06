import {Color} from "../../common/color";

export interface GameController {
    calculateLegalMoves(point: number): Iterable<number>

    clearLegalMoves(): void

    isTouchable(point: number): boolean

    isLegal(point: number): boolean

    remove(from: number): void

    put(to: number, color: Color): void

    quickMove(from: number): void

    putBack(to: number, color: Color): void

    undoMoves(): void

    endTurn(): void

    swapDice(): void
}