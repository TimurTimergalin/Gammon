import {makeAutoObservable} from "mobx";

export class AuthStatus {
    username: string | null = null
    id: number | null = null

    constructor() {
        makeAutoObservable(this)
    }
}