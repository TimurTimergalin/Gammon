import {Link, redirect, useFetcher} from "react-router";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {authButtonStyle, authFormStyle} from "./_deps/styles";
import {signIn, SignInCredentials} from "../../requests/requests";
import {FormWithValidation} from "../../components/forms/FormWithValidation";
import {required} from "../../controller/forms/validators";
import {AccentedButton} from "../../components/AccentedButton";
import {FormStateProvider} from "../../controller/forms/FormStateProvider";
import {formBaseStyle} from "../../css/forms";
import {AuthFormInput, AuthFormInputMessage} from "./_deps/common";
import {logger} from "../../logging/main";
import {type Route} from "./+types/sign_in"
import {FetchType} from "../../common/requests";

const console = logger("windows/auth_status")

export async function clientAction({request}: Route.ClientActionArgs) {
    console.debug("ACTION!")
    const data = await request.formData()

    const credentials = {
        login: data.get("login"),
        password: data.get("password")
    }

    console.assert(typeof credentials.login === "string" && credentials.login !== "")
    console.assert(typeof credentials.password === "string" && credentials.password !== "")

    const cancellableFetch: FetchType = (input, init) =>
        fetch(input, {signal: request.signal, ...init})

    const resp = await signIn(cancellableFetch, credentials as SignInCredentials)
    if (!resp.ok) {
        return {error: `Код ошибки: ${resp.status}`}
    }

    return redirect("/")
}

const PlainSignInForm = observer(function LoginFormBase({className}: { className?: string } & Route.ComponentProps) {
    const fetcher = useFetcher()
    return (
        <FormWithValidation className={className} method={"post"} fetcher={fetcher}>
            <p>Логин</p>
            <AuthFormInput validityCheck={required} index={0} name={"login"}/>
            <AuthFormInputMessage index={0}/>
            <p>Пароль</p>
            <AuthFormInput validityCheck={required} index={1} type={"password"} name={"password"}/>
            <AuthFormInputMessage index={1}/>
            <AccentedButton disabled={false} style={authButtonStyle} type="submit">Войти</AccentedButton>
            <p>{fetcher.data?.error || ""}</p>
            <p style={{fontSize: 15, alignSelf: "center"}}>Нет аккаунта? <Link style={{color: "#ff7f2a"}}
                                                                               to={"/sign-up"}>Зарегистрируйтесь</Link>
            </p>
        </FormWithValidation>
    )
})

const SignInFormStyle = styled(PlainSignInForm)`
    ${authFormStyle}
    ${formBaseStyle}
`

export const SignInForm = (props: Route.ComponentProps) => <FormStateProvider><SignInFormStyle {...props}/></FormStateProvider>

export default SignInForm