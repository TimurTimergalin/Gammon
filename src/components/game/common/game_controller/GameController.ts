export interface GameController {
    getNewDice(): void
    getLegalMoves(point: number, dice_array: number[]): number[]
    isTouchable(point: number): boolean
}