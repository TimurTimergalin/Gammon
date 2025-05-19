import {ComponentProps} from "react";
import {useNavigate, useParams} from "react-router";
import {endWindowButtonStyle, endWindowContentStyle, returnToMenuButtonStyle} from "../../_deps/styles";
import styled from "styled-components";
import {AccentedButton} from "../../../../components/AccentedButton";


const ReturnToMenuButton = (props: ComponentProps<"button">) => {
    const navigate = useNavigate()

    return (
        <button onClick={() => navigate("/play")} {...props}>На главную</button>
    )
}

const StyledReturnToMenuButton = styled(ReturnToMenuButton)`
    ${returnToMenuButtonStyle}
`

const PlainAnalysisButton = ({className}: {className?: string}) => {
    const navigate = useNavigate()
    const {roomId} = useParams()

    return (
        <AccentedButton className={className} onClick={() => navigate(`/history/${roomId}`)}>Анализ</AccentedButton>
    )
}

const AnalysisButton = styled(PlainAnalysisButton)`
    ${endWindowButtonStyle}
`

const PlainRemotePlayEndWindowContent = ({className}: {className?: string}) => {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div className={className}>
                <AnalysisButton />
                <StyledReturnToMenuButton />
            </div>
        </div>
    )
}

export const RemotePlayEndWindowContent = styled(PlainRemotePlayEndWindowContent)`
    ${endWindowContentStyle}
`

