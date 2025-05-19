import {observer} from "mobx-react-lite";
import {useAuthContext} from "../../../controller/auth_status/context";
import {CSSProperties, useEffect, useRef} from "react";
import {useNavigate} from "react-router";
import styled from "styled-components";
import {EditProfileForm} from "./EditProfileForm";
import {ImageContainer} from "./ImageContainer";
import {PhotoEditorTab} from "./PhotoEditor";
import {PhotoEditContext} from "../../../controller/photo_edit/context";
import {PhotoEditStatus} from "../../../controller/photo_edit/PhotoEditStatus";
import {FormStateProvider} from "../../../controller/forms/FormStateProvider";

const PlainEditProfileTab = observer(function EditProfilePage({className}: { className?: string }) {
    const authStatus = useAuthContext()
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

    const formContainerStyle = {
        display: "flex",
        flexDirection: "column"
    } satisfies CSSProperties

    return (
        <div className={className}>
            <ImageContainer/>
            <div style={formContainerStyle}>
                <FormStateProvider>
                    <EditProfileForm/>
                </FormStateProvider>
            </div>
        </div>
    )
})

const EditProfileTab = styled(PlainEditProfileTab)`
    & {
        display: flex;
        flex-direction: column;
        min-height: 0;
        margin: auto;
        width: 60%;
        max-width: 500px;
        padding: 20px;
        flex: 1;
    }

    & > :nth-child(2) {
        width: 100%;
    }
`

const PlainEditProfilePage = ({className}: { className?: string }) => {
    const photoEditStatus = useRef(new PhotoEditStatus())
    return (
        <div className={className}>
            <PhotoEditContext.Provider value={photoEditStatus.current}>
                <EditProfileTab/>
                <PhotoEditorTab/>
            </PhotoEditContext.Provider>

        </div>
    )
}

export const EditProfilePage = styled(PlainEditProfilePage)`
    display: flex;
    flex: 1;
    align-self: stretch;
    overflow-y: auto;
    position: relative;
`