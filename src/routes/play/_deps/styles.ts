import {css} from "styled-components";
import {fontFamily} from "../../../common/font";

export const endWindowButtonStyle = css`
    width: 40%;
    height: 50px;
    border-radius: 5px;
    border: 0;
    font-size: 15px;
`
export const returnToMenuButtonStyle = css`
    & {
        ${endWindowButtonStyle};
        background-color: lightgray;
        font-family: ${fontFamily}, sans-serif;
    }

    &:active {
        background-color: #bbbbbb;
    }

    &:hover {
        background-color: #dddddd;
    }
`

export const endWindowContentStyle = css`
    display: flex;
    justify-content: space-evenly;
    margin-top: 20px;
`