import {BaseGameController} from "./BaseGameController.ts";
import {Rules} from "../game_rule/Rules.ts";
import {IndexMapping} from "../game_rule/IndexMapping.ts";
import {PropMapping} from "../game_rule/PropMapping.ts";
import {GameState} from "../game_state/GameState.ts";
import {Color, oppositeColor} from "../color.ts";

export class LocalGameController<PositionIndexType, PositionPropsType> extends BaseGameController<PositionIndexType, PositionPropsType> {
    private initialized = false
    private readonly defaultPlacementFactory: () => Map<PositionIndexType, PositionPropsType>
    constructor(
        rules: Rules<PositionIndexType, PositionPropsType>,
        indexMapping: IndexMapping<PositionIndexType>,
        propMapping: PropMapping<PositionPropsType>,
        gameState: GameState,
        defaultPlacementFactory: () => Map<PositionIndexType, PositionPropsType>
    ) {
        super(rules, indexMapping, propMapping, gameState, Color.WHITE)
        this.defaultPlacementFactory = defaultPlacementFactory
    }

    init() {
        if (this.initialized) {
            return
        }
        this.setPlacement(this.defaultPlacementFactory())
        let [diceVal1, diceVal2] = this.generateDice()
        while (diceVal1 === diceVal2) {
            [diceVal1, diceVal2] = this.generateDice()
        }

        this.player = diceVal1 < diceVal2 ? Color.BLACK : Color.WHITE
        this.setDice([diceVal1, diceVal2], [Color.WHITE, Color.BLACK])
        this.active = true
        this.initialized = true
    }

    endTurn(): void {
        this.gameState.turnComplete = false
        this.gameState.movesMade = false
        this.madeMoves = []
        this.player = oppositeColor(this.player)
        this.setDice(this.generateDice(), [this.player, this.player])
    }
}