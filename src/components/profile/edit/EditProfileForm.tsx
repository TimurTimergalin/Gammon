import {observer} from "mobx-react-lite";
import {useFetcher, useNavigate} from "react-router";
import {useAuthContext} from "../../../controller/auth_status/context";
import {FormWithValidation} from "../../forms/FormWithValidation";
import {AuthFormInput, AuthFormInputMessage} from "../../../routes/auth/_deps/common";
import {required} from "../../../controller/forms/validators";
import styled from "styled-components";
import {formBaseStyle} from "../../../css/forms";
import {SwitchSelect} from "../../play_menu/control_panel/SwitchSelect";
import {useRef, useState} from "react";
import {InvitePolicy} from "../../../requests/requests";
import {AccentedButton} from "../../AccentedButton";
import {GreyButton} from "./common";
import {useFormState} from "../../../controller/forms/FormState";

const PlainEditProfileForm = observer(({className}: { className?: string }) => {
    const fetcher = useFetcher()
    const authStatus = useAuthContext()
    const policyInputRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()
    const formState = useFormState()
    const [forcesEnabled, setForcedEnabled] = useState(false)

    const switchSelectCallback = (i: number) => {
        if (policyInputRef.current === null) {
            return
        }

        setForcedEnabled(true)
        policyInputRef.current.value = (i === 0 ? "ALL" : "FRIENDS_ONLY") satisfies InvitePolicy
    }

    let disabled = !forcesEnabled
    if (disabled) {
        for (const e of formState.touched) {
            if (e[1]) {
                disabled = false
                break
            }
        }
    }

    console.log(disabled)

    return (
        <FormWithValidation fetcher={fetcher} className={className} method={"post"}>
            <p>Отображаемое имя</p>
            <AuthFormInput validityCheck={required} index={0} name={"username"}
                           defaultValue={authStatus.username!}/>
            <AuthFormInputMessage index={0}/>
            <p>Логин</p>
            <AuthFormInput validityCheck={required} index={1} name={"login"} defaultValue={authStatus.login!}/>
            <AuthFormInputMessage index={1}/>
            <p>Кому разрешать вызывать вас на поединок</p>
            <SwitchSelect options={["Всем", "Только друзьям"]} callback={switchSelectCallback}
                          initChosen={authStatus.invitePolicy === "ALL" ? 0 : 1}/>
            <input name={"invitePolicy"} defaultValue={authStatus.invitePolicy!} style={{display: "none"}} ref={policyInputRef}/>
            <p>{fetcher.data?.error || ""}</p>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                <GreyButton type={"button"} onClick={() => navigate("/profile")}>Назад</GreyButton>
                <AccentedButton disabled={disabled}>Изменить</AccentedButton>
            </div>
        </FormWithValidation>
    )
})
export const EditProfileForm = styled(PlainEditProfileForm)`
    & {
        ${formBaseStyle};
        padding: 20px;
        display: flex;
        flex-direction: column;
    }

    & > ${AuthFormInput} {
        width: calc(100% - 5px);
        padding-left: 5px;
    }
    
    & > p {
        margin-top: 10px;
    }
    
    & button {
        margin-top: 10px;
        align-self: center;
        font-size: 20px;
        border-radius: 5px;
        width: 110px;
    }
`