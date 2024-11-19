import {Color} from "../color.ts";

export interface GameController {
    endTurn(): void

    getLegalMoves(point: number): number[]

    isTouchable(point: number): boolean

    movePiece(from: number, to: number, color: Color): void

    init(): void
}