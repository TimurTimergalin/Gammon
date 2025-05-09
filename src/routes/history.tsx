import {HistoryPage} from "../components/history_page/HitstoryPage";
import type {Route} from "./+types/history"
// import {redirect} from "react-router";
// import {FetchType} from "../common/requests";
// import {getHistory, getHistoryLength} from "../requests/requests";

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader(/*{params: {matchId: matchIdStr}, request}: Route.ClientLoaderArgs*/) {
    // const matchId = parseInt(matchIdStr)
    // if (isNaN(matchId)) {
    //     return redirect("/")
    // }
    // const cancellableFetch: FetchType = (input, init) =>
    //     fetch(input, {signal: request.signal, ...init})
    //
    // const lengthResp = await getHistoryLength(cancellableFetch, matchId)
    // if (!lengthResp.ok) {
    //     return redirect("/")
    // }
    // const length = parseInt(await lengthResp.text())
    // if (isNaN(length)) {
    //     return redirect("/")
    // }
    //
    // const historyRequests = []
    // for (let i = 0; i < length; ++i) {
    //     historyRequests.push(
    //         getHistory(cancellableFetch, matchId, i)
    //     )
    // }
    //
    // return await Promise.all(historyRequests)

    await new Promise(resolve => setTimeout(resolve, 500))

    return [
        {
            firstToMove: "WHITE",
            thresholdPoints: 3,
            type: "SHORT_BACKGAMMON",
            items: [
                {
                    type: "MOVE",
                    dice: [2, 3],
                    moves: [{from: 24, to: 22}, {from: 24, to: 21}]
                },
                {
                    type: "OFFER_DOUBLE",
                    newValue: 2
                },
                {
                    type: "ACCEPT_DOUBLE"
                },
                {
                    type: "MOVE",
                    dice: [3, 2],
                    moves: [{from: 1, to: 3}, {from: 1, to: 4}]
                },
                {
                    type: "GAME_END",
                    white: 0,
                    black: 2,
                    winner: "BLACK",
                    isSurrendered: true
                }
            ]
        },
        {
            firstToMove: "BLACK",
            thresholdPoints: 3,
            type: "SHORT_BACKGAMMON",
            items: [
                {
                    type: "MOVE",
                    dice: [4, 2],
                    moves: [{from: 1, to: 5}, {from: 1, to: 3}]
                },
                {
                    type: "MOVE",
                    dice: [2, 3],
                    moves: [{from: 24, to: 22}, {from: 24, to: 21}]
                },
                {
                    type: "OFFER_DOUBLE",
                    newValue: 2
                },
                {
                    type: "GAME_END",
                    white: 0,
                    black: 3,
                    winner: "BLACK",
                    isSurrendered: true
                }
            ]
        }
    ]
}


export default function Page({loaderData}: Route.ComponentProps) {
    return <HistoryPage remoteHistory={loaderData}/>
}