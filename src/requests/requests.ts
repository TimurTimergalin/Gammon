import {configUri, connectUri, eventsUri, finishTurnUri, loginUrl} from "./paths.ts";

export const getConfig = (id: number) => fetch(configUri(id), {credentials: "include"})
export const subscribeForEvents = (id: number) => new EventSource(eventsUri(id), {withCredentials: true})

export async function finishTurn<RemoteMoveType>(id: number, moves: RemoteMoveType[]) {
    return await fetch(
        finishTurnUri(id),
        {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                moves: moves
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
}

export const connect = (gameType: string) => fetch(connectUri, {
    credentials: "include",
    method: "POST",
    body: JSON.stringify({
        type: gameType
    }),
    headers: {
        "Content-Type": "application/json"
    }
})

export interface Credentials {
    username: string,
    password: string
}

export const login = (credentials: Credentials) => fetch(loginUrl, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(credentials),
    headers: {
        "Content-Type": "application/json"
    }
})