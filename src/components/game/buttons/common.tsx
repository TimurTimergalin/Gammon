import {CSSProperties} from "react";

export const additionalStyle = (): CSSProperties => ({
    padding: 0,
    marginLeft: 5,
    marginBottom: 5,
    borderRadius: "10%",
    display: "flex",
    aspectRatio: 3 / 2,
    height: "35px",
})

export const imagStyle = (): CSSProperties => ({
    margin: "10%",
    flex: 1,
    maxWidth: "50%"
})

