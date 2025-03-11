import {RulesGameController} from "../rules/RulesGameController";
import {ControlButtonsState} from "../../control_buttons_state/ControlButtonsState";
import {IndexMapper} from "../../game_rule/IndexMapper";
import {DiceState} from "../../dice_state/DiceState";
import {LegalMovesTracker} from "../../legal_moves_tracker/LegalMovesTracker";
import {Rules} from "../../game_rule/Rules";
import {RemoteConnector} from "./RemoteConnector";
import {Color, oppositeColor} from "../../../common/color";
import {Move, splitMove} from "../../board/move";
import {LayerStatus} from "../../../components/game/dice_layer/LayerStatus";
import {moveDuration} from "../../../components/game/pieces_layer/constants";
import {LabelState} from "../../label_state/LabelState";
import {logger} from "../../../logging/main";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {Config} from "../../game_rule/ConfigParser";
import {EndWindowState} from "../../end_window_state/EndWindowState";
import {BoardAnimationSwitch} from "../../board_animation_switch/BoardAnimationSwitch";
import {ScoreState} from "../../score_state/ScoreState";
import {DoubleCubeState} from "../../double_cube_state/DoubleCubeState";

const console = logger("game/game_controller/remote")

export class RemoteGameController<Index, Prop> extends RulesGameController<Index, Prop> {
    private connector: RemoteConnector<Index, Prop>
    private endWindowState: EndWindowState
    private readonly userPlayer: Color

    private _opponentTurnDisplayed: boolean
    private swapBoardAvailable = true

    private updateActivity() {
        this.active = this.opponentTurnDisplayed || this.canOfferDouble
    }

    private get opponentTurnDisplayed(): boolean {
        return this._opponentTurnDisplayed
    }

    private set opponentTurnDisplayed(val: boolean) {
        this._opponentTurnDisplayed = val
        this.updateActivity()
    }

    private scoreState: ScoreState

    constructor({connector, userPlayer, player, endWindowState, scoreState, ...base}: {
        board: BoardSynchronizer<Index, Prop>,
        controlButtonsState: ControlButtonsState,
        player: Color,
        rules: Rules<Index, Prop>,
        indexMapper: IndexMapper<Index>,
        diceState: DiceState,
        legalMovesTracker: LegalMovesTracker,
        connector: RemoteConnector<Index, Prop>,
        userPlayer: Color,
        labelState: LabelState,
        endWindowState: EndWindowState,
        boardAnimationSwitch: BoardAnimationSwitch,
        scoreState: ScoreState,
        doubleCubeState: DoubleCubeState
    }) {
        const active = player === userPlayer
        super({...base, active: active});
        this.connector = connector
        this.player = player
        this.userPlayer = userPlayer
        this._opponentTurnDisplayed = active
        this.endWindowState = endWindowState
        this.scoreState = scoreState
    }

    init(config: Config<Index, Prop>) {
        this.diceState.dice1 = config.dice[0]
        this.diceState.dice2 = config.dice[1]
        this.doubleCubeState.state = config.doubleCube.state
        this.doubleCubeState.value =
            config.doubleCube.state === "unavailable" ? undefined :
                config.doubleCube.state === "free" ? 64 :
                    config.doubleCube.value

        if (config.dice[0] !== null && config.dice[1] !== null && config.dice[0].value < config.dice[1].value) {
            this.diceState.swapDice()
        }
        if (this.diceState.dice1 !== null) {
            console.assert(this.diceState.dice2 !== null)
            this.calculateDice()
        } else {
            if (this.player === this.userPlayer) {
                this.canOfferDouble = this._canOfferDouble()
            } else {
                this.canOfferDouble = false
            }
            if (this.player === this.userPlayer) {
                if (this.doubleCubeState.state !== "offered_to_white" && this.doubleCubeState.state !== "offered_to_black") {
                    this.controlButtonsState.canRollDice = true
                }
            }
        }
        this.scoreState.white = config.points.white
        this.scoreState.black = config.points.black
        this.scoreState.total = config.points.total
    }

    endTurn = (): void => {
        console.assert(this.player === this.userPlayer)
        console.assert(this.active)
        if (this.previousDoubleState !== undefined) {
            console.assert(this.performedMoves.length === 0)
            if (this.doubleCubeState.state === "offered_to_black" || this.doubleCubeState.state === "offered_to_white") {
                this.connector.offerDouble()
            } else {
                console.assert(
                    (this.doubleCubeState.state === "belongs_to_black" && this.userPlayer === Color.BLACK) ||
                    (this.doubleCubeState.state === "belongs_to_white" && this.userPlayer === Color.WHITE)
                )
                this.connector.acceptDouble()
            }
            this.previousDoubleState = undefined
        } else {
            const splitMoves = this.performedMoves
                .flatMap(m => splitMove(m.primaryMove, m.dice, this.player, this.rules))
            this.connector.makeMove(splitMoves)
            this.performedMoves = []
            this.diceState.dice1 = null
            this.diceState.dice2 = null
        }
        this.opponentTurnDisplayed = false
        this.player = oppositeColor(this.player)
        this.controlButtonsState.turnComplete = false
        this.controlButtonsState.movesMade = false
        this.canOfferDouble = false
    };

