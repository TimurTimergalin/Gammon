import {observer} from "mobx-react-lite";
import {useFormState} from "../../controller/forms/FormState";
import {Link, NavigateFunction, useNavigate} from "react-router";
import {useCallback, useState} from "react";
import {signUp, SignUpCredentials} from "../../requests/requests";
import {Form} from "../../components/forms/Form";
import {AuthFormInput, AuthFormInputMessage} from "./_deps/common";
import {ComplexValidator, required} from "../../controller/forms/validators";
import {AccentedButton} from "../../components/AccentedButton";
import {authButtonStyle, authFormStyle} from "./_deps/styles";
import styled from "styled-components";
import {formBaseStyle} from "../../css/forms";
import {FormStateProvider} from "../../controller/forms/FormStateProvider";
import {logger} from "../../logging/main";
import {useFetch} from "../../common/hooks";

const console = logger("windows/auth")

const passwordRepeat: ComplexValidator = (formData) => {
    const first = formData.get("password")
    const second = formData.get("repeat")

    console.assert(typeof first === "string")
    console.assert(typeof second === "string")

    if (first === second) {
        return {success: true}
    }

    return {success: false, message: "Пароли не совпадают"}
}

const PlainSignUpForm = observer(function SignUpForm({className}: { className?: string }) {
    const formState = useFormState()
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [fetch] = useFetch()

    const onSubmit = useCallback((navigate: NavigateFunction) => {
        formState.enabled = false
        const data = formState.formData!
        const credentials = {
            username: data.get("username"),
            login: data.get("login"),
            password: data.get("password")
        }

        console.assert(typeof credentials.login === "string" && credentials.login !== "")
        console.assert(typeof credentials.username === "string" && credentials.username !== "")
        console.assert(typeof credentials.password === "string" && credentials.password !== "")

        signUp(fetch, credentials as SignUpCredentials).then(resp => {
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
    }, [fetch, formState])

    return (
        <Form onSubmit={onSubmit} className={className}>
            <p>Логин</p>
            <AuthFormInput validityCheck={required} index={0} name={"login"}/>
            <AuthFormInputMessage index={0}/>
            <p>Отображаемое имя</p>
            <AuthFormInput validityCheck={required} index={1} name={"username"}/>
            <AuthFormInputMessage index={1}/>
            <p>Пароль</p>
            <AuthFormInput validityCheck={required} index={2} name={"password"} type={"password"}/>
            <AuthFormInputMessage index={2}/>
            <p>Повторите пароль</p>
            <AuthFormInput validityCheck={required} complexValidityCheck={passwordRepeat} index={3} name={"repeat"} type={"password"}/>
            <AuthFormInputMessage index={3}/>
            <AccentedButton onClick={() => formState.onSubmit(navigate)} style={authButtonStyle} type="button">Зарегистрироваться</AccentedButton>
            <p>{errorMessage}</p>
            <p style={{fontSize: 15, alignSelf: "center"}}>Есть аккаунт? <Link style={{color: "#ff7f2a"}}
                                                                               to={"/sign-in"}>Войдите</Link></p>
        </Form>
    )
})

const SignUpFormStyle = styled(PlainSignUpForm)`
    ${authFormStyle}
    ${formBaseStyle}
`

export const SignUpForm = () => <FormStateProvider><SignUpFormStyle /></FormStateProvider>
export default SignUpForm