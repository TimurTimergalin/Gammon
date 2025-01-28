import {css} from "styled-components";

export const formBaseStyle = css`
    background-color: #252323;
    font-size: 20px;
    border-radius: 20px;
`

export const inputBaseStyle = css`
    &:focus, &:hover {
        outline: 2px solid #ff7f2a;
    }

    &:invalid {
        outline: 2px solid #cc3333;
    }

    & {
        background-color: #555555;
        border: 0;
        font-size: 22px;
        color: white;
        height: 1.5em;
        border-radius: 7px;
    }
`