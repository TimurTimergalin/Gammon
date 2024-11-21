import {makeAutoObservable} from "mobx";
import {PiecePlacement, PieceState, PositionState} from "./piece_placement.ts";
import {DiceState} from "./DiceState.ts";
import {DragStatus} from "./DragStatus.ts";

export class GameState {
    _piecePlacement: PiecePlacement = new Map() // Текущая расстановка шашек на доске

    constructor() {
        makeAutoObservable(this)
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

    private _turnComplete: boolean = false
    get turnComplete(): boolean {
        return this._turnComplete
    }

    set turnComplete(val: boolean) {
        this._turnComplete = val
    }

    private _movesMade: boolean = false
    get movesMade(): boolean {
        return this._movesMade
    }
    set movesMade(val: boolean) {
        this._movesMade = val
    }

    get pickedFrom(): number | null {
        if (this.dragStatus === null) {
            return null
        } else {
            return this.dragStatus.clickedIndex
        }
    }

    addPiece(i: number, piece: PieceState) {
        this.getPositionProps(i).add(piece)
    }

    removePiece(i: number): PieceState {
        return this.getPositionProps(i).remove()
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
        if (!this._piecePlacement.has(i)) {
            const posState = new PositionState()
            this._piecePlacement.set(i, posState)
            return this._piecePlacement.get(i)!
        }

        return this._piecePlacement.get(i)!
    }

    set piecePlacement(placement: PiecePlacement) {
        for (let i = 0; i < 30; ++i) {
            if (!placement.has(i)) {
                placement.set(i, new PositionState([]))
            }
        }
        this._piecePlacement = placement
    }

    apply(callback: () => void) {
        callback()
    }
}

