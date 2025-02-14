// import {myUserInfo, UserInfo} from "../requests/requests";
// import {Outlet, ShouldRevalidateFunctionArgs} from "react-router";
// import {type Route} from "./+types/auth_status"
// import {useEffect, useRef} from "react";
// import {AuthStatus} from "../controller/auth_status/AuthStatus";
// import {AuthContextProvider} from "../controller/auth_status/context";
//
// export async function clientLoader(): Promise<UserInfo | undefined> {
//     return await myUserInfo(fetch)
// }
//
// function Provider({loaderData}: Route.ComponentProps) {
//     const authStatus = useRef(new AuthStatus())
//
//     useEffect(() => {
//         authStatus.current.username = loaderData?.username || null
//         authStatus.current.id = loaderData?.id || null
//     }, [loaderData]);
//
//     return <AuthContextProvider value={authStatus.current}><Outlet/></AuthContextProvider>
// }
//
// export function shouldRevalidate({formAction}: ShouldRevalidateFunctionArgs) {
//     return formAction === "login"
// }
//
// export default Provider

import {Outlet} from "react-router";

export default function Component() {
    return <Outlet/>
}