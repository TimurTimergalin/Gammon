import {myUserInfo, UserInfo} from "../requests/requests";
import {Outlet, ShouldRevalidateFunctionArgs} from "react-router";
import {type Route} from "./+types/auth_status"
import {useEffect, useRef} from "react";
import {AuthStatus} from "../controller/auth_status/AuthStatus";
import {AuthContextProvider} from "../controller/auth_status/context";

const module = "/layouts/auth_status.tsx"
const shouldRevalidatePostfix = "-shouldRevalidate"
const loaderDataPostfix = "-loaderData"


export async function clientLoader(): Promise<UserInfo | null> {
    // Это обход бага в react-router-е (https://github.com/remix-run/react-router/issues/12607)
    if (sessionStorage.getItem(module + shouldRevalidatePostfix) !== "true") {
        return JSON.parse(sessionStorage.getItem(module + loaderDataPostfix)!)
    }

    const res = await myUserInfo(fetch)
    sessionStorage.setItem(module + loaderDataPostfix, JSON.stringify(res))

    return res || null
    // return
}

function Provider({loaderData}: Route.ComponentProps) {
    const authStatus = useRef(new AuthStatus())

    useEffect(() => {
        authStatus.current.username = loaderData?.username || null
        authStatus.current.id = loaderData?.id || null
    }, [loaderData]);

    return <AuthContextProvider value={authStatus.current}><Outlet/></AuthContextProvider>
}

export function shouldRevalidate({formAction, defaultShouldRevalidate}: ShouldRevalidateFunctionArgs) {
    const res = formAction === "/sign-in" && defaultShouldRevalidate

    // Это обход бага в react-router-е (https://github.com/remix-run/react-router/issues/12607)
    sessionStorage.setItem(module + shouldRevalidatePostfix, String(res))

    return res
}

export default Provider
