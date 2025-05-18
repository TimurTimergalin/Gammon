import {makeAutoObservable} from "mobx";

export class FriendsStatus {
    readonly friends: {id: number, username: string, login: string}[] = []
    readonly friendRequests: {id: number, username: string}[] = []

    constructor() {
        makeAutoObservable(this)
    }
}