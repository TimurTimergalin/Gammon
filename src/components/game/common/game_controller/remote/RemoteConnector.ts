import {Config, InitConfigMapper} from "../../game_rule/InitConfigMapper.ts";
import {RemoteMoveMapper} from "../../game_rule/RemoteMoveMapper.ts";
import {Color} from "../../color.ts";

export interface RemoteConnector<PositionIndexType> {
    subscribe(): void

    set onMovesMade(value: (moves: [PositionIndexType, PositionIndexType][]) => void)

    set onNewDice(value: (dice: [number, number], player: Color) => void)

    makeMove(moves: [PositionIndexType, PositionIndexType][]): void

    unsubscribe(): void
}

export class RemoteConnectorImpl<RemoteConfigType, RemoteMoveType, PositionIndexType, PositionPropType> implements RemoteConnector<PositionIndexType> {
    private readonly configMapper: InitConfigMapper<RemoteConfigType, PositionIndexType, PositionPropType>
    private readonly moveMapper: RemoteMoveMapper<RemoteMoveType, PositionIndexType>
    private readonly configUri: (id: number) => string
    private readonly eventsUri: (id: number) => string
    private readonly finishTurnUri: (id: number) => string
    private readonly roomId: number

    private contentTypeHeader = {
        "Content-Type": "application/json"
    }

    constructor(configMapper: InitConfigMapper<RemoteConfigType, PositionIndexType, PositionPropType>,
                moveMapper: RemoteMoveMapper<RemoteMoveType, PositionIndexType>,
                roomId: number,
                configUri: (id: number) => string,
                eventsUri: (id: number) => string,
                finishTurnUri: (id: number) => string) {
        this.configMapper = configMapper;
        this.moveMapper = moveMapper;
        this.roomId = roomId
        this.configUri = configUri;
        this.eventsUri = eventsUri;
        this.finishTurnUri = finishTurnUri;
    }

    makeMove(moves: [PositionIndexType, PositionIndexType][]): void {
        console.assert(this.roomId !== undefined)
        fetch(this.finishTurnUri(this.roomId!), {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                moves: moves.map(this.moveMapper.toRemote)
            }),
            headers: {
                ...this.contentTypeHeader
            }
        }).then(resp => {
            if (resp.status !== 200) {
                console.error("Failed to make move due to error ", resp.status)
            }
        })
    }

    async getConfig(): Promise<Config<PositionIndexType, PositionPropType>> {
        console.assert(this.roomId !== undefined)
        const resp = await fetch(this.configUri(this.roomId!), {
            credentials: "include"
        })

        if (resp.status !== 200) {
            console.error("Failed to fetch config due to error ", resp.status)
        }

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

    private eventSource: EventSource | undefined = undefined

    subscribe() {
        console.assert(this.roomId !== undefined)
        console.log("Subscription initiated")
        this.eventSource = new EventSource(this.eventsUri(this.roomId!), {withCredentials: true})
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