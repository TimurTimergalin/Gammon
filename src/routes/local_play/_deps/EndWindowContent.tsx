import {useNavigate} from "react-router";
import {ComponentProps} from "react";
import styled, {css} from "styled-components";
import {AccentedButton} from "../../../components/AccentedButton";
import {fontFamily} from "../../../common/font";

const ReturnToMenuButton = (props: ComponentProps<"button">) => {
    const navigate = useNavigate()

    return (
        <button onClick={() => navigate("/play")} {...props}>На главную</button>
    )
}

const NewGameButton = (props: ComponentProps<"button">) => {
    const navigate = useNavigate()

    return (
        <AccentedButton onClick={() => navigate(0)} {...props}>Новая игра</AccentedButton>
    )
}

const endWindowButtonStyle = css`
    width: 40%;
    height: 50px;
    border-radius: 5px;
    border: 0;
    font-size: 15px;
`

const StyledReturnToMenuButton = styled(ReturnToMenuButton)`
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
const StyledNewGameButton = styled(NewGameButton)`${endWindowButtonStyle}`

export const EndWindowContent = () => {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", justifyContent: "space-evenly", marginTop: 20}}>
                <StyledNewGameButton />
                <StyledReturnToMenuButton />
            </div>
        </div>
    )
}