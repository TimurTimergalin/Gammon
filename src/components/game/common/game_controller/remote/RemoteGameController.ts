import {BaseGameController} from "../BaseGameController.ts";
import {Rules} from "../../game_rule/Rules.ts";
import {IndexMapping} from "../../game_rule/IndexMapping.ts";
import {PropMapping} from "../../game_rule/PropMapping.ts";
import {GameState} from "../../game_state/GameState.ts";
import {Color} from "../../color.ts";
import {RemoteConnector} from "./RemoteConnector.ts";

export class RemoteGameController<PositionIndexType, PositionPropType> extends BaseGameController<PositionIndexType, PositionPropType> {
    private connector: RemoteConnector<PositionIndexType>

    constructor(
        rules: Rules<PositionIndexType, PositionPropType>,
        indexMapping: IndexMapping<PositionIndexType>,
        propMapping: PropMapping<PositionPropType>,
        gameState: GameState,
        player: Color,
        initPlacement: Map<PositionIndexType, PositionPropType>,
        connector: RemoteConnector<PositionIndexType>,
        active: boolean,
        dice: [[Color, number], [Color, number]]
    ) {
        super(rules, indexMapping, propMapping, gameState, player);
        this.setPlacement(initPlacement)
        this.setDice([dice[0][1], dice[1][1]], [dice[0][0], dice[1][0]])
        this.connector = connector
        this.active = active
    }

    init(): void | (() => void) {
        this.connector.onMovesMade = (moves) => {
            for (const [from, to] of moves) {
                this.rules.move(from, to)
                this.movePieceFrom(this.indexMapping.logicalToPhysical(to), this.indexMapping.logicalToPhysical(from))
                this.active = true
            }
        }

        this.connector.onNewDice = (dice, player) => {
            this.setDice(dice, [player, player])
        }

        this.connector.subscribe()
        return () => this.connector.unsubscribe()
    }

    private splitMoves(moves: [number, number, [number, number][], number[]]) {
        const first = this.indexMapping.physicalToLogical(moves[0])
        const positions = [first]
        const n = moves[3].length
        let prev = first
        for (let i = 0; i < n - 1; ++i) {
            const next = this.rules.getShifted(prev, moves[3][i], this.player)
            positions.push(next)
            prev = next
        }
        positions.push(this.indexMapping.physicalToLogical(moves[1]))

        const res: [PositionIndexType, PositionIndexType][] = []
        const m = positions.length
        for (let i = 0; i < m - 1; ++i) {
            res.push([positions[i], positions[i + 1]])
        }
        return res
    }

    endTurn(): void {
        const split = this.madeMoves.flatMap(x => this.splitMoves(x))
        this.connector.makeMove(split)
        this.gameState.turnComplete = false
        this.gameState.movesMade = false
        this.madeMoves = []
        this.active = false
    }
}