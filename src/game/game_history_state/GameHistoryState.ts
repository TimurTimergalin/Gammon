import {makeAutoObservable} from "mobx";
import {Color} from "../../common/color";

export type GameHistoryEntry =
    {type: "move", dice: [number, number], moves: string[]} |
    {type: "offer_double", newValue: number} |
    {type: "accept_double"} |
    {type: "game_end", white: number, black: number, reason?: string, winner: Color}

export type GameInfo = {firstToMove: Color}


export class GameHistoryState {
    get currentGame(): GameInfo | undefined {
        return this._currentGame;
    }

    set currentGame(value: GameInfo) {
        this._currentGame = value;
    }
    moves: GameHistoryEntry[] = []
    private _currentGame: GameInfo | undefined = undefined

    constructor() {
        makeAutoObservable(this)
    }

    add(entry: GameHistoryEntry) {
        this.moves.push(entry)
    }

    clear() {
        this.moves.splice(0)
        this._currentGame = undefined
    }
}