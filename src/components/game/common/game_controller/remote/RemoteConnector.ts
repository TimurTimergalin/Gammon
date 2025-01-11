import {Config, InitConfigMapper} from "../../game_rule/InitConfigMapper.ts";
import {RemoteMoveMapper} from "../../game_rule/RemoteMoveMapper.ts";
import {Color} from "../../color.ts";
import {finishTurn, getConfig, subscribeForEvents} from "../../../../../requests/requests.ts";
import {logResponseError} from "../../../../../requests/util.ts";

export interface RemoteConnector<PositionIndexType> {
    subscribe(): void

    set onMovesMade(value: (moves: [PositionIndexType, PositionIndexType][]) => void)

    set onNewDice(value: (dice: [number, number], player: Color) => void)

    set onEnd(value: (winner: Color) => void)

    makeMove(moves: [PositionIndexType, PositionIndexType][]): void

    unsubscribe(): void
}

export class RemoteConnectorImpl<RemoteConfigType, RemoteMoveType, PositionIndexType, PositionPropType> implements RemoteConnector<PositionIndexType> {
    private readonly configMapper: InitConfigMapper<RemoteConfigType, PositionIndexType, PositionPropType>
    private readonly moveMapper: RemoteMoveMapper<RemoteMoveType, PositionIndexType>
    private readonly roomId: number

    constructor(configMapper: InitConfigMapper<RemoteConfigType, PositionIndexType, PositionPropType>,
                moveMapper: RemoteMoveMapper<RemoteMoveType, PositionIndexType>,
                roomId: number) {
        this.configMapper = configMapper;
        this.moveMapper = moveMapper;
        this.roomId = roomId
    }

    makeMove(moves: [PositionIndexType, PositionIndexType][]): void {
        finishTurn(this.roomId, moves.map(this.moveMapper.toRemote))
            .then(resp => logResponseError(resp, "making a move"))
    }

    async getConfig(): Promise<Config<PositionIndexType, PositionPropType>> {
        const resp = await getConfig(this.roomId)
        logResponseError(resp, "getting config")
        const js = await resp.json()
        return this.configMapper.mapConfig(js as RemoteConfigType)
    }

    private _onMovesMade: (moves: [PositionIndexType, PositionIndexType][]) => void = () => console.warn("No onMovesMade set")
    set onMovesMade(value: (moves: [PositionIndexType, PositionIndexType][]) => void) {
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

    subscribe() {
        this.eventSource = subscribeForEvents(this.roomId)
        console.log("Subscription initiated")
        this.eventSource.addEventListener("error", (ev) => {
            console.log("error, ", ev)
        })
        this.eventSource.addEventListener("open", () => {
            console.log("IT WORKS!")
        })
        this.eventSource.addEventListener("message", (ev) => {
            console.log(ev)
            const data = JSON.parse(ev.data)
            if (data.type === undefined) {
                console.warn("Event without a type encountered: ", ev)
            } else if (data.type === "MOVE_EVENT") {
                console.log("move event encountered")
                const moves = data.moves as RemoteMoveType[]
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
        })

        setInterval(() => {

        })
    }

    unsubscribe() {
        if (this.eventSource !== undefined) {
            this.eventSource.close()
            this.eventSource = undefined
        }
    }
}