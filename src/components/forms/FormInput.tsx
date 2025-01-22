import {observer} from "mobx-react-lite";
import {ComponentProps, useCallback, useEffect, useRef} from "react";
import {useFormState} from "../../forms/FormState.ts";
import {ValidityCheckResult} from "./validators.ts";
import {runInAction} from "mobx";


export const FormInput = observer(function FormInput(
    {validityCheck, className, index, ...inputProps}: ComponentProps<"input"> &
        { validityCheck: (value: string) => ValidityCheckResult, className?: string, index: number }
) {
    const formState = useFormState()
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const result = validityCheck(inputRef.current!.value)
        formState.validationSuccess.set(index, result[0])
        formState.touched.set(index, false)
    }, [formState, index, validityCheck])

    const touched = formState.touched.get(index)!

    const checkValidity = useCallback(() => {
        const result = validityCheck(inputRef.current!.value)
        runInAction(() => formState.validationSuccess.set(index, result[0]))
        if (!result[0]) {
            inputRef.current!.setCustomValidity(result[1])
        } else {
            inputRef.current!.setCustomValidity("")
        }
    }, [formState, index, validityCheck])

    useEffect(() => {
        if (touched) {
            checkValidity()
        }
    }, [checkValidity, touched]);

    const onInputChange = useCallback(() => {
        runInAction(() => {
            formState.touched.set(index, true)
        })
        checkValidity()
        formState.updateFormData()
    }, [checkValidity, formState, index])

    return (
        <input ref={inputRef} {...inputProps} className={className} onChange={onInputChange} onFocus={onInputChange}/>
    )
})