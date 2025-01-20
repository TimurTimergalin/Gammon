import {Color} from "../../common/color.ts";

export interface GameController {
    calculateLegalMoves(point: number): void

    clearLegalMoves(): void

    isTouchable(point: number): boolean

    isLegal(point: number): boolean

    remove(from: number): void

    put(to: number, color: Color): void

    quickMove(from: number, color: Color): void

    putBack(to: number, color: Color): void

    undoMoves(): void

    endTurn(): void

    swapDice(): void
}