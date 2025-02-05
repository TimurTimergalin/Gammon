import {useNavigate} from "react-router";
import {ComponentProps} from "react";
import styled from "styled-components";
import {AccentedButton} from "../../../../components/AccentedButton";
import {endWindowButtonStyle, endWindowContentStyle, returnToMenuButtonStyle} from "../../_deps/styles";

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

const StyledReturnToMenuButton = styled(ReturnToMenuButton)`
    ${returnToMenuButtonStyle}
`
const StyledNewGameButton = styled(NewGameButton)`${endWindowButtonStyle}`

const PlainLocalPlayEndWindowContent = ({className}: {className?: string}) => {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div className={className}>
                <StyledNewGameButton />
                <StyledReturnToMenuButton />
            </div>
        </div>
    )
}

export const LocalPlayEndWindowContent = styled(PlainLocalPlayEndWindowContent)`
    ${endWindowContentStyle}
`