import {
    backgammonAcceptDoubleUri,
    backgammonConcedeUri,
    backgammonConfigUri,
    backgammonFinishTurnUri, backgammonHistoryUri,
    backgammonOfferDoubleUri,
    backgammonRollDiceUri,
    connectUri,
    disconnectUri,
    eventsUri,
    myUserInfoUri,
    signInUrl,
    signUpUrl, uploadImgUri, getUserInfoUri,
    usernamesUri, updateUserInfoUri
} from "./paths";
import {FetchType} from "../common/requests";

export const getBackgammonConfig = (fetch: FetchType, id: number) => fetch(backgammonConfigUri(id), {credentials: "include"})
export const subscribeForEvents = (id: number) => new EventSource(eventsUri(id), {withCredentials: true})

export async function backgammonFinishTurn<RemoteMoveType>(fetch: FetchType, id: number, moves: RemoteMoveType[]) {
    return await fetch(
        backgammonFinishTurnUri(id),
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

export async function backgammonRollDice(fetch: FetchType, id: number) {
    return await fetch(
        backgammonRollDiceUri(id),
        {
            credentials: "include",
            method: "post"
        }
    )
}

export async function backgammonOfferDouble(fetch: FetchType, id: number) {
    return await fetch(
        backgammonOfferDoubleUri(id),
        {
            credentials: "include",
            method: "post"
        }
    )
}

export async function backgammonAcceptDouble(fetch: FetchType, id: number) {
    return await fetch(
        backgammonAcceptDoubleUri(id),
        {
            credentials: "include",
            method: "post"
        }
    )
}

export function backgammonConcedeMatch(fetch: FetchType, id: number) {
    return fetch(backgammonConcedeUri(id), {
        credentials: "include",
        method: "post",
        body: "true",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function backgammonConcedeGame(fetch: FetchType, id: number) {
    return fetch(backgammonConcedeUri(id), {
        credentials: "include",
        method: "post",
        body: "false",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// TODO - эта ручка должна быть не только для backgammon-а
export function backgammonHistory(fetch: FetchType, id: number) {
    return fetch(backgammonHistoryUri(id), {
        credentials: "include"
    })
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

export type InvitePolicy = "ALL" | "FRIENDS_ONLY"

export type UserInfo = {
    username: string,
    login: string,
    invitePolicy: InvitePolicy,
    id: number
}

export function myUserInfo(fetch: FetchType) {
    return fetch(myUserInfoUri, {
        credentials: "include"
    })
}

export function userInfo(fetch: FetchType, id: number) {
    return fetch(getUserInfoUri(id))
}

export type UpdateUserInfoRequest = {
    username: string,
    login: string,
    invitePolicy: InvitePolicy
}

export function updateUserInfo(fetch: FetchType, props: UpdateUserInfoRequest) {
    return fetch(updateUserInfoUri, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(props),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function usernames(fetch: FetchType, ids: number[]) {
    return fetch(usernamesUri(ids))
}

export function uploadImage(fetch: FetchType, data: Blob, filename: string) {
    const formData = new FormData()
    formData.append("file", data, filename)
    return fetch(uploadImgUri, {credentials: "include", body: formData, method: "POST"})
}
