import {myUserInfo, UserInfo} from "../requests/requests";
import {Outlet, ShouldRevalidateFunctionArgs} from "react-router";
import {type Route} from "./+types/auth_status"
import {useEffect, useRef, useState} from "react";
import {AuthStatus} from "../controller/auth_status/AuthStatus";
import {AuthContextProvider} from "../controller/auth_status/context";


// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader(): Promise<UserInfo | null> {
    // Это обход бага в react-router-е (https://github.com/remix-run/react-router/issues/12607)


    try {
        const resp = await myUserInfo(fetch)
        if (!resp.ok) {
            return null
        }

        try {
            const res = await resp.json()
            return res || null
        } catch (e) {
            console.error(e)
            return null
        }
    } catch {
        return null
    }

}

function Provider({loaderData}: Route.ComponentProps) {
    const authStatus = useRef(new AuthStatus())
    const [init, setInit] = useState(false)

    useEffect(() => {
        authStatus.current.username = loaderData?.username || null
        authStatus.current.id = loaderData?.id || null
        authStatus.current.login = loaderData?.login || null
        authStatus.current.invitePolicy = loaderData?.invitePolicy || null
        authStatus.current.rating = loaderData?.rating || null
        setInit(true)
    }, [loaderData]);

    if (!init) {
        return <></>
    }

    return <AuthContextProvider value={authStatus.current}><Outlet/></AuthContextProvider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function shouldRevalidate({currentUrl, defaultShouldRevalidate}: ShouldRevalidateFunctionArgs) {
    return currentUrl.pathname === "/sign-in" && defaultShouldRevalidate
}

export default Provider