    onMovesMade = (moves: Move<Index>[]) => {
        // const merged = mergeMoves(moves)
        // merged.forEach(this.board.performMoveLogical)

        const squashedMoves = this.rules.squashMoves(moves)

        const delayMs = 50

        const displayMove = (index: number) => {
            console.assert(index < squashedMoves.length)

            for (const move of squashedMoves[index]) {
                this.board.performMoveLogical(move)
            }

            if (index + 1 === squashedMoves.length) {
                this.opponentTurnDisplayed = true
                this.swapBoardAvailable = true
                this.controlButtonsState.canRollDice = true
                this.diceState.dice1 = null
                this.diceState.dice2 = null
                this.connector.blocked = false
                this.player = oppositeColor(this.player)
                this.canOfferDouble = this._canOfferDouble()
            } else {
                setTimeout(
                    () => displayMove(index + 1),
                    delayMs + moveDuration * 1000
                )
            }
        }

        if (squashedMoves.length === 0) {
            this.opponentTurnDisplayed = true
            this.controlButtonsState.canRollDice = true
            this.diceState.dice1 = null
            this.diceState.dice2 = null
            this.player = oppositeColor(this.player)
            this.canOfferDouble = this._canOfferDouble()
        } else {
            this.swapBoardAvailable = false
            this.connector.blocked = true
            displayMove(0)
        }
    };

    onNewDice = (dice: [number, number], player: Color) => {
        const dice1 = {
            value: dice[0],
            color: player,
            unavailabilityStatus: LayerStatus.NONE,
            usageStatus: LayerStatus.NONE
        }

        const dice2 = {
            value: dice[1],
            color: player,
            unavailabilityStatus: LayerStatus.NONE,
            usageStatus: LayerStatus.NONE
        }

        this.player = player
        this.diceState.dice1 = dice1
        this.diceState.dice2 = dice2
        if (dice1.value < dice2.value) {
            this.diceState.swapDice()
        }
        this.calculateDice()
    };

    onEnd = (winner: Color, newConfig: Config<Index, Prop> | undefined, points: { white: number, black: number }) => {
        this.active = false
        this.scoreState.white = points.white
        this.scoreState.black = points.black
        if (newConfig === undefined) {
            this.endWindowState.title = winner === Color.WHITE ? "Белые выиграли" : "Черные выиграли"
            this.diceState.dice1 = null
            this.diceState.dice2 = null
            this.controlButtonsState.turnComplete = false
            this.controlButtonsState.canRollDice = false
            this.controlButtonsState.movesMade = false
            this._opponentTurnDisplayed = false
            this.active = false
            return
        }

        this.connector.blocked = true
        this.controlButtonsState.turnComplete = false
        this.controlButtonsState.canRollDice = false
        this.controlButtonsState.movesMade = false
        setTimeout(() => {
            this.boardAnimationSwitch.withTurnedOff(() => {
                this.board.updateLogical(newConfig.placement)
                this.player = newConfig.player

                this.active = this.player === this.userPlayer
                this._opponentTurnDisplayed = this.active  // Не-property версии использованы специально

                this.init(newConfig)
                this.connector.blocked = false
            })
        }, 500)
    }

    onOfferDouble = (by: Color) => {
        console.assert(by === oppositeColor(this.userPlayer))
        if (this.doubleCubeState.convertedValue === 1) {
            this.doubleCubeState.value = 2
        } else {
            console.assert(this.doubleCubeState.value !== undefined)
            this.doubleCubeState.value! *= 2
        }
        if (this.userPlayer === Color.WHITE) {
            this.doubleCubeState.state = "offered_to_white"
        } else {
            this.doubleCubeState.state = "offered_to_black"
        }
        this.player = oppositeColor(this.player)
        this.active = true
    }

    onAcceptDouble = (by: Color) => {
        console.assert(by === oppositeColor(this.userPlayer))
        if (by === Color.WHITE) {
            console.assert(this.doubleCubeState.state === "offered_to_white")
            this.doubleCubeState.state = "belongs_to_white"
        } else {
            console.assert(this.doubleCubeState.state === "offered_to_black")
            this.doubleCubeState.state = "belongs_to_black"
        }
        this.controlButtonsState.canRollDice = true
        this.canOfferDouble = false
        this.player = this.userPlayer
        this.active = true
    }

    swapBoard(): void {
        if (this.swapBoardAvailable) {
            this._swapBoard()
        }
    }

    rollDice(): void {
        this.connector.rollDice()
        this.controlButtonsState.canRollDice = false
        this.canOfferDouble = false
    }

    concedeMatch(): never {
        throw new Error("NOT IMPLEMENTED")  // TODO: implement concedeMatch
    }

    concedeGame(): never {
        throw new Error("NOT IMPLEMENTED")  // TODO: implement concedeGame
    }


}