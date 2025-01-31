import {Color} from "../../../common/color";
import {finishTurn, subscribeForEvents} from "../../../requests/requests";
import {logResponseError} from "../../../requests/util";
import {Move} from "../../board/move";
import {RemoteMoveMapper} from "../../game_rule/RemoteMoveMapper";
import {logger} from "../../../logging/main";

const console = logger("game/game_controller/remote")

export interface RemoteConnector<Index> {
    subscribe(): void

    set onMovesMade(value: (moves: Move<Index>[]) => void)

    set onNewDice(value: (dice: [number, number], player: Color) => void)

    set onEnd(value: (winner: Color) => void)

    makeMove(moves: Move<Index>[]): void

    unsubscribe(): void
}

export class RemoteConnectorImpl<RemoteMove, Index> implements RemoteConnector<Index> {
    private readonly moveMapper: RemoteMoveMapper<RemoteMove, Index>
    private readonly roomId: number

    constructor(moveMapper: RemoteMoveMapper<RemoteMove, Index>,
                roomId: number) {
        this.moveMapper = moveMapper;
        this.roomId = roomId
    }

    makeMove = (moves: Move<Index>[]): void => {
        finishTurn(this.roomId, moves.map(this.moveMapper.toRemote))
            .then(resp => logResponseError(resp, "making a move"))
    }

    private _onMovesMade: (moves: Move<Index>[]) => void = () => console.warn("No onMovesMade set")
    set onMovesMade(value: (moves: Move<Index>[]) => void) {
        this._onMovesMade = value;
    }

    private _onNewDice: (dice: [number, number], player: Color) => void = () => console.warn("No onNewDice set")
    set onNewDice(value: (dice: [number, number], player: Color) => void) {
        this._onNewDice = value;
    }

    private _onEnd: (winner: Color) => void = () => console.warn("No onEnd set")
    set onEnd(value: (winner: Color) => void) {
        this._onEnd = value
    }

    private eventSource: EventSource | undefined = undefined

    subscribe = () => {
        this.eventSource = subscribeForEvents(this.roomId)
        console.log("Subscription initiated")
        this.eventSource.addEventListener("error", (ev) => {
            console.log("error, ", ev)
        })
        this.eventSource.addEventListener("open", () => {
            console.log("Stream opened")
        })
        this.eventSource.onmessage = (ev) => {
            console.log(ev)
            const data = JSON.parse(ev.data)
            if (data.type === undefined) {
                console.warn("Event without a type encountered: ", ev)
            } else if (data.type === "MOVE_EVENT") {
                console.log("move event encountered")
                const moves = data.moves as RemoteMove[]
                this._onMovesMade(moves.map(this.moveMapper.fromRemote))
            } else if (data.type === "TOSS_ZAR_EVENT") {
                console.log("dice event encountered")
                const [d1, d2] = data.value
                const color = data.tossedBy === "WHITE" ? Color.WHITE : Color.BLACK
                this._onNewDice([d1, d2], color)
            } else if (data.type === "END_EVENT") {
                this._onEnd(data.win === "WHITE" ? Color.WHITE: Color.BLACK)
            } else {
                console.warn("Ignoring unknown event")
            }
        }
    }

    unsubscribe = () => {
        console.log("Unsubscribed")
        if (this.eventSource !== undefined) {
            this.eventSource.close()
            this.eventSource = undefined
        }
    }
}