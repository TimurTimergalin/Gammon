import {css} from "styled-components";
import {CSSProperties} from "react";

export const formStyle = css`
    background-color: #252323;
    padding: 30px;
    display: flex;
    flex-direction: column;
    font-size: 20px;
    width: 30%;
    border-radius: 20px;
`

export const inputStyle = css`
    & {
        background-color: #555555;
        border: 0;
        font-size: 22px;
        color: white;
        margin-bottom: 20px;
        height: 1.5em;
        border-radius: 7px;
    }

    &:focus, &:hover {
        outline: 2px solid #ff7f2a;
    }

    &:invalid {
        outline: 2px solid #cc3333;
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