import styled from "styled-components";

const PlainButtonsTab = ({className}: { className?: string }) => (
    <div className={className}>
        <button>Сдаться</button>
        <button>Перевернуть доску</button>
    </div>
)

export const ButtonsTab = styled(PlainButtonsTab)`
    background-color: white;
    border-radius: 0 0 20px 20px;
    display: flex;
    justify-content: space-evenly;
`