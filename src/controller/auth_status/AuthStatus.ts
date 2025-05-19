import {makeAutoObservable} from "mobx";
import {InvitePolicy} from "../../requests/requests";

export class AuthStatus {
    get rating(): {
        backgammonBlitz: number;
        backgammonDefault: number;
        nardeBlitz: number;
        nardeDefault: number
    } | null {
        return this._rating;
    }

    set rating(value: {
        backgammonBlitz: number;
        backgammonDefault: number;
        nardeBlitz: number;
        nardeDefault: number
    } | null) {
        this._rating = value;
    }
    get invitePolicy(): InvitePolicy | null {
        return this._invitePolicy;
    }

    set invitePolicy(value: InvitePolicy | null) {
        this._invitePolicy = value;
    }
    get login(): string | null {
        return this._login;
    }

    set login(value: string | null) {
        this._login = value;
    }
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
    private _login: string | null = null
    private _invitePolicy: InvitePolicy | null = null

    private _rating: {
        backgammonBlitz: number,
        backgammonDefault: number,
        nardeBlitz: number,
        nardeDefault: number
    } | null = null

    constructor() {
        makeAutoObservable(this)
    }
}