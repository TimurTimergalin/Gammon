import {Rules} from "./Rules";
import {IndexMapper} from "./IndexMapper";
import {PropMapper} from "./PropMapper";
import {InitPlacement} from "./InitPlacement";
import {Color} from "../../common/color";
import {LabelMapper} from "./LabelMapper";
import {DoubleCubePositionMapper} from "./DoubleCubePositionMapper";
import {HistoryEncoder} from "./HistoryEncoder";
import {DiceRule} from "./DiceRule";
import {TimeControlTable} from "./TimeControlTable";

export interface RuleSet<Index, Prop> {
    rules: Rules<Index, Prop>,
    indexMapperFactory: (player: Color) => IndexMapper<Index>,
    labelMapperFactory: (player: Color) => LabelMapper
    doubleCubePositionMapperFactory: (player: Color) => DoubleCubePositionMapper
    propMapper: PropMapper<Prop>,
    initPlacement: InitPlacement<Index, Prop>,
    historyEncoder: HistoryEncoder<Index>,
    diceRule: DiceRule,
    timeControlTable: TimeControlTable
}