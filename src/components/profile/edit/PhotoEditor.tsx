import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {CSSProperties, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {PhotoEditContext} from "../../../controller/photo_edit/context";
import {AccentedButton} from "../../AccentedButton";
import {autorun} from "mobx";

// @ts-expect-error not ts module
import Croppie from "croppie/croppie.js"
import "croppie/croppie.min.js"
import "croppie/croppie.css"
import {useInvalidate} from "../../../controller/img_cache/context";
import {uploadImage} from "../../../requests/requests";
import {imageUri} from "../../../requests/paths";
import {useAuthContext} from "../../../controller/auth_status/context";
import {GreyButton} from "./common";
import {useNavigate} from "react-router";


const PlainPhotoEditor = observer(({className}: { className?: string }) => {
    const photoEditStatus = useContext(PhotoEditContext)!
    const [containerContent, setContainerContent] = useState<ReactNode>(<></>)
    const crop = useRef<Croppie>(undefined)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const authStatus = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        return autorun(() => {
            if (typeof photoEditStatus.image !== "string" && crop.current !== undefined) {
                crop.current.destroy()
                crop.current = undefined
                photoEditStatus.cropInit = false
            }
            if (photoEditStatus.image === undefined) {
                setContainerContent(<></>)
            } else if (photoEditStatus.image === false) {
                setContainerContent(<p>Ошибка при загрузке изображения</p>)
            } else {
                crop.current = new Croppie(containerRef.current, {viewport: {type: "square"}})
                crop.current.bind({url: photoEditStatus.image})
                    .then(() => photoEditStatus.cropInit = true)
                    .catch(() => photoEditStatus.image = false)
            }
        })
    }, [photoEditStatus]);


    const imgContainerStyle = {
        flex: 1,
        backgroundColor: "#252323",
        marginBottom: 10,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    } satisfies CSSProperties

    const buttonsStyle = {
        height: 40,
        width: 80,
        borderRadius: 5
    } satisfies CSSProperties

    const cancel = () => {
        photoEditStatus.image = undefined
        photoEditStatus.show = false
        photoEditStatus.cropInit = false
    }

    const invalidateCache = useInvalidate()

    const upload = () => {
        crop.current?.result({type: "blob", format: "jpg"}).then(
            (blob: Blob) => {
                photoEditStatus.image = undefined
                photoEditStatus.cropInit = false
                photoEditStatus.show = false
                invalidateCache(imageUri(authStatus.id!))
                return uploadImage(fetch, blob, "icon.jpg")
            }
        ).then(() => navigate(0))
    }

    return (
        <div className={className}>
            <div style={imgContainerStyle} ref={containerRef}>
                {containerContent}
            </div>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                <GreyButton type={"button"} style={buttonsStyle} onClick={cancel}>Отмена</GreyButton>
                <AccentedButton type={"button"}
                                disabled={typeof photoEditStatus.image !== "string" || !photoEditStatus.cropInit}
                                style={buttonsStyle}
                                onClick={upload}
                >Загрузить</AccentedButton>
            </div>
        </div>
    )
})

const PhotoEditor = styled(PlainPhotoEditor)`
    & {
        background-color: #444444;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        padding: 20px;
    }
`

const PlainPhotoEditorTab = observer(({className}: { className?: string }) => {
    const photoEditStatus = useContext(PhotoEditContext)!

    return (
        <div className={className} style={{display: photoEditStatus.show ? "flex" : "none"}}>
            <PhotoEditor/>
        </div>
    )
})

export const PhotoEditorTab = styled(PlainPhotoEditorTab)`
    & {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #222222aa;
    }

    & > * {
        width: 40%;
        height: 60%;
        min-width: 300px;
        margin: auto;
    }
`