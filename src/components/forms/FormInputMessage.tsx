import {observer} from "mobx-react-lite";
import {ComponentProps} from "react";
import {useFormState} from "../../forms/FormState.ts";
import {logger} from "../../logging/main.ts";

const console = logger("components/forms")

export const FormInputMessage = observer(function FormInputMessage(
    {index, className, ...elementProps}: {
        index: number,
        className?: string
    } & ComponentProps<"p">
){
    const formState = useFormState()
    const validity = formState.validity.get(index)!
    console.assert(validity !== undefined)
    const touched = formState.touched.get(index)
    const toDisplay = touched && !validity.success

    return (
        <p
            className={className}
            {...elementProps}
        >{toDisplay ? validity.message : ""}</p>
    )
})