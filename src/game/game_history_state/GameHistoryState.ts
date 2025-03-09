import {makeAutoObservable} from "mobx";
import {Color} from "../../common/color";

export type GameHistoryEntry =
    {type: "move", dice: [number, number], moves: string[]} |
    {type: "offer_double", newValue: number} |
    {type: "accept_double"} |
    {type: "game_end", white: number, black: number, reason?: string, winner: Color}

export type GameInfo = {firstEntry: number, firstToMove: Color}


export class GameHistoryState {
    moves: (GameHistoryEntry & {game: number})[] = []
    games: GameInfo[] = []
    private currentGame = -1

    constructor() {
        makeAutoObservable(this)
    }

    add(entry: GameHistoryEntry, newGame?: {firstToMove: Color}) {
        if (newGame !== undefined) {
            this.games.push({firstEntry: this.moves.length, ...newGame})
            ++this.currentGame
        }
        this.moves.push({...entry, game: this.currentGame})
    }
}