import {observer} from "mobx-react-lite";
import {ComponentProps, CSSProperties, useContext, useState} from "react";
import {imgCacheContext} from "../img_cache/context";
import {ImgCache} from "../img_cache/ImgCache";

export const PlayerIcon = observer(function PlayerIcon({username, iconSrc}:{
    username: string,
    iconSrc: string
}) {
    const containerStyle: CSSProperties = {
        padding: "10px",
        display: "flex",
        height: "30px",
        marginLeft: "10px",
        userSelect: "none"
    }

    const textStyle: CSSProperties = {
        marginLeft: "10px",
        marginTop: 0,
        marginBottom: 0,
        height: "min-content",
        alignSelf: "center"
    }

    const imgCache = useContext(imgCacheContext)

    const [imgSrc, setImgSrc] = useState(imgCache === null ? iconSrc : imgCache.get(iconSrc))

    const imgProps = {
        src: imgSrc,
        alt: "Icon",
        style: {backgroundColor: "#252323", padding: "2px"},
        onError: () => {
            setImgSrc(imgCache?.getPlaceholder() ?? ImgCache.placeholder)
        }
    } satisfies ComponentProps<"img">

    const img = <img {...imgProps} />

    return (
        <div style={containerStyle}>
            {img}
            <p style={textStyle}>{username}</p>
        </div>
    )
})