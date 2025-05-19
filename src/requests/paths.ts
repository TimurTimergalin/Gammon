export const backgammonConfigUri = (id: number) => `/game/backgammon/config/${id}`
export const eventsUri = (id: number) => `/game-events/${id}`
export const backgammonFinishTurnUri = (id: number) => `/game/backgammon/move/${id}`
export const backgammonRollDiceUri = (id: number) => `/game/backgammon/zar/${id}`
export const backgammonOfferDoubleUri = (id: number) => `/game/backgammon/double/${id}`
export const backgammonAcceptDoubleUri = (id: number) => `/game/backgammon/double/accept/${id}`
export const backgammonConcedeUri = (id: number) => `/game/backgammon/surrender/${id}?`
export const backgammonHistoryUri = (id: number, gameId?: number) =>
    `/game/backgammon/history/${id}` + (gameId === undefined ? "" : ("?" + new URLSearchParams({gameId: String(gameId)})))
export const backgammonTimeoutUri = (id: number) => `/game/backgammon/timeout/${id}`
export const historyLengthUri = (id: number) => `/game/backgammon/${id}/count`
export const analysisUri = (id: number) => `/game/backgammon/analysis/${id}`
export const playUri = (id: number) => `/play/${id}`
export const connectUri = "/menu/connect"
export const gamesListUri = (id: number, pageNumber: number, pageSize: number) => "/menu/played-games?" + new URLSearchParams({
    userId: String(id),
    pageNumber: String(pageNumber),
    pageSize: String(pageSize)
})
export const disconnectUri = "/menu/disconnect"
export const signInUrl = "/player/login"
export const signUpUrl = "/player/create"
export const myUserInfoUri = "/player/me"
export const getUserInfoUri = (id: number) => `/player/userinfo?` + new URLSearchParams({userId: String(id)})
export const updateUserInfoUri = "/player/userinfo"
export const imageUri = (id: number) => `/player/image?` + new URLSearchParams({userId: String(id)})
export const usernamesUri = (ids: number[]) => "/player/usernames?" + new URLSearchParams({
    ids: ids.join(",")
})
export const uploadImgUri = "/player/image"
export const friendRequestsUri = "/player/friends/requests"
export const addFriendUri = `/player/friends/add`
export const removeFriendUri = "/player/friends/remove"
export const canAddFriendUri = (id: number) => `/player/friends/can-add-friend/${id}`
export const isFriendUri = (id: number) => `/player/friends/check?` + new URLSearchParams({secondUser: String(id)})
export const friendsListUri = (offset: number, limit: number) => "/player/friends?" + new URLSearchParams(
    {
        offset: String(offset),
        limit: String(limit)
    }
)

