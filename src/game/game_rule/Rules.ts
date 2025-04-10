import {Color} from "../../common/color";
import {CompoundMove, Move} from "../board/move";
import {Board} from "../board/Board";

export interface Rules<Index, Prop> {
    // Есть ли активные фишки игрока player на позиции position
    owns(board: Board<Index, Prop>, player: Color, position: Index): boolean;

    // На какие значения может сходить игрок - убирает невозможные ходы, удваивает дубли
    calculateDiceValues(board: Board<Index, Prop>, dice: [number, number], player: Color): number[];

    // Какие ходы может сделать игрок
    getLegalMoves(board: Board<Index, Prop>, from: Index, player: Color, diceValues: number[], performedMoves: CompoundMove<Index>[]): CompoundMove<Index>[];

    // Куда попадет фишка с from, если игрок player передвинет ее, используя кубик by
    movedBy(from: Index, by: number, player: Color): Index

    // Не дошел ли player до конца
    noMovesLeft(board: Board<Index, Prop>, player: Color): boolean

    // Группирует отсортированные в порядке срабатывания ходы по времени срабатывания
    squashMoves(moves: Move<Index>[]): Move<Index>[][]

    // Считает очки, которые получит игрок winner, если объявить его победителем
    calculatePoints(board: Board<Index, Prop>, winner: Color): number

    // Может ли игрок сдаться заранее
    canConcedePrematurely(board: Board<Index, Prop>, player: Color): boolean
}
