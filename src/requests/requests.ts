import {
    addFriendUri,
    analysisUri, answerChallengeUri,
    backgammonAcceptDoubleUri,
    backgammonConcedeUri,
    backgammonConfigUri,
    backgammonFinishTurnUri,
    backgammonHistoryUri,
    backgammonOfferDoubleUri,
    backgammonRollDiceUri,
    backgammonTimeoutUri, canAddFriendUri, cancelChallengeUri, challengeUri,
    connectUri,
    disconnectUri,
    eventsUri,
    friendRequestsUri, friendsListUri, gamesListUri,
    getUserInfoUri,
    historyLengthUri, isFriendUri,
    myUserInfoUri,
    removeFriendUri,
    signInUrl,
    signUpUrl,
    updateUserInfoUri,
    uploadImgUri,
    usernamesUri
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

export function backgammonHistory(fetch: FetchType, matchId: number, gameId?: number) {
    const uri = backgammonHistoryUri(matchId, gameId)
    console.log(uri)
    return fetch(uri, {
        credentials: "include"
    })
}

export function backgammonSignalTimeout(fetch: FetchType, matchId: number) {
    return fetch(
        backgammonTimeoutUri(matchId),
        {
            credentials: "include",
            method: "POST"
        }
    )
}

export const connect = (fetch: FetchType, gameType: string, points: number, blitz: boolean) =>
    fetch(connectUri, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
            type: gameType,
            points: points,
            timePolicy: blitz ? "BLITZ" : "DEFAULT_TIMER"
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
    id: number,
    rating: {
        backgammonBlitz: number;
        backgammonDefault: number;
        nardeBlitz: number;
        nardeDefault: number
    }
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

export function getHistoryLength(fetch: FetchType, matchId: number) {
    return fetch(historyLengthUri(matchId), {credentials: "include"})
}

export function getAnalysis(fetch: FetchType, matchId: number) {
    return fetch(analysisUri(matchId), {credentials: "include"})
}

export function getFriendRequest(fetch: FetchType) {
    return fetch(friendRequestsUri, {
        credentials: "include"
    })
}

export function addFriendById(fetch: FetchType, userId: number) {
    return fetch(addFriendUri, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
            type: "BY_ID",
            friendId: userId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function addFriendByLogin(fetch: FetchType, login: string) {
    return fetch(addFriendUri, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
            type: "BY_LOGIN",
            friendLogin: login
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function removeFriend(fetch: FetchType, userId: number) {
    return fetch(removeFriendUri, {
        credentials: "include",
        method: "DELETE",
        body: JSON.stringify({
            type: "BY_ID",
            friendId: userId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function canAddFriend(fetch: FetchType, userId: number) {
    return fetch(canAddFriendUri(userId), {
        credentials: "include"
    })
}

export function isFriend(fetch: FetchType, userId: number) {
    return fetch(isFriendUri(userId), {
        credentials: "include"
    })
}

export function getFriendsList(fetch: FetchType, offset: number, limit: number) {
    return fetch(friendsListUri(offset, limit), {
        credentials: "include"
    })
}

export function getGamesList(fetch: FetchType, userId: number, pageNumber: number, pageSize: number) {
    return fetch(gamesListUri(userId, pageNumber, pageSize), {
        credentials: "include"
    })
}
export function sendChallenge(fetch: FetchType, userId: number, gameType: string, points: number, blitz: boolean) {
    return fetch(challengeUri(userId), {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
            type: gameType,
            points: points,
            timePolicy: blitz ? "BLITZ" : "DEFAULT_TIMER"
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function cancelChallenge(fetch: FetchType, userId: number) {
    return fetch(cancelChallengeUri(userId), {
        credentials: "include",
        method: "POST"
    })
}

export function answerChallenge(fetch: FetchType, userId: number, accept: boolean) {
    return fetch(answerChallengeUri(userId, accept), {
        credentials: "include",
        method: "post"
    })
}


