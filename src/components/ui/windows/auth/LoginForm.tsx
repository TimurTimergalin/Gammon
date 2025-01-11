import {useCallback, useState} from "react";
import {NavigateFunction, useNavigate} from "react-router";
import {observer} from "mobx-react-lite";
import {useFormState} from "../forms/state/FormState.ts";
import {Form} from "../forms/Form.tsx";
import {FormInput} from "../forms/FormInput.tsx";
import {FormStateProvider} from "../forms/state/FormStateProvider.tsx";
import styled from "styled-components";
import {AccentedButton} from "../../../common/AccentedButton.tsx";
import {required} from "../forms/validators.ts";
import {buttonStyle, formStyle, inputStyle} from "./common.ts";
import {Credentials, login} from "../../../../requests/requests.ts";

const LoginFormInput = styled(FormInput)`
    ${() => inputStyle}
`

const LoginFormBase = observer(function LoginFormBase({className}: {className?: string}) {
    const formState = useFormState()
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const onSubmit = useCallback((navigate: NavigateFunction) => {
        formState.enabled = false
        const data = formState.formData!
        const credentials = {
            username: data.get("name"),
            password: data.get("password")
        }

        console.assert(typeof credentials.username === "string")
        console.assert(typeof credentials.password === "string")

        login(credentials as Credentials).then(resp => {
            if (!resp.ok) {
                throw new Error(resp.status + "")
            }
            navigate("/")
        }).catch(error => {
            setErrorMessage(error.message)
            formState.enabled = true
        })
    }, [formState])

    return (
        <Form onSubmit={onSubmit} className={className}>
            <p>Логин</p>
            <LoginFormInput validityCheck={required} index={0} name={"name"}/>
            <p>Пароль</p>
            <LoginFormInput validityCheck={required} index={1} type={"password"} name={"password"}/>
            <AccentedButton onClick={() => formState.onSubmit(navigate)} disabled={false} style={buttonStyle}>Войти</AccentedButton>
            <p>{errorMessage}</p>
        </Form>
    )
})

const LoginFormStyle = styled(LoginFormBase)`
    ${() => formStyle}
`

export const LoginForm = () => <FormStateProvider><LoginFormStyle /></FormStateProvider>