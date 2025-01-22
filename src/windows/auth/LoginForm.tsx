import {useCallback, useState} from "react";
import {NavigateFunction, useNavigate} from "react-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {FormInput} from "../../components/forms/FormInput.tsx";
import {buttonStyle, formStyle, inputStyle} from "./common.ts";
import {useFormState} from "../../forms/FormState.ts";
import {Credentials, login} from "../../requests/requests.ts";
import {Form} from "../../components/forms/Form.tsx";
import {required} from "../../components/forms/validators.ts";
import {AccentedButton} from "../../components/AccentedButton.tsx";
import {FormStateProvider} from "../../forms/FormStateProvider.tsx";


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