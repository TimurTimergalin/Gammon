import {ProfilePage} from "../components/profile/ProfilePage";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {ProfileStatus} from "../controller/profile/ProfileStatus";
import type {Route} from "./+types/profile"
import {userInfo, UserInfo} from "../requests/requests";
import {observer} from "mobx-react-lite";
import {useAuthContext} from "../controller/auth_status/context";
import {ProfileStatusContext} from "../controller/profile/context";

export async function clientLoader({params}: Route.ClientLoaderArgs): Promise<UserInfo | null | "Unknown user"> {
    console.log("profile loader")

    const userId = params.userId
    const intUserId = parseInt(userId || "")

    if (isNaN(intUserId)) {
        return null
    }

    try {
        const res = await userInfo(fetch, intUserId)
        if (!res.ok) {
            return "Unknown user"
        }
        return await res.json()
    } catch {
        return "Unknown user"
    }
}

const Page = observer(function Page({loaderData}: Route.ComponentProps) {
    const [profileStatus, setProfileState] = useState<ProfileStatus | null>(null)
    const authStatus = useAuthContext()
    const navigate = useNavigate()
    const [unknown, setUnknown] = useState(false)
    console.log(loaderData)
    console.log(authStatus.id)

    useEffect(() => {
        setTimeout(() => {
            if (loaderData === null && authStatus.id === null) {
                navigate("/sign-in")
            }
            if (loaderData === "Unknown user") {
                setUnknown(true)
                return
            }

            if (loaderData === null) {
                if (profileStatus === null) {
                    setProfileState(new ProfileStatus({
                        id: authStatus.id!,
                        username: authStatus.username!,
                        login: authStatus.login!,
                        policy: authStatus.policy!
                    }))
                } else {
                    profileStatus.id = authStatus.id!
                    profileStatus.username = authStatus.username!
                    profileStatus.login = authStatus.login!
                    profileStatus.policy = authStatus.policy!
                }
            } else {
                if (profileStatus === null) {
                    setProfileState(new ProfileStatus(loaderData))
                } else {
                    profileStatus.id = loaderData.id
                    profileStatus.username = loaderData.username
                    profileStatus.login = loaderData.login
                    profileStatus.policy = loaderData.policy
                }
            }
        })
    }, [authStatus, loaderData, navigate, profileStatus]);

    if (unknown) {
        return "Неизвестный пользователь"
    }

    if (profileStatus === null) {
        return <></>
    }

    return (
        <ProfileStatusContext.Provider value={profileStatus}>
            <ProfilePage/>
        </ProfileStatusContext.Provider>
    )
})

export default Page
