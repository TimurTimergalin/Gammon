import {css} from "styled-components";
import {CSSProperties} from "react";

export const authFormStyle = css`
    padding: 30px;
    display: flex;
    flex-direction: column;
    width: 60%;
    max-width: 350px;
    font-size: 15px;
    height: calc(85% - 60px);
    max-height: 500px;
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