import {observer} from "mobx-react-lite";
import {Link, redirect, useFetcher} from "react-router";
import {signUp, SignUpCredentials} from "../../requests/requests";
import {FormWithValidation} from "../../components/forms/FormWithValidation";
import {AuthFormInput, AuthFormInputMessage} from "./_deps/common";
import {composition, required, SimpleValidator} from "../../controller/forms/validators";
import {AccentedButton} from "../../components/AccentedButton";
import {authButtonStyle, authFormStyle} from "./_deps/styles";
import styled from "styled-components";
import {formBaseStyle} from "../../css/forms";
import {FormStateProvider} from "../../controller/forms/FormStateProvider";
import {type Route} from "./+types/sign_up"
import {FetchType} from "../../common/requests";
import {RefObject, useRef} from "react";


// eslint-disable-next-line react-refresh/only-export-components
export async function clientAction({request}: Route.ClientActionArgs) {
    const data = await request.formData()

    const credentials = {
        username: data.get("username"),
        login: data.get("login"),
        password: data.get("password")
    }

    console.assert(typeof credentials.login === "string" && credentials.login !== "")
    console.assert(typeof credentials.username === "string" && credentials.username !== "")
    console.assert(typeof credentials.password === "string" && credentials.password !== "")

    const cancellableFetch: FetchType = (input, init) =>
        fetch(input, {signal: request.signal, ...init})

    const resp = await signUp(cancellableFetch, credentials as SignUpCredentials)
    if (!resp.ok) {
        return {error: `Код ошибки: ${resp.status}`}
    }

    return redirect("/sign-in")
}

const passwordRepeat = (passwordFieldVal: RefObject<string>): SimpleValidator => (val: string) => {
    const first = passwordFieldVal.current
    const second = val

    console.assert(typeof first === "string")

    if (first === second) {
        return {success: true}
    }

    return {success: false, message: "Пароли не совпадают"}
}

const PlainSignUpForm = observer(function SignUpForm({className}: { className?: string } & Route.ComponentProps) {
    const fetcher = useFetcher()
    const passwordRef = useRef<string>("")

    return (
        <FormWithValidation className={className} method={"post"} fetcher={fetcher} action={"/sign-up"}>
            <p>Логин</p>
            <AuthFormInput validityCheck={required} index={0} name={"login"}/>
            <AuthFormInputMessage index={0}/>
            <p>Отображаемое имя</p>
            <AuthFormInput validityCheck={required} index={1} name={"username"}/>
            <AuthFormInputMessage index={1}/>
            <p>Пароль</p>
            <AuthFormInput validityCheck={required} index={2} name={"password"} type={"password"} valueRef={passwordRef}/>
            <AuthFormInputMessage index={2}/>
            <p>Повторите пароль</p>
            <AuthFormInput validityCheck={composition(required, passwordRepeat(passwordRef))} index={3} name={"repeat"}
                           type={"password"}/>
            <AuthFormInputMessage index={3}/>
            <AccentedButton style={authButtonStyle} type="submit">Зарегистрироваться</AccentedButton>
            <p>{fetcher.data?.error || ""}</p>
            <p style={{fontSize: 15, alignSelf: "center"}}>Есть аккаунт? <Link style={{color: "#ff7f2a"}}
                                                                               to={"/sign-in"}>Войдите</Link></p>
        </FormWithValidation>
    )
})

const SignUpFormStyle = styled(PlainSignUpForm)`
    ${authFormStyle}
    ${formBaseStyle}
`

export const SignUpForm = (props: Route.ComponentProps) => <FormStateProvider><SignUpFormStyle {...props}/></FormStateProvider>
export default SignUpForm