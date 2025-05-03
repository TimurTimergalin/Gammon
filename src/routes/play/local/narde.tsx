import {nardeRuleSet} from "../../../game/game_rule/narde/RuleSet";
import {LocalGamePage} from "./_deps/LocalGamePage";

export default function NardeLocalGamePage() {
    return <LocalGamePage ruleset={nardeRuleSet}/>
}