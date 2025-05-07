import {observer} from "mobx-react-lite";
import {ComponentProps, CSSProperties, useContext, useEffect, useState} from "react";
import {imgCacheContext, useImgCache, useImgPlaceholder} from "../../../controller/img_cache/context";

export const PlayerIcon = observer(function PlayerIcon({username, iconSrc}:{
    username?: string,
    iconSrc: string
}) {
    const containerStyle: CSSProperties = {
        padding: "10px",
        display: "flex",
        height: "30px",
        width: "30px",
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

    const [imgSrc, setImgSrc] = useState(useImgCache(iconSrc))

    useEffect(() => {
        setImgSrc(imgCache?.get(iconSrc) ?? iconSrc)
        console.log("Re-rendering")
    }, [iconSrc, imgCache]);
    
    console.log("Displaying ", imgSrc)

    const placeholderData = useImgPlaceholder()
    const imgProps = {
        src: imgSrc,
        alt: "Icon",
        style: {backgroundColor: "#252323", padding: "2px", width: 30},
        onError: () => {
            console.log("Unable to display src: ", imgSrc)
            setImgSrc(placeholderData)
        }
    } satisfies ComponentProps<"img">

    // noinspection HtmlRequiredAltAttribute
    const img = <img {...imgProps} />

    return (
        <div style={containerStyle}>
            {img}
            {username !== undefined && <p style={textStyle}>{username}</p>}
        </div>
    )
})