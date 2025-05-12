import {HistoryPage} from "../components/history_page/HitstoryPage";
import type {Route} from "./+types/history"
import {getAnalysis, getHistory, getHistoryLength} from "../requests/requests";
import {redirect} from "react-router";
import {FetchType} from "../common/requests";
import {useEffect, useState} from "react";
import {useFetch} from "../common/hooks";
// import {redirect} from "react-router";
// import {FetchType} from "../common/requests";
// import {getHistory, getHistoryLength} from "../requests/requests";


async function getMatchLength(matchId: number, fetch: FetchType): Promise<number | null> {
    const lengthResp = await getHistoryLength(fetch, matchId)
    if (!lengthResp.ok) {
        return null
    }
    const length = parseInt(await lengthResp.text())
    if (isNaN(length)) {
        return null
    }
    return length
}

async function getRemoteHistory(matchId: number, fetch: FetchType) {
    const length = await getMatchLength(matchId, fetch)
    if (length === null) {
        return null
    }

    const historyRequests = []
    for (let i = 1; i <= length; ++i) {
        historyRequests.push(
            getHistory(fetch, matchId, i)
        )
    }

    const responses = await Promise.all(historyRequests)
    for (const resp of responses) {
        if (!resp.ok) {
            return null
        }
    }

    const res = await Promise.all(responses.map(r => r.json()))
    console.log(res)
    return res
}

async function getAnalysisLoader(matchId: number, fetch: FetchType) {
    const analysisResp = await getAnalysis(fetch, matchId)
    if (!analysisResp.ok) {
        return null
    }
    const res = await analysisResp.json()
    console.log(res)
    return res
}

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader({params: {matchId: matchIdStr}, request}: Route.ClientLoaderArgs) {
    const matchId = parseInt(matchIdStr)
    if (isNaN(matchId)) {
        return redirect("/")
    }
    const cancellableFetch: FetchType = (input, init) =>
        fetch(input, {signal: request.signal, ...init})

    const [history] = await Promise.all([getRemoteHistory(matchId, cancellableFetch)])
    if (history === null) {
        return redirect("/")
    }
    return [matchId, history]
    // await new Promise(resolve => setTimeout(resolve, 500))

    // return [
    //     {
    //         firstToMove: "WHITE",
    //         thresholdPoints: 3,
    //         type: "SHORT_BACKGAMMON",
    //         items: [
    //             {
    //                 type: "MOVE",
    //                 dice: [2, 3],
    //                 moves: [{from: 24, to: 22}, {from: 24, to: 21}]
    //             },
    //             {
    //                 type: "OFFER_DOUBLE",
    //                 newValue: 2
    //             },
    //             {
    //                 type: "ACCEPT_DOUBLE"
    //             },
    //             {
    //                 type: "MOVE",
    //                 dice: [3, 2],
    //                 moves: [{from: 1, to: 3}, {from: 1, to: 4}]
    //             },
    //             {
    //                 type: "GAME_END",
    //                 white: 0,
    //                 black: 2,
    //                 winner: "BLACK",
    //                 isSurrendered: true
    //             }
    //         ]
    //     },
    //     {
    //         firstToMove: "BLACK",
    //         thresholdPoints: 3,
    //         type: "SHORT_BACKGAMMON",
    //         items: [
    //             {
    //                 type: "MOVE",
    //                 dice: [4, 2],
    //                 moves: [{from: 1, to: 5}, {from: 1, to: 3}]
    //             },
    //             {
    //                 type: "MOVE",
    //                 dice: [2, 3],
    //                 moves: [{from: 24, to: 22}, {from: 24, to: 21}]
    //             },
    //             {
    //                 type: "OFFER_DOUBLE",
    //                 newValue: 2
    //             },
    //             {
    //                 type: "GAME_END",
    //                 white: 0,
    //                 black: 3,
    //                 winner: "BLACK",
    //                 isSurrendered: true
    //             }
    //         ]
    //     }
    // ]
}


export default function Page({loaderData: [matchId, history]}: Route.ComponentProps) {
    const [analysis, setAnalysis] = useState<undefined | null | ReturnType<JSON["parse"]>>(undefined)
    const [fetch] = useFetch()
    
    useEffect(() => {
        getAnalysisLoader(matchId as number, fetch).then(setAnalysis)
    }, [fetch, matchId]);

    console.log(analysis)

    return <HistoryPage remoteHistory={history} analysis={analysis}/>
}