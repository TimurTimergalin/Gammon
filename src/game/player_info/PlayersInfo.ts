import {PlayerState} from "./PlayerState.ts";
import {makeAutoObservable} from "mobx";

export class PlayersInfo {
    get player1(): PlayerState {
        return this._player1;
    }

    set player1(value: PlayerState) {
        this._player1 = value;
    }
    get player2(): PlayerState {
        return this._player2;
    }

    set player2(value: PlayerState) {
        this._player2 = value;
    }
    private _player1: PlayerState
    private _player2: PlayerState

    constructor(player1: PlayerState, player2: PlayerState) {
        this._player1 = player1
        this._player2 = player2
        makeAutoObservable(this)
    }
}