import {Color} from "../../../common/color";
import {finishTurn, subscribeForEvents} from "../../../requests/requests";
import {logResponseError} from "../../../requests/util";
import {Move} from "../../board/move";
import {RemoteMoveMapper} from "../../game_rule/RemoteMoveMapper";
import {logger} from "../../../logging/main";
import {Config} from "../../game_rule/ConfigParser";

const console = logger("game/game_controller/remote")

export interface RemoteConnector<Index, Prop> {
    subscribe(): void

    set onMovesMade(value: (moves: Move<Index>[]) => void)

    set onNewDice(value: (dice: [number, number], player: Color) => void)

    set onEnd(value: (winner: Color, next_game: Config<Index, Prop> | undefined) => void)

    makeMove(moves: Move<Index>[]): void

    unsubscribe(): void

    get blocked(): boolean
    set blocked(val: boolean)
}

export class RemoteConnectorImpl<RemoteMove, Index, Prop> implements RemoteConnector<Index, Prop> {
    private readonly moveMapper: RemoteMoveMapper<RemoteMove, Index>
    private readonly roomId: number
    private readonly configGetter: (roomId: number) => Promise<Config<Index, Prop>>

    blocked: boolean = false

    constructor({moveMapper, roomId, configGetter}: {
                    moveMapper: RemoteMoveMapper<RemoteMove, Index>,
                    roomId: number,
                    configGetter: (roomId: number) => Promise<Config<Index, Prop>>
                }
    ) {
        this.moveMapper = moveMapper;
        this.roomId = roomId
        this.configGetter = configGetter
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

    private _onEnd: (winner: Color, next_game: Config<Index, Prop> | undefined) => void = () => console.warn("No onEnd set")
    set onEnd(value: (winner: Color, next_game: Config<Index, Prop> | undefined) => void) {
        this._onEnd = value
    }

    private eventSource: EventSource | undefined = undefined

    subscribe = () => {
        this.eventSource = subscribeForEvents(this.roomId)
        console.debug("Subscription initiated")
        this.eventSource.addEventListener("error", (ev) => {
            console.error(ev)
        })
        this.eventSource.addEventListener("open", () => {
            console.debug("Stream opened")
        })
        this.eventSource.onmessage = (ev) => {
            console.debug(ev)
            const data = JSON.parse(ev.data)
            if (data.type === undefined) {
                console.warn("Event without a type encountered: ", ev)
            } else if (data.type === "MOVE_EVENT") {
                console.debug("move event encountered")
                const moves = data.moves as RemoteMove[]
                this._onMovesMade(moves.map(this.moveMapper.fromRemote))
            } else if (data.type === "TOSS_ZAR_EVENT") {
                console.debug("dice event encountered")
                const [d1, d2] = data.value
                const color = data.tossedBy === "WHITE" ? Color.WHITE : Color.BLACK
                this._onNewDice([d1, d2], color)
            } else if (data.type === "END_GAME_EVENT") {
                const winner = data.win === "WHITE" ? Color.WHITE : Color.BLACK
                const matchEnd = data.isMatchEnd

                if (matchEnd) {
                    this._onEnd(winner, undefined)
                } else {
                    this.configGetter(this.roomId).then(conf => this._onEnd(winner, conf))
                }
            } else {
                console.warn("Ignoring unknown event")
            }
        }

        this.eventSource?.addEventListener("message", () => {
            if (this.blocked) {
                console.error("Race condition")
            }
        })
    }

    unsubscribe = () => {
        console.log("Unsubscribed")
        if (this.eventSource !== undefined) {
            this.eventSource.close()
            this.eventSource = undefined
        }
    }
}