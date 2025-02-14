import {makeAutoObservable} from "mobx";

export class AuthStatus {
    get id(): number | null {
        return this._id;
    }

    set id(value: number | null) {
        this._id = value;
    }
    get username(): string | null {
        return this._username;
    }

    set username(value: string | null) {
        this._username = value;
    }
    private _username: string | null = null
    private _id: number | null = null

    constructor() {
        makeAutoObservable(this)
    }
}