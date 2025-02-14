export const configUri = (id: number) => `/game/backgammon/config/${id}`
export const eventsUri = (id: number) => `/game-events/${id}`
export const finishTurnUri = (id: number) => `/game/backgammon/move/${id}`
export const playUri = (id: number) => `/play/${id}`
export const connectUri = "/menu/connect"
export const disconnectUri = "/menu/disconnect"
export const signInUrl = "/player/login"
export const signUpUrl = "/player/create-user"
export const myUserInfoUri = "/player/me"
export const imageUri = (id: number) => `/player/image?` + new URLSearchParams({userId: String(id)})