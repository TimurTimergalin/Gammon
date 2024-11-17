import {Color} from "../../color.ts";

export interface GameController {
    getNewDice(): void

    getLegalMoves(point: number): number[]

    isTouchable(point: number): boolean

    movePiece(to: number, color: Color): void

    movePieceFrom(to: number, from: number): void
}