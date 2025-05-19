import styled from "styled-components";
import {fontFamily} from "../../../common/font";

export const GreyButton = styled.button`
    & {
        justify-content: center;
        align-items: center;
        user-select: none;
        background-color: #888;
        border: 0;
        font-family: ${fontFamily}, sans-serif;
        color: white;
    }

    &:hover:enabled {
        background-color: #999;
    }

    &:active:enabled {
        background-color: #aaa;
    }
`