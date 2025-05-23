import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {ChallengePage} from "../components/challenge_page/ChallengePage";

export default function Challenge() {
    const {userId} = useParams()
    const [id, setId] = useState<number | undefined>(undefined)
    const navigate = useNavigate()

    useEffect(() => {
        if (userId === undefined) {
            navigate("/play")
        } else {
            const intId = parseInt(userId)
            if (isNaN(intId)) {
                navigate("/play")
            } else {
                setId(intId)
            }
        }
    }, [navigate, userId]);

    return id !== undefined && <ChallengePage userId={id} />
}