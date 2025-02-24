import {RulesGameController} from "../rules/RulesGameController";
import {ControlButtonsState} from "../../control_buttons_state/ControlButtonsState";
import {IndexMapper} from "../../game_rule/IndexMapper";
import {DiceState} from "../../dice_state/DiceState";
import {LegalMovesTracker} from "../../legal_moves_tracker/LegalMovesTracker";
import {Rules} from "../../game_rule/Rules";
import {RemoteConnector} from "./RemoteConnector";
import {Color, oppositeColor} from "../../../common/color";
import {Move} from "../../board/move";
import {LayerStatus} from "../../../components/game/dice_layer/LayerStatus";
import {moveDuration} from "../../../components/game/pieces_layer/constants";
import {DiceStatus} from "../../dice_state/DiceStatus";
import {LabelState} from "../../label_state/LabelState";
import {logger} from "../../../logging/main";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {Config} from "../../game_rule/ConfigParser";
import {EndWindowState} from "../../end_window_state/EndWindowState";
import {BoardAnimationSwitch} from "../../board_animation_switch/BoardAnimationSwitch";
import {ScoreState} from "../../score_state/ScoreState";

const console = logger("game/game_controller/remote")

export class RemoteGameController<Index, Prop> extends RulesGameController<Index, Prop> {
    private connector: RemoteConnector<Index, Prop>
    private endWindowState: EndWindowState
    private readonly userPlayer: Color

    private _userDiceReceived: boolean
    private _opponentTurnDisplayed: boolean
    private swapBoardAvailable = true

    private diceToSet: DiceStatus[] = []

    private updateActivity() {
        this.active = this.userDiceReceived && this.opponentTurnDisplayed
        if (this.active) {
            console.assert(this.diceToSet.length === 2)
            this.diceState.dice1 = this.diceToSet[0]
            this.diceState.dice2 = this.diceToSet[1]
            if (this.diceToSet[0].value < this.diceToSet[1].value) {
                this.diceState.swapDice()
            }

            this.diceToSet.splice(0, 2)
            this.calculateDice()
        }
    }

    private get userDiceReceived(): boolean {
        return this._userDiceReceived
    }

    private set userDiceReceived(val: boolean) {
        this._userDiceReceived = val
        this.updateActivity()
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
        scoreState: ScoreState
    }) {
        const active = player === userPlayer
        super({...base, active: active});
        this.connector = connector
        this.player = player
        this.userPlayer = userPlayer
        this._opponentTurnDisplayed = active
        this._userDiceReceived = active
        this.endWindowState = endWindowState
        this.scoreState = scoreState
    }

    init(config: Config<Index, Prop>) {
        this.diceState.dice1 = config.dice[0]
        this.diceState.dice2 = config.dice[1]
        if (config.dice[0] !== null && config.dice[1] !== null && config.dice[0].value < config.dice[1].value) {
            this.diceState.swapDice()
        }
        if (this.diceState.dice1 !== null) {
            console.assert(this.diceState.dice2 !== null)
            this.calculateDice()
        } else if (this.player === this.userPlayer) {
            this.controlButtonsState.canRollDice = true
        }
        this.scoreState.white = config.points.white
        this.scoreState.black = config.points.black
        this.scoreState.total = config.points.total
    }

    private splitMove(move: Move<Index>, diceUsed: number[], player: Color): Move<Index>[] {
        const res = []

        let from = move.from
        for (const dice of diceUsed) {
            const to = this.rules.movedBy(from, dice, player)
            res.push({
                from: from,
                to: to
            })
            from = to
        }
        console.assert(from === move.to)
        return res
    }

    endTurn = (): void => {
        console.assert(this.player === this.userPlayer)
        console.assert(this.active)
        const splitMoves = this.performedMoves
            .flatMap(m => this.splitMove(m.primaryMove, m.dice, this.player))
        this.connector.makeMove(splitMoves)
        this.controlButtonsState.turnComplete = false
        this.controlButtonsState.movesMade = false
        this.performedMoves = []
        this.opponentTurnDisplayed = false
        this.userDiceReceived = false
        this.player = oppositeColor(this.player)
        this.diceState.dice1 = null
        this.diceState.dice2 = null
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
        if (player === this.userPlayer) {
            console.assert(this.diceToSet.length === 0)
            this.diceToSet.push(dice1, dice2)
            this.userDiceReceived = true
        } else {
            this.diceState.dice1 = dice1
            this.diceState.dice2 = dice2
            if (dice1.value < dice2.value) {
                this.diceState.swapDice()
            }
            this.calculateDice()
        }
    };

    onEnd = (winner: Color, newConfig: Config<Index, Prop> | undefined, points: {white: number,black: number}) => {
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
            this._userDiceReceived = false
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
                this._userDiceReceived = this.active

                this.init(newConfig)
                this.connector.blocked = false
            })
        }, 500)
    };

    swapBoard(): void {
        if (this.swapBoardAvailable) {
            this._swapBoard()
        }
    }

    rollDice(): void {
        this.connector.rollDice()
        this.controlButtonsState.canRollDice = false
    }
}