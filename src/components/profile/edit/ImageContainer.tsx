import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {useAuthContext} from "../../../controller/auth_status/context";
import {useImgCache, useImgPlaceholder} from "../../game/img_cache/context";
import {imageUri} from "../../../requests/paths";
import {AccentedButton} from "../../AccentedButton";
import {useContext, useRef} from "react";
import {PhotoEditContext} from "../../../controller/photo_edit/context";

const PlainImageContainer = observer(({className}: { className?: string }) => {
    const authStatus = useAuthContext()
    const imageData = useImgCache(imageUri(authStatus.id!))
    const placeholderData = useImgPlaceholder()
    const photoEditStatus = useContext(PhotoEditContext)!
    const inputRef = useRef<HTMLInputElement | null>(null)

    const inputOnChange = () => {
        const input = inputRef.current!
        if (!input.files) {
            photoEditStatus.show = false
            return
        }
        const file = input.files[0]
        input.value = ""

        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        }).then((data) => {
            photoEditStatus.show = true
            photoEditStatus.image = data as string
        }).catch(() => {
            photoEditStatus.show = true
            photoEditStatus.image = false
        })
    }

    return (
        <div className={className}>
            <img src={imageData} onError={e => e.currentTarget.src = placeholderData}
                 alt={"Аватар"}/>
            <input type={"file"} accept={"image/*"} style={{display: "none"}} ref={inputRef} onChange={inputOnChange}/>
            <AccentedButton type={"button"} onClick={() => inputRef.current?.click()}>
                Изменить фотографию
            </AccentedButton>
        </div>
    )
})
export const ImageContainer = styled(PlainImageContainer)`
    & {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 10px;
    }

    & > img {
        height: 108px;
        aspect-ratio: 1;
        margin-right: 10px;
        padding: 6px;
        background-color: #252323;
    }
`