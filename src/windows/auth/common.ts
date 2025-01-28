import {css} from "styled-components";
import {CSSProperties} from "react";

export const loginFormStyle = css`
    padding: 30px;
    display: flex;
    flex-direction: column;
    width: 30%;
`

export const loginFormInputStyle = css`
    & {
        margin-bottom: 20px;
    }
`

export const buttonStyle: CSSProperties = {
    fontSize: "25px",
    borderRadius: "7px",
    paddingTop: "10px",
    paddingBottom: "10px",
    fontWeight: 700,
    marginTop: "20px"
}