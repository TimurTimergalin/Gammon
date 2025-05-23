import styled, {css} from "styled-components";
import {MessageTemplate} from "../messages/MessageTemplate";


const messageStyle = css`
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 30px;
    color: black;
`


const PlainSuccessMessage = ({className}: {className?: string}) => {
    return (
        <MessageTemplate className={className}>
            Запрос в друзья успешно отправлен
        </MessageTemplate>
    )
}

export const SuccessMessage = styled(PlainSuccessMessage)`
    ${messageStyle};
    background-color: #BEF2BE;
    height: 70px;
`

const PlainErrorMessage = ({className, reason}: {className?: string, reason?: string}) => {
    return (
        <MessageTemplate className={className}>
            Не удалось отправить запрос в друзья{reason && `: ${reason}`}
        </MessageTemplate>
    )
}

export const ErrorMessage = styled(PlainErrorMessage)`
    ${messageStyle};
    background-color: #f2bfbf;
    height: 70px;
`


