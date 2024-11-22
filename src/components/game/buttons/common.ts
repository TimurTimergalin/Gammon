import {CSSProperties} from "react";

export const buttonStyle = (): CSSProperties => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: `${70 / 900 * 100}%`,
    padding: 0,
    marginLeft: `${10 / 900 * 100}%`,
    userSelect: "none"
})

export const imagStyle = (): CSSProperties => ({
    margin: "10%",
    marginLeft: "30%",
    marginRight: "30%"
})