import {observer} from "mobx-react-lite";
import {useAuthContext} from "../../controller/auth_status/context";
import {imgCacheContext} from "../game/img_cache/context";
import {CSSProperties, useContext, useEffect} from "react";
import {useFetcher, useNavigate} from "react-router";
import {imageUri} from "../../requests/paths";
import {ImgCache} from "../game/img_cache/ImgCache";
import styled from "styled-components";
import {AccentedButton} from "../AccentedButton";
import {formBaseStyle} from "../../css/forms";
import {FormWithValidation} from "../forms/FormWithValidation";
import {AuthFormInput, AuthFormInputMessage} from "../../routes/auth/_deps/common";
import {required} from "../../controller/forms/validators";
import {FormStateProvider} from "../../controller/forms/FormStateProvider";


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

const EditProfileForm = styled(PlainEditProfileForm)`
    & {
        ${formBaseStyle};
        padding: 20px;
    }
    
    &>input {
        width: calc(100% - 5px);
        padding-left: 5px;
    }
`


const PlainEditProfilePage = observer(function EditProfilePage({className}: { className?: string }) {
    const authStatus = useAuthContext()
    const imageCache = useContext(imgCacheContext)
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(
            () => {
                if (authStatus.id === null) {
                    navigate("/sign-in")
                }
            }
        )
    }, [authStatus.id, navigate])

    if (authStatus.id === null) {
        return <></>
    }

    const imageSrc = imageUri(authStatus.id)
    const imageData = imageCache === null ? imageSrc : imageCache.get(imageSrc)
    const placeholderData = imageCache?.getPlaceholder() ?? ImgCache.placeholder

    const imgContainerStyle = {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 10
    } satisfies CSSProperties

    const imgStyle = {
        height: 108,
        aspectRatio: 1,
        marginRight: 10,
        padding: 6,
        backgroundColor: "#252323"
    } satisfies CSSProperties

    const formContainerStyle = {
        display: "flex",
        flexDirection: "column"
    } satisfies CSSProperties

    return (
        <div className={className}>
            <div style={imgContainerStyle}>
                <img style={imgStyle} src={imageData} onError={e => e.currentTarget.src = placeholderData}
                     alt={"Аватар"}/>
                <AccentedButton type={"button"}>Изменить фотографию</AccentedButton>
            </div>
            <div style={formContainerStyle}>
                <EditProfileForm />
            </div>
        </div>
    )
})

export const EditProfilePage = styled(PlainEditProfilePage)`
    & {
        display: flex;
        flex-direction: column;
        min-height: 0;
        margin: auto;
        width: 60%;
        max-width: 500px;
        overflow-y: auto;
        padding: 20px;
        flex: 1;
    }

    & > :nth-child(2) {
        width: 100%;
    }
`