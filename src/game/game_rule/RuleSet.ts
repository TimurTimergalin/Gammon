import {Rules} from "./Rules";
import {IndexMapper} from "./IndexMapper";
import {PropMapper} from "./PropMapper";
import {InitPlacement} from "./InitPlacement";
import {Color} from "../../common/color";
import {LabelMapper} from "./LabelMapper";

export interface RuleSet<Index, Prop> {
    rules: Rules<Index, Prop>,
    indexMapperFactory: (player: Color) => IndexMapper<Index>,
    labelMapperFactory: (player: Color) => LabelMapper
    propMapper: PropMapper<Prop>,
    initPlacement: InitPlacement<Index, Prop>
}