import {Color} from "../color.ts";
import {CompoundMove} from "../board/move.ts";
import {Board} from "../board/Board.ts";

export interface Rules<Index, Prop> {
    owns(board: Board<Index, Prop>, player: Color, position: Index): boolean;

    calculateDiceValues(board: Board<Index, Prop>, dice: [number, number], player: Color): number[];

    getLegalMoves(board: Board<Index, Prop>, from: Index, player: Color, diceValues: number[]): CompoundMove<Index>[];

    movedBy(from: Index, by: number, player: Color): Index

    noMovesLeft(board: Board<Index, Prop>, player: Color): boolean
}
