import {
    configUri,
    connectUri,
    disconnectUri,
    eventsUri,
    finishTurnUri,
    myUserInfoUri,
    signInUrl,
    signUpUrl
} from "./paths";
import {FetchType} from "../common/requests";

export const getConfig = (fetch: FetchType, id: number) => fetch(configUri(id), {credentials: "include"})
export const subscribeForEvents = (id: number) => new EventSource(eventsUri(id), {withCredentials: true})

export async function finishTurn<RemoteMoveType>(fetch: FetchType, id: number, moves: RemoteMoveType[]) {
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

export const connect = (fetch: FetchType, gameType: string, points: number) =>
    fetch(connectUri, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
            type: gameType,
            points: points
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

export const disconnect = (fetch: FetchType) => fetch(disconnectUri, {
    credentials: "include",
    method: "POST",
    keepalive: true
})

export interface SignInCredentials {
    login: string,
    password: string
}

export const signIn = (fetch: FetchType, credentials: SignInCredentials) => fetch(signInUrl, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(credentials),
    headers: {
        "Content-Type": "application/json"
    }
})

export interface SignUpCredentials {
    username: string,
    login: string,
    password: string
}

export const signUp = (fetch: FetchType, credentials: SignUpCredentials) => fetch(signUpUrl, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
        "Content-Type": "application/json"
    }
})

export type UserInfo = {
    username: string,
    id: number
}

export async function myUserInfo(fetch: FetchType): Promise<UserInfo | undefined> {
    const resp = await fetch(myUserInfoUri, {
        credentials: "include"
    })

    if (!resp.ok) {
        return
    }

    const body = await resp.json()
    return body as UserInfo
}