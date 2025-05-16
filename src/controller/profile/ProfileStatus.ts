import {InvitePolicy} from "../../requests/requests";
import {makeAutoObservable} from "mobx";

export class ProfileStatus {
    get rating(): { backgammonBlitz: number; backgammonDefault: number; nardeBlitz: number; nardeDefault: number } {
        return this._rating;
    }

    set rating(value: {
        backgammonBlitz: number;
        backgammonDefault: number;
        nardeBlitz: number;
        nardeDefault: number
    }) {
        this._rating = value;
    }

    get invitePolicy(): InvitePolicy {
        return this._invitePolicy;
    }

    set invitePolicy(value: InvitePolicy) {
        this._invitePolicy = value;
    }

    get login(): string {
        return this._login;
    }

    set login(value: string) {
        this._login = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    private _id: number
    private _username: string
    private _login: string
    private _invitePolicy: InvitePolicy
    private _rating: {
        backgammonBlitz: number;
        backgammonDefault: number;
        nardeBlitz: number;
        nardeDefault: number
    }


    constructor({id, username, login, invitePolicy, rating}: {
        id: number, username: string, login: string, invitePolicy: InvitePolicy, rating: {
            backgammonBlitz: number;
            backgammonDefault: number;
            nardeBlitz: number;
            nardeDefault: number
        }
    }) {
        this._id = id;
        this._username = username;
        this._login = login;
        this._invitePolicy = invitePolicy;
        this._rating = rating;
        makeAutoObservable(this)
    }
}