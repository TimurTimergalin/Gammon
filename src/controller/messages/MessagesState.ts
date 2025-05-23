import {ReactNode} from "react";
import {makeAutoObservable} from "mobx";

export class MessagesState {
    get messages(): [number, ReactNode][] {
        return this._messages;
    }
    private _messages: [number, ReactNode][] = []
    private counter = 0

    constructor() {
        makeAutoObservable(this)
    }

    insert(node: ReactNode) {
        this._messages.push([this.counter++, node])
    }

    remove(id: number) {
        const index = this._messages.findIndex(([id_])=> id_ === id)
        if (index >= 0) {
            this._messages.splice(index, 1)
        } else {
            throw new Error(`No message with id ${id}`)
        }
    }
}