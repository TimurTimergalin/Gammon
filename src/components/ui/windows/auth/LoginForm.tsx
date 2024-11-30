import {useCallback, useState} from "react";
import {NavigateFunction, useNavigate} from "react-router";
import {observer} from "mobx-react-lite";
import {useFormState} from "../forms/state/FormState.ts";
import {Form} from "../forms/Form.tsx";
import {FormInput} from "../forms/FormInput.tsx";
import {FormStateProvider} from "../forms/state/FormStateProvider.tsx";

const LoginFormBase = observer(function LoginFormBase() {
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
        const loginUrl = "/login"

        fetch(loginUrl, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(credentials),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(resp => {
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
        <Form onSubmit={onSubmit}>
            <p>Логин</p>
            <FormInput validityCheck={() => [true]} index={0} required={true} name={"name"}/>
            <p>Пароль</p>
            <FormInput validityCheck={() => [true]} index={0} required={true} type={"password"} name={"password"}/>
            <button onClick={() => formState.onSubmit(navigate)} type={"button"}>Войти</button>
            <p>{errorMessage}</p>
        </Form>
    )
})

export const LoginForm = () => <FormStateProvider><LoginFormBase /></FormStateProvider>