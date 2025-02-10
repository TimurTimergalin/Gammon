import {observer} from "mobx-react-lite";
import {ComponentProps} from "react";
import {useFormState} from "../../controller/forms/FormState";

export const FormInputMessage = observer(function FormInputMessage(
    {index, className, ...elementProps}: {
        index: number,
        className?: string
    } & ComponentProps<"p">
){
    const formState = useFormState()
    const validity = formState.validity.get(index)
    const touched = formState.touched.get(index)
    const toDisplay = touched && validity !== undefined && !validity.success

    return (
        <p
            className={className}
            {...elementProps}
        >{toDisplay ? validity.message : ""}</p>
    )
})