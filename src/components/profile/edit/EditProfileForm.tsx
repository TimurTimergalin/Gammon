import {observer} from "mobx-react-lite";
import {useFetcher} from "react-router";
import {useAuthContext} from "../../../controller/auth_status/context";
import {FormStateProvider} from "../../../controller/forms/FormStateProvider";
import {FormWithValidation} from "../../forms/FormWithValidation";
import {AuthFormInput, AuthFormInputMessage} from "../../../routes/auth/_deps/common";
import {required} from "../../../controller/forms/validators";
import styled from "styled-components";
import {formBaseStyle} from "../../../css/forms";

const PlainEditProfileForm = observer(({className}: { className?: string }) => {
    const fetcher = useFetcher()
    const authStatus = useAuthContext()
    return (
        <FormStateProvider>
            <FormWithValidation fetcher={fetcher} className={className}>
                <p>Отображаемое имя</p>
                <AuthFormInput validityCheck={required} index={0} name={"username"}
                               value={authStatus.username!}/>
                <AuthFormInputMessage index={0}/>
                <p>Логин</p>
                <AuthFormInput validityCheck={required} index={1} name={"login"} value={authStatus.login!}/>
                <AuthFormInputMessage index={1}/>
            </FormWithValidation>
        </FormStateProvider>
    )
})
export const EditProfileForm = styled(PlainEditProfileForm)`
    & {
        ${formBaseStyle};
        padding: 20px;
    }

    & > input {
        width: calc(100% - 5px);
        padding-left: 5px;
    }
`