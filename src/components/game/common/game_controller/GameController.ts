export interface GameController {
    getNewDice(): void
    getLegalMoves(point: number): number[]
    isTouchable(point: number): boolean
}