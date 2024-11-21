export default function LegacyIconedText({text, imageSrc, imageAlt, textStyle, containerStyle, displayText}: {
    text: string,
    imageSrc: string,
    imageAlt: string,
    textStyle?: object,
    containerStyle?: object,
    displayText: boolean
}) {
    return (
        <div
            style={{
                ...(containerStyle || {}),
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                height: "60px",
                marginLeft: "10%",
            }}
        >
            <img
                src={imageSrc}
                style={{
                    height: displayText ? "70%" : "auto",
                    width: displayText ? "auto" : "70%",
                    userSelect: "none"
                }}
                alt={imageAlt}
            />
            {displayText && <p
                style={{
                    ...(textStyle || {}),
                    marginLeft: "15px",
                    lineHeight: "1em",
                    marginTop: "0",
                    marginBottom: "0",
                    userSelect: "none"
                }}
            >{text}
            </p>}
        </div>
    )
}