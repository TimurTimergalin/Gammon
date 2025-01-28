import styled from "styled-components";

export const AccentedButton = styled.button`
    & {
        justify-content: center;
        align-items: center;
        user-select: none;
        background-color: #ff7f2a;
        border: 0;
        font-family: Comfortaa, sans-serif;
        color: white;
    }

    &[disabled], &:disabled {
        background-color: #976646;
    }

    &:hover:enabled {
        background-color: #ff954e;
    }
    
    &:active:enabled {
        background-color: #ff7f2a;
    }
`