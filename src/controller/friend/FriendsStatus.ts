import {makeAutoObservable} from "mobx";

export class FriendsStatus {
    readonly friends: {id: number, username: string, rating: { backgammonBlitz: number; backgammonDefault: number; nardeBlitz: number; nardeDefault: number }}[] = []
    readonly friendRequests: {id: number, username: string}[] = []

    constructor() {
        makeAutoObservable(this)
    }
}