export const backgammonConfigUri = (id: number) => `/game/backgammon/config/${id}`
export const eventsUri = (id: number) => `/game-events/${id}`
export const backgammonFinishTurnUri = (id: number) => `/game/backgammon/move/${id}`
export const backgammonRollDiceUri = (id: number) => `/game/backgammon/zar/${id}`
export const backgammonOfferDoubleUri = (id: number) => `/game/backgammon/double/${id}`
export const backgammonAcceptDoubleUri = (id: number) => `/game/backgammon/double/accept/${id}`
export const backgammonConcedeUri = (id: number) => `/game/backgammon/surrender/${id}?`
export const backgammonHistoryUri = (id: number) => `/game/backgammon/history/${id}`
export const playUri = (id: number) => `/play/${id}`
export const connectUri = "/menu/connect"
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