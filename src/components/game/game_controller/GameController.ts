import {createContext} from "react";

export interface GameController {
    getNewDice(): void
    getLegalMoves(point: number, dice_array: number[]): number[]
    isTouchable(point: number): boolean
}

export const GameControllerContext = createContext<GameController | null>(null)
