import {css} from "styled-components";
import {CSSProperties} from "react";

export const authFormStyle = css`
    padding: 30px;
    display: flex;
    flex-direction: column;
    width: 30%;
    font-size: 15px;
`

export const authFormInputMessageStyle = css`
    font-size: 15px;
`

export const authButtonStyle: CSSProperties = {
    fontSize: "25px",
    borderRadius: "7px",
    paddingTop: "10px",
    paddingBottom: "10px",
    fontWeight: 700,
    marginTop: "20px"
}