import styled from "styled-components";
import {useImgCache, useImgPlaceholder} from "../../controller/img_cache/context";
import {AccentedButton} from "../AccentedButton";

const PlainFriendsEntry = ({className, iconSrc, login, username}: {className?: string, iconSrc: string, login: string, username: string}) => {
    const icon = useImgCache(iconSrc)
    const placeholder = useImgPlaceholder()
    return (
        <div className={className}>
            <img src={icon} alt={"Аватар"} onError={(e) => e.currentTarget.src = placeholder}/>
            <div>
                <p>{username}</p>
                <p>{login}</p>
            </div>
            <AccentedButton type={"button"}>Вызвать</AccentedButton>
        </div>
    )
}

const FriendsEntry = styled(PlainFriendsEntry)`
    & {
        border-radius: 5px;
        background-color: #444444;
        display: flex;
        color: white;
        align-items: center;
        
        img {
            height: 80%;
            background-color: #333;
            padding: 5px;
            margin: 10px;
        }
        >:nth-child(2) {
            flex: 1;
            
            p:nth-child(1) {
                font-size: 25px;
            }
            
            p:nth-child(2) {
                font-size: 10px;
            } 
        }
        ${AccentedButton} {
            aspect-ratio: 1;
            margin-right: 10px;
            border-radius: 10px;
        }
    }
`

const PlainFriendList = ({className}: {className?: string}) => {
    return (
        <div className={className}>
            <FriendsEntry iconSrc={""} login={"login1"} username={"Username1"} />
            <FriendsEntry iconSrc={""} login={"login2"} username={"Username2"} />
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"} />
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"} />
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"} />
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"} />
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"} />
        </div>
    )
}

const FriendList = styled(PlainFriendList)`
    & {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }
    
    &>${FriendsEntry} {
        height: 100px;
        margin-bottom: 20px;
    }
`

const PlainFriendRequestEntry = ({className, iconSrc, username, login}: {className?: string, iconSrc: string, username: string, login: string}) => {
    const icon = useImgCache(iconSrc)
    const placeholder = useImgPlaceholder()
    return (
        <div className={className}>
            <img src={icon} alt={"Аватар"} onError={(e) => e.currentTarget.src = placeholder}/>
            <div>
                <p>{username}</p>
                <p>{login}</p>
            </div>
            <AccentedButton type={"button"}>Да</AccentedButton>
            <AccentedButton type={"button"}>Нет</AccentedButton>
        </div>
    )
}

const FriendRequestEntry = styled(PlainFriendRequestEntry)`
    & {
        display: flex;
        align-items: center;
        color: white;
        
        p {
            margin: 0;
        }
        
        img {
            height: 80%;
            background-color: #333;
            padding: 5px;
            margin-left: 5px;   
        }
        >:nth-child(2) {
            flex: 1;
            
            p:nth-child(1) {
                font-size: 25px;
            }
            
            p:nth-child(2) {
                font-size: 10px;
            } 
        }
        
        ${AccentedButton} {
            aspect-ratio: 1;
            margin-right: 10px;
            height: 80%;
            border-radius: 5px;
        }
    }
`

const PlainFriendRequests = ({className}: {className?: string}) => {
    return (
        <div className={className}>
            <div>Заявки в друзья</div>
            <div>
                <FriendRequestEntry iconSrc={""} login={"login4"} username={"Username4"} />
                <FriendRequestEntry iconSrc={""} login={"login5"} username={"Username5"} />
            </div>
        </div>
    )
}

const FriendRequests = styled(PlainFriendRequests)`
    & {
        background-color: #222;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        
        >:nth-child(1) {
            background-color: #444;
            height: 30px;
            margin-bottom: 5px;
        }
        ${FriendRequestEntry} {
            margin-bottom: 5px;
            height: 50px;
        }
    }
`

const PlainFriendsPage = ({className}: {className?: string}) => {
    return (
        <div className={className}>
            <FriendList />
            <div>
                <FriendRequests />
            </div>
        </div>
    )
}

export const FriendsPage = styled(PlainFriendsPage)`
    & {
        flex: 1;
        align-self: stretch;
        flex-wrap: wrap;
        display: flex;
        justify-content: space-evenly;
        min-width: 0;
        overflow-y: auto;
        
        >${FriendList} {
            width: 60%;
            margin: 20px;
        }
        >:nth-child(2) {
            margin: 20px;
            width: 400px;
        }
    }
`
