import {OptionCallbacks} from "./ControlPanel";
import {NavigateFunction} from "react-router";
import {useRef} from "react";

const routes: Map<number, string> = new Map()
routes.set(0, "/local-play/backgammon")

export class LocalGameOption implements OptionCallbacks {

    private optionChosen = 0

    playCallback = (navigate: NavigateFunction) => {
        navigate(routes.get(this.optionChosen)!)
    }

    element = () => {
        const select = useRef<HTMLSelectElement | null>(null)

        return (
            <>
                <select ref={select} onSelect={() => {
                    this.optionChosen = select.current!.selectedIndex
                }}>
                    <option value={0}>Короткие нарды</option>
                </select>
            </>
        )

    }
}