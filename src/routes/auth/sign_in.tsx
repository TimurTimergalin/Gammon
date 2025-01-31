import {useCallback, useState} from "react";
import {Link, NavigateFunction, useNavigate} from "react-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {authButtonStyle, authFormStyle} from "./_deps/styles";
import {useFormState} from "../../forms/FormState";
import {signIn, SignInCredentials} from "../../requests/requests";
import {Form} from "../../components/forms/Form";
import {required} from "../../forms/validators";
import {AccentedButton} from "../../components/AccentedButton";
import {FormStateProvider} from "../../forms/FormStateProvider";
import {formBaseStyle} from "../../css/forms";
import {AuthFormInput, AuthFormInputMessage} from "./_deps/common";
import {logger} from "../../logging/main";

const console = logger("windows/auth")

const PlainSignInForm = observer(function LoginFormBase({className}: {className?: string}) {
    const formState = useFormState()
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const onSubmit = useCallback((navigate: NavigateFunction) => {
        formState.enabled = false
        const data = formState.formData!
        const credentials = {
            login: data.get("login"),
            password: data.get("password")
        }

        console.assert(typeof credentials.login === "string" && credentials.login !== "")
        console.assert(typeof credentials.password === "string" && credentials.password !== "")

        signIn(credentials as SignInCredentials).then(resp => {
            if (!resp.ok) {
                return resp.text().then(t => `${resp.status}` + (t !== "" ? `: ${t}` : ""))
            }
            navigate("/")
        }).then(body => {
            if (body !== undefined) {
                throw new Error(body)
            }
        }).catch(error => {
            setErrorMessage(error.message)
            formState.enabled = true
        })
    }, [formState])

    return (
        <Form onSubmit={onSubmit} className={className}>
            <p>Логин</p>
            <AuthFormInput validityCheck={required} index={0} name={"login"}/>
            <AuthFormInputMessage index={0} />
            <p>Пароль</p>
            <AuthFormInput validityCheck={required} index={1} type={"password"} name={"password"}/>
            <AuthFormInputMessage index={1} />
            <AccentedButton onClick={() => formState.onSubmit(navigate)} disabled={false} style={authButtonStyle} type="button">Войти</AccentedButton>
            <p>{errorMessage}</p>
            <p style={{fontSize: 15, alignSelf: "center"}}>Нет аккаунта? <Link style={{color: "#ff7f2a"}} to={"/sign-up"}>Зарегистрируйтесь</Link></p>
        </Form>
    )
})

const SignInFormStyle = styled(PlainSignInForm)`
    ${authFormStyle}
    ${formBaseStyle}
`

export const SignInForm = () => <FormStateProvider><SignInFormStyle /></FormStateProvider>

export default SignInForm