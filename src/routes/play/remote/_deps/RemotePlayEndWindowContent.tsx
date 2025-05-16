import {ComponentProps} from "react";
import {useNavigate} from "react-router";
import {endWindowContentStyle, returnToMenuButtonStyle} from "../../_deps/styles";
import styled from "styled-components";


const ReturnToMenuButton = (props: ComponentProps<"button">) => {
    const navigate = useNavigate()

    return (
        <button onClick={() => navigate("/play")} {...props}>На главную</button>
    )
}

const StyledReturnToMenuButton = styled(ReturnToMenuButton)`
    ${returnToMenuButtonStyle}
`


const PlainRemotePlayEndWindowContent = ({className}: {className?: string}) => {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div className={className}>
                <StyledReturnToMenuButton />
            </div>
        </div>
    )
}

export const RemotePlayEndWindowContent = styled(PlainRemotePlayEndWindowContent)`
    ${endWindowContentStyle}
`

