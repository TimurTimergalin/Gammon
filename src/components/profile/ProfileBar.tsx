import {CSSProperties, ReactNode} from "react";
import styled from "styled-components";

function EloIcon({iconSrc, value}: { iconSrc: string, value: number }) {
    const imgStyle = {
        width: 30,
        aspectRatio: 1,
        marginRight: 5
    } satisfies CSSProperties
    const spanStyle = {
        marginRight: 10,
        whiteSpace: "nowrap"
    } satisfies CSSProperties
    return (
        <span style={spanStyle}>
            <img src={iconSrc} alt={"Иконка режима"} style={imgStyle}/> {value}
        </span>
    )
}

function ProfileBar() {
    const layer1Style = {
        backgroundColor: "#444444",
        color: "white",
        paddingLeft: 15
    } satisfies CSSProperties

    const imgContainerStyle = {
        float: "left",
        width: 120,
        aspectRatio: 1,
        padding: 15
    } satisfies CSSProperties

    const nameStyle = {
        fontWeight: 600,
        fontSize: 25,
        marginTop: 13,
        marginBottom: 5
    } satisfies CSSProperties

    const regularTextStyle = {
        fontSize: 20,
        marginTop: 5
    } satisfies CSSProperties

    const pl = "/placeholder.svg"

    return (
        <div style={layer1Style}>
            <div style={imgContainerStyle}>
                <img src={pl} alt={"Аватар"}/>
            </div>
            <p style={nameStyle}>Отображаемое имя</p>
            <p style={regularTextStyle}><span style={{marginRight: 10}}>Логин</span>
                <button type={"button"}>Редактировать/Вызвать на матч</button>
            </p>
            <p>
                <EloIcon iconSrc={pl} value={1000}/>
                <EloIcon iconSrc={pl} value={1000}/>
                <EloIcon iconSrc={pl} value={1000}/>
                <EloIcon iconSrc={pl} value={1000}/>
            </p>
        </div>
    )
}

type MatchEntryProp = {
    gameModeIcon: string,
    whiteName: string,
    whiteElo: number,
    userWon: boolean,
    blackElo: number,
    blackName: string
}

function PlainMatchEntry({className, gameModeIcon, whiteName, whiteElo, blackName, blackElo, userWon}: MatchEntryProp & {
    className?: string
}) {
    const imgContainerStyle = {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "fit-content",
        marginRight: 10
    } satisfies CSSProperties

    const imgStyle = {
        height: "80%",
        aspectRatio: "1"
    } satisfies CSSProperties

    const flexContainerStyle = {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        flex: 1
    } satisfies CSSProperties

    const status = userWon ? "Победа" : "Поражение"

    const statusStyle = {
        color: userWon ? "green" : "red",
        position: "absolute",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center"
    } satisfies CSSProperties

    return (
        <div className={className}>
            <span style={imgContainerStyle}>
                <img style={imgStyle} src={gameModeIcon} alt={"Иконка режима"}/>
            </span>
            <span style={{position: "relative", marginRight: 10}}>
                <span style={{visibility: "hidden"}}>Поражение</span>
                <span style={statusStyle}>{status}</span>
            </span>
            <div style={flexContainerStyle}>
                <span style={{flex: 1, textAlign: "left", whiteSpace: "nowrap"}}>{whiteName} ({whiteElo})</span>
                <span style={{flex: 1, textAlign: "center", fontSize: 15, whiteSpace: "nowrap"}}>VS</span>
                <span style={{flex: 1, textAlign: "right", whiteSpace: "nowrap"}}>{blackName} ({blackElo})</span>
            </div>
        </div>
    )
}

const MatchEntry = styled(PlainMatchEntry)`
    & {
        background-color: #444444;
        border-radius: 5px;
        color: white;
        font-size: 12px;
        display: flex;
        align-items: center;
    }

    &:hover {
        background-color: #555555;
    }
    
    &:active {
        background-color: #666666;
    }
`

function PlainMatchList ({children, className}: {children?: ReactNode | ReactNode[], className?: string}) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

const MatchList = styled(PlainMatchList)`
    & {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
        overflow-y: scroll;

        > * {
            height: fit-content;
            min-height: 50px;
            padding: 5px 20px;
            margin-bottom: 10px;
            width: 90%;
            max-width: 500px;
        }
    }
`

function PlainProfilePage({className}: { className?: string }) {
    return (
        <div className={className}>
            <ProfileBar />
            <MatchList>
                <MatchEntry userWon={true} gameModeIcon={"/placeholder.svg"} blackElo={1000} whiteName={"u1"} blackName={"u2"} whiteElo={1000} />
                <MatchEntry userWon={false} gameModeIcon={"/placeholder.svg"} blackElo={1000} whiteName={"u1"} blackName={"u2"} whiteElo={1000} />
                <MatchEntry userWon={true} gameModeIcon={"/placeholder.svg"} blackElo={1000} whiteName={"u1"} blackName={"u2"} whiteElo={1000} />
            </MatchList>
        </div>
    )
}

export const ProfilePage = styled(PlainProfilePage)`
    & {
        display: flex;
        flex: 1;
        min-height: 0;
        align-self: stretch;
        flex-direction: column;
        align-items: stretch;
        
        
        > :nth-child(1) {
            min-height: 160px;
            height: fit-content;
            margin-bottom: 15px;
        }
        > :nth-child(2) {
            flex: 1;
        }
    }
`