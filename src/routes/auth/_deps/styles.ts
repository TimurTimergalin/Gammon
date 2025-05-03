import {css} from "styled-components";
import {CSSProperties} from "react";

export const authFormStyle = css`
    padding: 30px;
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    flex-direction: column;
    width: 60%;
    max-width: 350px;
    font-size: 15px;
    min-height: fit-content;
    height: 80%;
    max-height: 480px;
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