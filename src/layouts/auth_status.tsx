import {myUserInfo, UserInfo} from "../requests/requests";
import {Outlet, ShouldRevalidateFunctionArgs} from "react-router";
import {type Route} from "./+types/auth_status"
import {useEffect, useRef} from "react";
import {AuthStatus} from "../controller/auth_status/AuthStatus";
import {AuthContextProvider} from "../controller/auth_status/context";

const module = "/layouts/auth_status.tsx"
const shouldRevalidatePostfix = "-shouldRevalidate"
const loaderDataPostfix = "-loaderData"


// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader(): Promise<UserInfo | null> {
    // Это обход бага в react-router-е (https://github.com/remix-run/react-router/issues/12607)
    console.log("Auth loader")
    if (sessionStorage.getItem(module + shouldRevalidatePostfix) !== "true") {
        return JSON.parse(sessionStorage.getItem(module + loaderDataPostfix)!)
    }


    try {
        const resp = await myUserInfo(fetch)
        if (!resp.ok) {
            return null
        }

        try {
            const res = await resp.json()
            sessionStorage.setItem(module + loaderDataPostfix, JSON.stringify(res))

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

    useEffect(() => {
        authStatus.current.username = loaderData?.username || null
        authStatus.current.id = loaderData?.id || null
        authStatus.current.login = loaderData?.login || null
        authStatus.current.policy = loaderData?.policy || null
    }, [loaderData]);

    return <AuthContextProvider value={authStatus.current}><Outlet/></AuthContextProvider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function shouldRevalidate({currentUrl, defaultShouldRevalidate}: ShouldRevalidateFunctionArgs) {
    const res = currentUrl.pathname === "/sign-in" && defaultShouldRevalidate

    // Это обход бага в react-router-е (https://github.com/remix-run/react-router/issues/12607)
    sessionStorage.setItem(module + shouldRevalidatePostfix, String(res))

    return res
}

export default Provider
