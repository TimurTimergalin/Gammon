import {createContext, ReactNode, useContext} from "react";
import {AuthStatus} from "./AuthStatus";

export const authContext = createContext<AuthStatus | null>(null)

export function useAuthContext(): AuthStatus {
    return useContext(authContext)!
}

export const AuthContextProvider = ({value, children}: {value: AuthStatus, children?: ReactNode | ReactNode[]}) =>
    <authContext.Provider value={value}>{children}</authContext.Provider>
