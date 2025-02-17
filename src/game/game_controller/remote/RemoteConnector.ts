import {Color} from "../../../common/color";
import {backgammonFinishTurn, backgammonRollDice, subscribeForEvents} from "../../../requests/requests";
import {logResponseError} from "../../../requests/util";
import {Move} from "../../board/move";
import {RemoteMoveMapper} from "../../game_rule/RemoteMoveMapper";
import {logger} from "../../../logging/main";
import {Config} from "../../game_rule/ConfigParser";
import {FetchType} from "../../../common/requests";


const console = logger("game/game_controller/remote")

export interface RemoteConnector<Index, Prop> {
    subscribe(): void

    set onMovesMade(value: (moves: Move<Index>[]) => void)

    set onNewDice(value: (dice: [number, number], player: Color) => void)

    set onEnd(value: (winner: Color, next_game: Config<Index, Prop> | undefined, points: {
        white: number,
        black: number
    }) => void)

    makeMove(moves: Move<Index>[]): void

    rollDice(): void

    unsubscribe(): void

    set blocked(val: boolean)
}

export class RemoteConnectorImpl<RemoteMove, Index, Prop> implements RemoteConnector<Index, Prop> {
    private queue: MessageEvent[] = []

    set blocked(value: boolean) {
        console.assert(this.eventSource !== undefined)
        if (value) {
            this.eventSource!.onmessage = (e) => this.queue.push(e)
        } else {
            this.setOnMessage()
            for (const ev of this.queue) {
                this.eventSource!.dispatchEvent(ev)
            }
            this.queue = []
        }
    }

    private readonly moveMapper: RemoteMoveMapper<RemoteMove, Index>
    private readonly roomId: number
    private readonly configGetter: (roomId: number) => Promise<Config<Index, Prop>>
    private readonly fetch: FetchType


    constructor({moveMapper, roomId, configGetter, fetch}: {
                    moveMapper: RemoteMoveMapper<RemoteMove, Index>,
                    roomId: number,
                    configGetter: (roomId: number) => Promise<Config<Index, Prop>>,
                    fetch: FetchType
                }
    ) {
        this.moveMapper = moveMapper;
        this.roomId = roomId
        this.configGetter = configGetter
        this.fetch = fetch
    }

    makeMove = (moves: Move<Index>[]): void => {
        backgammonFinishTurn(this.fetch, this.roomId, moves.map(this.moveMapper.toRemote))
            .then(resp => logResponseError(resp, "making a move"))
    }

    rollDice(): void {
        backgammonRollDice(this.fetch, this.roomId).then(resp => logResponseError(resp, "rolling dice"))
    }

    private _onMovesMade: (moves: Move<Index>[]) => void = () => console.warn("No onMovesMade set")
    set onMovesMade(value: (moves: Move<Index>[]) => void) {
        this._onMovesMade = value;
    }

    private _onNewDice: (dice: [number, number], player: Color) => void = () => console.warn("No onNewDice set")
    set onNewDice(value: (dice: [number, number], player: Color) => void) {
        this._onNewDice = value;
    }

    private _onEnd: (winner: Color, next_game: Config<Index, Prop> | undefined, points: {
        white: number,
        black: number
    }) => void = () => console.warn("No onEnd set")
    set onEnd(value: (winner: Color, next_game: Config<Index, Prop> | undefined, points: {
        white: number,
        black: number
    }) => void) {
        this._onEnd = value
    }

    private eventSource: EventSource | undefined = undefined

    private setOnMessage() {
        this.eventSource!.onmessage = (ev) => {
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
                const points = {
                    white: data.whitePoints,
                    black: data.blackPoints
                }
                const matchEnd = data.isMatchEnd

                if (matchEnd) {
                    this._onEnd(winner, undefined, points)
                } else {
                    this.configGetter(this.roomId).then(conf => this._onEnd(winner, conf, points))
                }
            } else {
                console.warn("Ignoring unknown event")
            }
        }

    }

    subscribe = () => {
        this.eventSource = subscribeForEvents(this.roomId)
        console.debug("Subscription initiated")
        this.eventSource.addEventListener("error", (ev) => {
            console.error(ev)
        })
        this.eventSource.addEventListener("open", () => {
            console.debug("Stream opened")
        })
        this.setOnMessage()
    }

    unsubscribe = () => {
        console.log("Unsubscribed")
        if (this.eventSource !== undefined) {
            this.eventSource.close()
            this.eventSource = undefined
        }
    }
}