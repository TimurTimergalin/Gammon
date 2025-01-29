import {Rules} from "./Rules.ts";
import {IndexMapper} from "./IndexMapper.ts";
import {PropMapper} from "./PropMapper.ts";
import {InitPlacement} from "./InitPlacement.ts";
import {Color} from "../../common/color.ts";
import {LabelMapper} from "./LabelMapper.ts";

export interface RuleSet<Index, Prop> {
    rules: Rules<Index, Prop>,
    indexMapperFactory: (player: Color) => IndexMapper<Index>,
    labelMapperFactory: (player: Color) => LabelMapper
    propMapper: PropMapper<Prop>,
    initPlacement: InitPlacement<Index, Prop>
}