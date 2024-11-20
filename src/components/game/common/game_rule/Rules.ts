import {Color} from "../color.ts";

export interface Rules<PositionIndexType, PositionPropsType> {
    calculateDiceValues(dice: [number, number], player: Color): number[]
    getLegalMoves(from: PositionIndexType, player: Color): [PositionIndexType, [PositionIndexType, PositionIndexType][], number[]][]
    performMove(from: PositionIndexType, to: PositionIndexType, additionalMoves: [PositionIndexType, PositionIndexType][], diceUsed: number[]): void
    undoMove(from: PositionIndexType, to: PositionIndexType, additionalMoves: [PositionIndexType, PositionIndexType][], diceUsed: number[]): void
    get placement(): Map<PositionIndexType, PositionPropsType>
    set placement(placement: Map<PositionIndexType, PositionPropsType>)
    owns(player: Color, position: PositionIndexType): boolean
    isTurnComplete(): boolean
}


