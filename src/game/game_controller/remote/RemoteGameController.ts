import {RulesGameController} from "../rules/RulesGameController";
import {ControlButtonsState} from "../../ControlButtonsState";
import {IndexMapper} from "../../game_rule/IndexMapper";
import {DiceState} from "../../dice_state/DiceState";
import {LegalMovesTracker} from "../../LegalMovesTracker";
import {Rules} from "../../game_rule/Rules";
import {RemoteConnector} from "./RemoteConnector";
import {Color, oppositeColor} from "../../../common/color";
import {Move} from "../../board/move";
import {LayerStatus} from "../../../components/game/dice_layer/LayerStatus";
import {moveDuration} from "../../../components/game/pieces_layer/constants";
import {DiceStatus} from "../../dice_state/DiceStatus";
import {LabelState} from "../../LabelState";
import {logger} from "../../../logging/main";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {Config} from "../../game_rule/ConfigParser";
import {EndWindowState} from "../../EndWindowState";
import {BoardAnimationSwitch} from "../../BoardAnimationSwitch";

const console = logger("game/game_controller/remote")

export class RemoteGameController<Index, Prop> extends RulesGameController<Index, Prop> {
    private connector: RemoteConnector<Index, Prop>
    private endWindowState: EndWindowState
    private boardAnimationSwitch: BoardAnimationSwitch
    private readonly userPlayer: Color

    private _userDiceReceived: boolean
    private _opponentTurnDisplayed: boolean

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

    constructor({connector, userPlayer, player, endWindowState, boardAnimationSwitch, ...base}: {
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
        boardAnimationSwitch: BoardAnimationSwitch
    }) {
        const active = player === userPlayer
        super({...base, active: active});
        this.connector = connector
        this.player = player
        this.userPlayer = userPlayer
        this._opponentTurnDisplayed = active
        this._userDiceReceived = active
        this.endWindowState = endWindowState
        this.boardAnimationSwitch = boardAnimationSwitch
    }

    init(config: Config<Index, Prop>) {
        this.diceState.dice1 = config.dice[0]
        this.diceState.dice2 = config.dice[1]
        if (config.dice[0].value < config.dice[1].value) {
            this.diceState.swapDice()
        }
        this.calculateDice()
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
            } else {
                setTimeout(
                    () => displayMove(index + 1),
                    delayMs + moveDuration * 1000
                )
            }
        }

        if (squashedMoves.length === 0) {
            this.opponentTurnDisplayed = true
        } else {
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

    onEnd = (winner: Color, newConfig: Config<Index, Prop> | undefined) => {
        this.active = false
        if (newConfig === undefined) {
            this.endWindowState.title = winner === Color.WHITE ? "Белые выиграли" : "Черные выиграли"
            this.diceState.dice1 = null
            this.diceState.dice2 = null
            return
        }

        this.connector.blocked = true
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
}