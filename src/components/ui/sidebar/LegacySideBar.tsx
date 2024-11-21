import LegacyIconedText from "./LegacyIconedText.tsx";
import {useCallback, useRef, useState} from "react";
import {useLayoutMeasure} from "../../../hooks";

export default function LegacySideBar() {
    const textStyle = {
        color: "white",
        fontSize: "1.3em",
        fontFamily: "\"Arial\", sans-serif"
    }

    const logoStyle = {
        ...textStyle,
        fontSize: "2em",
        fontWeight: "bold"
    }

    const containerStyle = {
        marginBottom: "20px"
    }

    const [displayText, setDisplayText] = useState(true)
    const sideBarRef = useRef(null)

    const expandedSize = 170
    const shrankSize = 62.5

    const measureScreen = useCallback(() => {
        const minExpandedWidth = expandedSize / 0.15
        setDisplayText(document.body.offsetWidth >= minExpandedWidth)
    }, [])
    useLayoutMeasure(measureScreen)

    const sideBarPaddingTop = 20
    return (
        <div
            style={{
                width: displayText ? `${expandedSize}px` : `${shrankSize}px`,
                height: `calc(100% - ${sideBarPaddingTop}px)`,
                backgroundColor: "#200a06",
                paddingTop: `${sideBarPaddingTop}px`,
            }}
            ref={sideBarRef}
        >
            <LegacyIconedText
                text={"Logo"}
                imageSrc={"placeholder.svg"}
                imageAlt={"Logo"}
                textStyle={logoStyle}
                containerStyle={containerStyle}
                displayText={displayText}
            />
            <LegacyIconedText
                text={"Play"}
                imageSrc={"placeholder.svg"}
                imageAlt={"Play"}
                textStyle={textStyle}
                containerStyle={containerStyle}
                displayText={displayText}
            />
        </div>
    )
}