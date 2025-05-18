import styled from "styled-components";
import {useImgCache, useImgPlaceholder} from "../../controller/img_cache/context";
import {AccentedButton} from "../AccentedButton";
import {ReactNode, useContext, useEffect, useState} from "react";
import {useFetch} from "../../common/hooks";
import {approveFriendRequest, getFriendRequest, rejectFriendRequest, userInfo} from "../../requests/requests";
import {imageUri} from "../../requests/paths";
import {FriendsStatusContext} from "../../controller/friend/context";
import {FriendsStatus} from "../../controller/friend/FriendsStatus";
import {useAuthContext} from "../../controller/auth_status/context";
import {useNavigate} from "react-router";

const PlainFriendsEntry = ({className, iconSrc, login, username}: {
    className?: string,
    iconSrc: string,
    login: string,
    username: string
}) => {
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
        background-color: #444444;
        display: flex;
        color: white;
        align-items: center;

        img {
            height: 60%;
            background-color: #333;
            padding: 5px;
            margin: 10px;
        }

        > :nth-child(2) {
            flex: 1;

            p:nth-child(1) {
                font-size: 20px;
                margin: 0;
            }

            p:nth-child(2) {
                font-size: 12px;
                margin-left: 2px;
                margin-top: 0;
            }
        }

        ${AccentedButton} {
            aspect-ratio: 1;
            margin-right: 10px;
            border-radius: 10px;
        }
    }
`

const PlainFriendList = ({className}: { className?: string }) => {
    return (
        <div className={className}>
            <FriendsEntry iconSrc={""} login={"login1"} username={"Username1"}/>
            <FriendsEntry iconSrc={""} login={"login2"} username={"Username2"}/>
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"}/>
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"}/>
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"}/>
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"}/>
            <FriendsEntry iconSrc={""} login={"login3"} username={"Username3"}/>
        </div>
    )
}

const FriendList = styled(PlainFriendList)`
    & {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    & > ${FriendsEntry} {
        height: 100px;
        margin-bottom: 20px;
    }
`

const PlainFriendRequestEntry = ({className, iconSrc, username, id}: {
    className?: string,
    iconSrc: string,
    username: string,
    id: number
}) => {
    const icon = useImgCache(iconSrc)
    const placeholder = useImgPlaceholder()
    const {friendRequests: requestsList, friends} = useContext(FriendsStatusContext)!

    const onRefuse = () => {
        rejectFriendRequest(fetch, id).then()
        const toDelete = requestsList.findIndex(o => o.id == id)
        requestsList.splice(toDelete, 1)
    }

    const onAccept = () => {
        approveFriendRequest(fetch, id).then()
        const toDelete = requestsList.findIndex(o => o.id == id)
        requestsList.splice(toDelete, 1)
        userInfo(fetch, id)
            .then(resp => resp.json())
            .then(({login}) => {
                friends.push({id, username, login})
            })
    }

    return (
        <div className={className}>
            <img src={icon} alt={"Аватар"} onError={(e) => e.currentTarget.src = placeholder}/>
            <div>
                <p>{username}</p>
            </div>
            <AccentedButton type={"button"} onClick={onAccept}>Да</AccentedButton>
            <AccentedButton type={"button"} onClick={onRefuse}>Нет</AccentedButton>
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
            margin-right: 5px;
        }

        > :nth-child(2) {
            flex: 1;

            p:nth-child(1) {
                font-size: 20px;
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

const PlainFriendRequests = ({className}: { className?: string }) => {
    const [fetch] = useFetch()

    const {friendRequests: requestsList} = useContext(FriendsStatusContext)!

    useEffect(() => {
        getFriendRequest(fetch)
            .then(resp => resp.json())
            .then(requests => {
                console.log(requests)
                for (const request of requests) {
                    requestsList.push(request)
                }
            })
    }, [fetch, requestsList]);

    const requestNodes: ReactNode[] = []
    for (const {username, id} of requestsList) {
        requestNodes.push(<FriendRequestEntry username={username} iconSrc={imageUri(id)} id={id} key={id}/>)
    }

    return (
        <div className={className}>
            <div style={{lineHeight: "2em", textAlign: "center"}}>Заявки в друзья</div>
            <div>
                {requestNodes.length > 0 ? requestNodes : <p style={{textAlign: "center"}}>Нет заявок</p>}
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

        > :nth-child(1) {
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

const PlainFriendsPage = ({className}: { className?: string }) => {
    const [friendsStatus] = useState(new FriendsStatus())
    const authStatus = useAuthContext()
    const [checked, setChecked] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (authStatus.id === null) {
            navigate("/sign-in")
        } else {
            setChecked(true)
        }
    }, [authStatus.id, navigate]);

    return (
        <>{checked &&
            <FriendsStatusContext.Provider value={friendsStatus}>
                <div className={className}>
                    <FriendList/>
                    <div>
                        <FriendRequests/>
                    </div>
                </div>
            </FriendsStatusContext.Provider>
        }</>
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

        > ${FriendList} {
            width: 60%;
            margin: 20px;
        }

        > :nth-child(2) {
            margin: 20px;
            width: 400px;
        }
    }
`
