import {makeAutoObservable} from "mobx";
import {Color} from "../color.ts";
import {LayerStatus} from "../dice_layer/LayerStatus.ts";

export interface PieceState {
    color: Color,
    from?: {
        x: number,
        y: number
    }
}

export class PositionState {
    pieces: PieceState[]

    constructor(pieces?: PieceState[]) {
        this.pieces = pieces === undefined ? [] : pieces;
    }

    get quantity(): number {
        return this.pieces.length
    }

    get last(): PieceState {
        return this.pieces[this.pieces.length - 1]
    }
}

export interface DiceState {
    value: number,
    color: Color,
    usageStatus: LayerStatus,
    unavailabilityStatus: LayerStatus
}

export interface DragStatus {
    clickX: number
    clickY: number
    clickedIndex: number
    pickedColor: Color
}

export type PiecePlacement = Map<number, PositionState>

export class GameState {
    private piecePlacement: PiecePlacement  // Текущая расстановка шашек на доске

    constructor(piecePlacement: PiecePlacement) {
        makeAutoObservable(this)
        this.piecePlacement = piecePlacement
    }

    private _dice1: DiceState | null = null  // Первая кость

    get dice1(): DiceState | null {
        return this._dice1;
    }

    set dice1(value: DiceState | null) {
        this._dice1 = value;
    }

    private _dice2: DiceState | null = null  // Вторая кость TODO: заменить на массив

    get dice2(): DiceState | null {
        return this._dice2;
    }

    set dice2(value: DiceState | null) {
        this._dice2 = value;
    }

    private _pickedFrom: number | null = null  // Откуда была подобрана фишка

    get pickedFrom(): number | null {
        return this._pickedFrom;
    }

    set pickedFrom(value: number | null) {
        this._pickedFrom = value;
    }

    private _legalMoves: number[] = []  // Массив всех позиций, на которые можно сходить

    get legalMoves(): number[] {
        return this._legalMoves;
    }

    set legalMoves(value: number[]) {
        this._legalMoves = value;
    }

    private _dragStatus: DragStatus | null = null  // Информация о подобранной фишке

    get dragStatus(): DragStatus | null {
        return this._dragStatus;
    }

    set dragStatus(value: DragStatus | null) {
        this._dragStatus = value;
    }

    addPiece(i: number, piece: PieceState) {
        this.getPositionProps(i).pieces.push(piece)
    }

    removePiece(i: number): PieceState {
        const positionProps = this.getPositionProps(i)
        console.assert(positionProps.quantity !== 0)
        return positionProps.pieces.pop()!
    }

    getPositionProps = (i: number) => {
        // В PiecePlacement позиции хранятся с точки зрения положения на доске, а не с точки зрения правил игры
        // 0 - 11 - верхняя половина
        // 12 - 23 - вторая половина
        // 24 - левый верхний стор
        // 25 - верхний бар
        // 26 - правый верхний стор
        // 27 - левый нижний стор
        // 28 - нижний бар
        // 29 - правый нижний стор
        console.assert(0 <= i && i <= 29)
        const to_return = this.piecePlacement.get(i)
        if (to_return === undefined) {
            const posState = new PositionState()
            this.piecePlacement.set(i, posState)
            return posState
        }
        return to_return
    }
}
