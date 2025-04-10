import {LocalGamePage} from "./_deps/LocalGamePage";
import {nardeRuleSet} from "../../../game/game_rule/narde/RuleSet";

export default function NardeLocalGamePage() {
    return <LocalGamePage ruleset={nardeRuleSet}/>
}