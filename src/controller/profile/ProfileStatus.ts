import {InvitePolicy} from "../../requests/requests";
import {makeAutoObservable} from "mobx";

export class ProfileStatus {
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


    constructor({id, username, login, invitePolicy}: { id: number, username: string, login: string, invitePolicy: InvitePolicy }) {
        this._id = id;
        this._username = username;
        this._login = login;
        this._invitePolicy = invitePolicy;
        makeAutoObservable(this)
    }
}