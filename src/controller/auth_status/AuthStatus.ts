import {makeAutoObservable} from "mobx";
import {InvitePolicy} from "../../requests/requests";

export class AuthStatus {
    get policy(): InvitePolicy | null {
        return this._policy;
    }

    set policy(value: InvitePolicy | null) {
        this._policy = value;
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
    private _policy: InvitePolicy | null = null

    constructor() {
        makeAutoObservable(this)
    }
}