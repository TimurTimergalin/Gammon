import {EditProfilePage} from "../components/profile/edit/EditProfilePage";
import type {Route} from"./+types/edit_profile"
import {FetchType} from "../common/requests";
import {updateUserInfo, UpdateUserInfoRequest} from "../requests/requests";
import {redirect} from "react-router";


// eslint-disable-next-line react-refresh/only-export-components
export async function clientAction({request}: Route.ClientActionArgs) {
    const data = await request.formData()

    const body = {
        username: data.get("username"),
        login: data.get("login"),
        invitePolicy: data.get("invitePolicy")
    } as UpdateUserInfoRequest

    console.log(body)

    const cancellableFetch: FetchType = (input, init) =>
        fetch(input, {signal: request.signal, ...init})

    const resp = await updateUserInfo(cancellableFetch, body)
    if (!resp.ok) {
        return {error: `Код ошибки: ${resp.status}`}
    }
    return redirect("/profile")
}

export default EditProfilePage