import {textHeight} from "./size_constants";
import {css} from "styled-components";


export const iconStyle = css`
    & {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: ${textHeight}px;
        padding-left: 15%;
        padding-top: 7%;
        padding-bottom: 7%;
        align-self: stretch;
    }
    
    &:hover {
        background-color: #332c26;
    }
`


